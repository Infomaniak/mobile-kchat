import { Theme } from '@mui/material';
import React from 'react';
import AbstractStreamKeyForm, { IProps as AbstractProps } from '../AbstractStreamKeyForm';
export interface IProps extends AbstractProps {
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
}
declare const styles: (theme: Theme) => {
    helperLink: any;
};
/**
 * A React Component for entering a key for starting a YouTube live stream.
 *
 * @augments Component
 */
declare class StreamKeyForm extends AbstractStreamKeyForm<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StreamKeyForm> & IProps, "_liveStreaming">, keyof import("react-i18next").WithTranslation>>;
export default _default;
