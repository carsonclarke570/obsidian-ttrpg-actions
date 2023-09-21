import { Action, ActionType } from "../types"

export class ActionBuilder {
    root: HTMLElement

    constructor(root: HTMLElement) {
        this.root = root;
    }

    private validate(action: Action, actionType: ActionType): string | undefined {
        return undefined
    }

    build(action: Action, actionType: ActionType) {
        this.root.classList.add("action-block", actionType.className)

        const err = this.validate(action, actionType)
        if (err) {
            const errorEl = this.root.createEl("p")
            errorEl.innerText = err;
            return
        }

        const titleDiv = this.root.createDiv({ attr: { class: "action-title" } })
        titleDiv.appendChild(this.createHeadingLeft(action, actionType))
        titleDiv.appendChild(this.createHeadingRight(actionType))

        const bodyDiv = this.root.createDiv({ attr: { class: "action-body"}})
        bodyDiv.appendChild(this.createAttributeSection(action))

        const bodyText = bodyDiv.createDiv()
        bodyText.innerText = action.description
    }

    private createHeadingLeft(action: Action, actionType: ActionType) {
        const div = createDiv({attr: { class: "action-heading"}})
        
        /* Icon */
        const iconDiv = div.createDiv({attr: { class: `action-icon ${actionType.className}`}})
        iconDiv.innerText = actionType.icon
      
        /* Name */
        const nameDiv = div.createEl("b", {attr: { class: "action-name"}})
        nameDiv.innerText = action.name

        return div
    }

    private createHeadingRight(actionType: ActionType) {
        const typeDiv = createEl("i", {attr: { class: `action-type ${actionType.className}`}})
        typeDiv.innerText = actionType.name

        return typeDiv
    }

    private createAttributeSection(action: Action) {
        const showSource = action.source && action.source.length > 0
        const showTags = action.tags && action.tags.length > 0
        const showTrigger = action.trigger && action.trigger.length > 0
        // const showDivider = showSource || showTags || showTrigger

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

    private createAttribute(attr: string, val: string) {
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

    private createTags(tags: string[]) {
        const div = createDiv({attr: { class: "action-tags"}})
        for (const tag of tags) {
            const el = div.createEl("div", { attr: { class: "action-tag" }})
            el.innerText = tag
        }
        return div;
    }
}