import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link ShortcutsTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Whether to display the shortcuts or not.
     */
    displayShortcuts: boolean;
    /**
     * Wether the keyboard shortcuts are enabled or not.
     */
    keyboardShortcutsEnabled: boolean;
    /**
     * The keyboard shortcuts descriptions.
     */
    keyboardShortcutsHelpDescriptions: Map<string, string>;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
        width: string;
        paddingBottom: string;
    };
    checkbox: {
        marginBottom: string;
    };
    listContainer: {
        listStyleType: string;
        padding: number;
        margin: number;
    };
    listItem: any;
    listItemKey: any;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
