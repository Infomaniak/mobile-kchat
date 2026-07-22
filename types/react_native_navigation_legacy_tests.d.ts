declare module 'react-native-navigation' {
    export const Navigation: any;
    export const OptionsModalPresentationStyle: Record<string, string>;
    export class NavigationComponent<P = Record<string, unknown>, S = Record<string, unknown>> {
        constructor(props: P);
        props: P;
        state: S;
        setState(state: Partial<S>): void;
    }
    export type ComponentEvent = {componentId?: string};
    export type ImageResource = unknown;
    export type LayoutOrientation = string;
    export type NavigationButtonPressedEvent = {buttonId: string};
    export type Options = Record<string, any>;
    export type OptionsLayout = Record<string, any>;
    export type OptionsStatusBar = Record<string, any>;
    export type OptionsTopBarButton = Record<string, any>;
}
