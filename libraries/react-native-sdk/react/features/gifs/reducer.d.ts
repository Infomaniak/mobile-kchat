export interface IGif {
    gifUrl?: string;
    timeoutID?: number;
}
export interface IGifsState {
    gifList: Map<string, IGif>;
    menuOpen: boolean;
}
