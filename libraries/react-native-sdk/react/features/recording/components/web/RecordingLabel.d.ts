import { Theme } from '@mui/material';
import React from 'react';
import { IProps as AbstractProps } from '../AbstractRecordingLabel';
export interface IProps extends AbstractProps {
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
}
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
declare const styles: (theme: Theme) => {
    record: {
        background: string;
    };
};
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
