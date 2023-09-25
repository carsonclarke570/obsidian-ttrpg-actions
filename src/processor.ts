import { MarkdownPostProcessorContext, parseYaml } from "obsidian"
import { Action, ActionQuery } from "./types"
import { ActionBuilder } from "./ui/action";
import { TTRPGActionsSettings } from "./settings";
import { Indexer } from "./indexer";

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

export class ListProcessor {
    settings: TTRPGActionsSettings
    indexer: Indexer

    constructor(settings: TTRPGActionsSettings, indexer: Indexer) {
        this.settings = settings;
        this.indexer = indexer;
    }

    process(src: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
        el.classList.add("action-list")
        const query: ActionQuery = parseYaml(src)

        

        const getActions = async () => {
            
            if (query?.tags) {
                return await this.indexer.getActionsByTags(query.tags)
            }

            return await this.indexer.getActions()
        }


        getActions().then((actions) => {
            console.log(actions)
            actions.forEach(action => {
                const rootElement = el.createDiv()
                const builder = new ActionBuilder(rootElement)
                const actionType = getActionType(action.type)

                builder.build(action, actionType)
            })
        })
    }
}

export class BlockProcessor {

    settings: TTRPGActionsSettings

    constructor(settings: TTRPGActionsSettings) {
        this.settings = settings;
    }

    process(src: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {

        const builder = new ActionBuilder(el)

        const hasFrontMatter = ctx?.frontmatter?.[this.settings.actionBlockId] ?? false
        if (this.settings.useFrontmatter && hasFrontMatter) {
            const action: Action = ctx.frontmatter[this.settings.actionBlockId]
            const actionType = getActionType(action.type)
            
            builder.build(action, actionType)
        } else {
            const action: Action = parseYaml(src)
            const actionType: ActionType = getActionType(action.type)

            builder.build(action, actionType)
        }
    
    }
}