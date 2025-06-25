import React from 'react';
export declare const LabelHitSlop: {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
/**
 * Timeout to hide the {@ExpandedLabel}.
 */
export declare const EXPANDED_LABEL_TIMEOUT = 5000;
export declare const LABEL_ID_QUALITY = "quality";
export declare const LABEL_ID_RECORDING = "recording";
export declare const LABEL_ID_STREAMING = "streaming";
export declare const LABEL_ID_INSECURE_ROOM_NAME = "insecure-room-name";
export declare const LABEL_ID_RAISED_HANDS_COUNT = "raised-hands-count";
export declare const LABEL_ID_VISITORS_COUNT = "visitors-count";
interface IExpandedLabel {
    alwaysOn?: boolean;
    component: React.ComponentType<any>;
    props?: any;
}
/**
 * The {@code ExpandedLabel} components to be rendered for the individual
 * {@code Label}s.
 */
export declare const EXPANDED_LABELS: {
    [key: string]: IExpandedLabel;
};
export {};
