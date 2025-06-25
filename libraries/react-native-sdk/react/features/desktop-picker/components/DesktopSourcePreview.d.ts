import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of
 * {@link DesktopSourcePreview}.
 */
export interface IProps extends WithTranslation {
    /**
     * The callback to invoke when the component is clicked. The id of the
     * clicked on DesktopCapturerSource will be passed in.
     */
    onClick: Function;
    /**
     * The callback to invoke when the component is double clicked. The id of
     * the DesktopCapturerSource will be passed in.
     */
    onDoubleClick: Function;
    /**
     * The indicator which determines whether this DesktopSourcePreview is
     * selected. If true, the 'is-selected' CSS class will be added to the root
     * of Component.
     */
    selected: boolean;
    /**
     * The DesktopCapturerSource to display.
     */
    source: any;
    /**
     * The source type of the DesktopCapturerSources to display.
     */
    type: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
