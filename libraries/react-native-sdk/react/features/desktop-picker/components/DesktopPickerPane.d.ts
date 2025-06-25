import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link DesktopPickerPane}.
 */
export interface IProps extends WithTranslation {
    /**
     * The handler to be invoked when a DesktopSourcePreview is clicked.
     */
    onClick: Function;
    /**
     * The handler to be invoked when a DesktopSourcePreview is double clicked.
     */
    onDoubleClick: Function;
    /**
     * The handler to be invoked if the users checks the audio screen sharing checkbox.
     */
    onShareAudioChecked: Function;
    /**
     * The id of the DesktopCapturerSource that is currently selected.
     */
    selectedSourceId: string;
    /**
     * An array of DesktopCapturerSources.
     */
    sources: Array<any>;
    /**
     * The source type of the DesktopCapturerSources to display.
     */
    type: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
