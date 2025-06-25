import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link StreamKeyPicker}.
 */
export interface IProps extends WithTranslation {
    /**
     * Broadcasts available for selection. Each broadcast item should be an
     * object with a title for display in the dropdown and a boundStreamID to
     * return in the {@link onBroadcastSelected} callback.
     */
    broadcasts: Array<{
        boundStreamID: string;
        title: string;
    }>;
    /**
     * Callback invoked when an item in the dropdown is selected. The selected
     * broadcast's boundStreamID will be passed back.
     */
    onBroadcastSelected: Function;
    /**
     * The boundStreamID of the broadcast that should display as selected in the
     * dropdown.
     */
    selectedBoundStreamID?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
