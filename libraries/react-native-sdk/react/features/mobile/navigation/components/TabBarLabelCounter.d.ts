/// <reference types="react" />
interface ITabBarLabelCounterProps {
    activeUnreadNr: boolean;
    isFocused: boolean;
    label: string;
    nbUnread?: number;
}
export declare const TabBarLabelCounter: ({ activeUnreadNr, isFocused, label, nbUnread }: ITabBarLabelCounterProps) => JSX.Element;
export {};
