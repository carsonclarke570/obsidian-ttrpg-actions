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
            ));

        /* Use frontmatter */
        new Setting(containerEl)
            .setName("Parse Frontmatter")
            .setDesc("Setting this to true will attempt to fill all `" + this.plugin.settings.actionBlockId + "` blocks with frontmatter fields. This can still be overriden by individual action blocks.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useFrontmatter)
                .onChange(async (value) => {
                    this.plugin.settings.useFrontmatter = value;
                    await this.plugin.saveSettings();
                })
            )
    }
}