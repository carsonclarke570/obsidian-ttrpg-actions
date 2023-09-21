import TTRPGActionsPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS } from "src/settings";

export class TTRPGActionsSettingsTab extends PluginSettingTab {
    plugin: TTRPGActionsPlugin

    constructor(app: App, plugin: TTRPGActionsPlugin) {
        super(app, plugin);
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        /* Title */
        const titleDiv = containerEl.createDiv()
        const titleHeading = titleDiv.createEl("h1")
        titleHeading.innerText = "TTRPG Actions"

        /* Action Block ID */
        new Setting(containerEl)
			.setName("Action Block Identifier")
			.setDesc("Use this to identify a codeblock for TTRPG Actions to parse.")
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.actionBlockId)
				.setValue(this.plugin.settings.actionBlockId)
				.onChange(async (value) => {
					this.plugin.settings.actionBlockId = value;
					await this.plugin.saveSettings();
                }
            )
        );
    }
}