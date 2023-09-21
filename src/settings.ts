export interface TTRPGActionsSettings {
    actionBlockId: string;
    useFrontmatter: boolean;
}

export const DEFAULT_SETTINGS: TTRPGActionsSettings = {
    actionBlockId: "ttrpg-action",
    useFrontmatter: false
}