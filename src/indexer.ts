import { FileManager, TFile, Vault, parseYaml } from "obsidian";
import { Action, IndexedRecord } from "./types";
import { Low, Memory } from "lowdb";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { TTRPGActionsSettings } from "./settings";

type Data = {
    byTag: Map<string, number[]>

    records: IndexedRecord[]
}

export class Indexer {

    isIndexed = false;
    index: Low<Data>
    vault: Vault
    settings: TTRPGActionsSettings
    fileManager: FileManager

    constructor(vault: Vault, fileManager: FileManager, settings: TTRPGActionsSettings) {
        this.index = new Low(new Memory(), { 
            byTag: new Map(),
            records: []
        });
        this.vault = vault;
        this.fileManager = fileManager;
        this.settings = settings;
        this.isIndexed = false;
    }

    async refresh() {
        await this.drop();
        await this.create();
    }

    async drop() {
        await this.index.read()
        this.index.data.byTag.clear()
        this.index.data.records = []

        await this.index.write()
        this.isIndexed = false;
    }

    async create() {
        this.isIndexed = false;
        this.index.read()

        const files = this.vault.getMarkdownFiles();
        for (const file of files) {
            await this.indexFile(file)
        }

        console.debug(this.index.data)
        await this.index.write()
        this.isIndexed = true;
    }

    async getActions(): Promise<Action[]> {
        while (!this.isIndexed) {}

        return this.index.data.records.map(val => {
            return val.action
        })
    }

    async getActionsByTags(tags: string[]): Promise<Action[]> {
        while (!this.isIndexed) {}

        const indices = tags.reduce((acc, val) => {
            const indices = this.index.data.byTag.get(val)
            if (indices) {
                acc = acc.concat(indices)
            }

            return acc
        }, [] as number[])

        return this.resolveIndices(indices)
    }

    resolveIndices(indices: number[]): Action[] {
        const actions: Action[] = []
        for (const index of indices) {
            const record = this.index.data.records.at(index)
            
            if (record) {
                actions.push(record.action)
            } else {
                console.error(`Could not find record with index ${index}`)
            }
        }

        return actions
    }

    private async indexFile(file: TFile) {
        const contents = await this.vault.cachedRead(file)

        const tree = fromMarkdown(contents)
        visit(tree, "code", (node, index, parent) => {
            if (node.lang === this.settings.actionBlockId) {

                let action: Action | undefined = undefined
                let processFrontMatter = false
                this.fileManager.processFrontMatter(file, (fm) => {
                    const hasFrontMatter = fm?.[this.settings.actionBlockId] ?? false
                    if (this.settings.useFrontmatter && hasFrontMatter) {
                        processFrontMatter = true
                        action = fm?.[this.settings.actionBlockId]
                        // console.log(action)
                    }
                }).then(() => {
                    if (!processFrontMatter) {
                        action = parseYaml(node.value)
                    }

                    if (action?.name) {
                        this.indexAction(action, file)
                    } else {
                        console.error(`Failed to index block from ${file.name}`)
                    }
                })
            }
        })
    }

    private indexAction(action: Action, file: TFile) {
        const len = this.index.data.records.push({
            path: file.path,
            action: action
        })

        const newIndex = len - 1
        for (const tag of action.tags) {
            let indices = this.index.data.byTag.get(tag)
            if (!indices) {
                indices = []
                
            } 
            indices.push(newIndex)

            this.index.data.byTag.set(tag, indices)
        }
        
    }
}