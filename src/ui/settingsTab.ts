import TTRPGActionsPlugin from "main";
import { App, PluginSettingTab } from "obsidian";

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
    }
}