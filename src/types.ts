export type Action = {
    name: string;
    type: string;
    description: string;
    source: string;
    trigger: string;
    requirements: string;
    tags: string[];
}

export type ActionQuery = {
    tags: string[]
}

export type ActionType = {
    className: string;
    icon: string;
    name: string;
}

export type IndexedRecord = {
    path: string;
    action: Action;
}