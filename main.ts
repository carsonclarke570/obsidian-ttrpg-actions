import { Plugin } from 'obsidian';
import { Processor } from 'src/processor';
import { DEFAULT_SETTINGS, TTRPGActionsSettings } from 'src/settings';
import { TTRPGActionsSettingsTab } from 'src/ui/settingsTab';


export default class TTRPGActionsPlugin extends Plugin {
	settings: TTRPGActionsSettings;
	processor: Processor

	async onload() {
		await this.loadSettings();
		this.app.workspace.trigger("parse-style-settings")

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
