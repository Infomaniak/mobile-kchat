import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import { type Image } from '../constants';
import { IVirtualBackground } from '../reducer';
export interface IProps extends WithTranslation {
    /**
     * The list of Images to choose from.
     */
    _images: Array<Image>;
    /**
     * If the upload button should be displayed or not.
     */
    _showUploadButton: boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Options change handler.
     */
    onOptionsChange: Function;
    /**
     * Virtual background options.
     */
    options: IVirtualBackground;
    /**
     * Returns the selected thumbnail identifier.
     */
    selectedThumbnail: string;
    /**
     * The id of the selected video device.
     */
    selectedVideoInputId: string;
}
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "dispatch" | "_images" | "_showUploadButton"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "dispatch" | "_images" | "_showUploadButton">>;
export default _default;
