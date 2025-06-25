export interface IOverlayState {
    browser?: string;
    fatalError?: {
        details: Object;
        message?: string;
        name?: string;
    };
    isMediaPermissionPromptVisible?: boolean;
}
