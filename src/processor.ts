import { MarkdownPostProcessorContext, parseYaml } from "obsidian"
import { Action } from "./types"
import { ActionBuilder } from "./ui/action";

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

        const builder = new ActionBuilder(el)
        builder.build(action, actionType)
    }
    
}