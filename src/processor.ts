import { MarkdownPostProcessorContext, parseYaml } from "obsidian"
import { Action } from "./types"

export const ACTION_STRINGS = {
	one: '⬻',
	two: '⬺',
	three: '⬽',
	reaction: '⬲',
	free: '⭓'
}

export type ActionType = {
    className: string;
    icon: string;
    name: string;
}


export const getActionType = (type: string): ActionType => {
    
    const typeString = type.toLowerCase();
    if (typeString === "action") {
        return {
            className: "type-action",
            icon: ACTION_STRINGS.one,
            name: "Action"
        }
    }

    if (typeString === "bonus-action" || typeString === "bonus" || typeString === "bonusaction") {
        return {
            className: "type-bonus-action",
            icon: ACTION_STRINGS.free,
            name: "Bonus Action"
        }
    }

    if (typeString === "reaction") {
        return {
            className: "type-reaction",
            icon: ACTION_STRINGS.reaction,
            name: "Reaction"
        }
    }

    /* Default */
    return {
        className: "type-action",
        icon: ACTION_STRINGS.one,
        name: "Action"
    }
}

export class Processor {

    process(src: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
        const action: Action = parseYaml(src)
        const actionType: ActionType = getActionType(action.type)

        el.classList.add("action-block", actionType.className)

        const titleDiv = el.createDiv({ attr: { class: "action-title"}})
        titleDiv.replaceChildren(
            this.createHeading(action, actionType),
            this.createType(actionType)
        )

        const bodyDiv = el.createDiv({ attr: { class: "action-body"}})
        if (action.tags && action.tags.length > 0) {
            bodyDiv.appendChild(this.createTags())
        }

        if (action.source && action.source !== "") {
            bodyDiv.appendChild(this.createSource(action.source))
        }

        bodyDiv.innerText = action.description
    }

    createSource(source: string) {
        const div = createDiv({attr: { class: "action-source"}})
        div.replaceChildren(
            createEl("b")
        )
        return div;
    }

    createTags() {
        const div = createDiv({attr: { class: "action-tags"}})
        return div;
    }

    createHeading(action: Action, actionType: ActionType) {
        const div = createDiv({attr: { class: "action-heading"}})
        div.appendChild(this.createIcon(actionType))
        div.appendChild(this.createName(action.name))
        return div
    }

    createName(name: string) {
        const nameDiv = createEl("b", {attr: { class: "action-name"}})
        nameDiv.innerText = name
        return nameDiv
    }

    createIcon(actionType: ActionType) {
        const iconDiv = createDiv({attr: { class: `action-icon ${actionType.className}`}})
        iconDiv.innerText = actionType.icon
        return iconDiv
    }

    createType(actionType: ActionType) {
        const typeDiv = createEl("i", {attr: { class: `action-type ${actionType.className}`}})
        typeDiv.innerText = actionType.name
        return typeDiv
    }
}