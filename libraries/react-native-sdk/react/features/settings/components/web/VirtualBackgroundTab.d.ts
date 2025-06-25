import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
import { IVirtualBackground } from '../../../virtual-background/reducer';
/**
 * The type of the React {@code Component} props of {@link VirtualBackgroundTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Virtual background options.
     */
    options: IVirtualBackground;
    /**
     * The id of the selected video device.
     */
    selectedVideoInputId: string;
}
declare const styles: () => {
    container: {
        width: string;
        display: string;
        flexDirection: "column";
    };
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
