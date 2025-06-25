export interface IKeyboardShortcut {
    alt?: boolean;
    character: string;
    handler: Function;
    helpCharacter?: string;
    helpDescription?: string;
}
export interface IKeyboardShortcutsState {
    enabled: boolean;
    shortcuts: Map<string, IKeyboardShortcut>;
    shortcutsHelp: Map<string, string>;
}
