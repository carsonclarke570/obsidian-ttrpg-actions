export type Action = {
    name: string;
    type: string;
    description: string;
    source: string;
    trigger: string;
    tags: string[];
}

export type ActionType = {
    className: string;
    icon: string;
    name: string;
}