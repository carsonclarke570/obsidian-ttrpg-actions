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
        bodyDiv.appendChild(this.createAttributeSection(action))

        const bodyText = bodyDiv.createDiv()
        bodyText.innerText = action.description
    }

    createAttributeSection(action: Action) {
        const showSource = (action.source && action.source.length > 0)
        const showTags = (action.tags && action.tags.length > 0)
        const showTrigger = action.trigger && action.trigger.length > 0
        const showDivider = showSource || showTags || showTrigger

        const metadataSection = createDiv({ attr: { class: "action-metadata"}})
        
        if (showTags) {
            metadataSection.appendChild(this.createTags(action.tags))
        }
        
        if (showSource) {
            metadataSection.appendChild(this.createAttribute("Source", action.source))
        }

        if (showTrigger) {
            metadataSection.appendChild(this.createAttribute("Trigger", action.trigger))
        }

        // if (showDivider) {
        //     metadataSection.appendChild(createEl("hr", { attr: { class: "action-divider pathfinder"}}))
        // }

        return metadataSection
    }

    createAttribute(attr: string, val: string) {
        const div = createDiv({attr: { class: "action-attribute"}})
        const attrEl = createEl("b") 
        attrEl.innerText = attr + ":"

        const valEl = createDiv()
        valEl.innerText = val

        div.replaceChildren(
            attrEl, valEl
        )
        return div;
    }

    createTags(tags: string[]) {
        const div = createDiv({attr: { class: "action-tags"}})
        for (const tag of tags) {
            const el = div.createEl("div", { attr: { class: "action-tag" }})
            el.innerText = tag
        }
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