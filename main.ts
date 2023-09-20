import { App, Modal, Plugin } from 'obsidian';
import { Processor } from 'src/processor';
import { DEFAULT_SETTINGS } from 'src/settings';
import { TTRPGActionsSettingsTab } from 'src/ui/settingsTab';


export default class TTRPGActionsPlugin extends Plugin {
	settings: TTRPGActionsSettingsTab;
	processor: Processor

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TTRPGActionsSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.registerMarkdownCodeBlockProcessor("ttrpg-action", (src, el, ctx) => {
				this.processor.process(src, el, ctx)
			})
		})
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.processor = new Processor();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
