export interface TTRPGActionsSettings {
    actionBlockId: string;
    actionListId: string;
    useFrontmatter: boolean;
}

export const DEFAULT_SETTINGS: TTRPGActionsSettings = {
    actionBlockId: "ttrpg-action",
    actionListId: "ttrpg-action-list",
    useFrontmatter: false
}