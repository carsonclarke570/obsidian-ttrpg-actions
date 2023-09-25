import { Plugin } from 'obsidian';
import { Indexer } from 'src/indexer';
import { BlockProcessor, ListProcessor } from 'src/processor';
import { DEFAULT_SETTINGS, TTRPGActionsSettings } from 'src/settings';
import { TTRPGActionsSettingsTab } from 'src/ui/settingsTab';


export default class TTRPGActionsPlugin extends Plugin {
	settings: TTRPGActionsSettings;
	blockProcessor: BlockProcessor;
	listProcessor: ListProcessor;
	indexer: Indexer

	async onload() {
		await this.loadSettings();
		await this.indexer.refresh()

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TTRPGActionsSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.registerMarkdownCodeBlockProcessor(this.settings.actionBlockId, (src, el, ctx) => {
				this.blockProcessor.process(src, el, ctx)
			})

			this.registerMarkdownCodeBlockProcessor(this.settings.actionListId, (src, el, ctx) => {
				this.listProcessor.process(src, el, ctx)
			})
		})

		this.registerEvent(this.app.vault.on("create", () => {
			
		}))

		this.registerEvent(this.app.vault.on("delete", async () => {
			await this.indexer.refresh()
		}))

		this.registerEvent(this.app.vault.on("modify", async () => {
			await this.indexer.refresh()
		}))

		this.registerEvent(this.app.vault.on("rename", async () => {
			await this.indexer.refresh()
		}))
	}
	
	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.indexer = new Indexer(this.app.vault, this.app.fileManager, this.settings);
		this.blockProcessor = new BlockProcessor(this.settings);
		this.listProcessor = new ListProcessor(this.settings, this.indexer);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
