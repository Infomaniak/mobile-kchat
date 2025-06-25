import { Theme } from '@mui/material';
import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import { IVirtualBackground } from '../reducer';
/**
 * The type of the React {@code PureComponent} props of {@link VirtualBackgroundPreview}.
 */
export interface IProps extends WithTranslation {
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Dialog callback that indicates if the background preview was loaded.
     */
    loadedPreview: Function;
    /**
     * Represents the virtual background set options.
     */
    options: IVirtualBackground;
    /**
     * The id of the selected video device.
     */
    selectedVideoInputId: string;
}
/**
 * The type of the React {@code Component} state of {@link VirtualBackgroundPreview}.
 */
export interface IState {
    /**
     * Activate the selected device camera only.
     */
    jitsiTrack: Object | null;
    /**
     * Loader activated on setting virtual background.
     */
    loading: boolean;
    /**
     * Flag that indicates if the local track was loaded.
     */
    localTrackLoaded: boolean;
}
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
declare const styles: (theme: Theme) => {
    virtualBackgroundPreview: {
        height: string;
        width: string;
        overflow: string;
        marginBottom: string;
        zIndex: number;
        borderRadius: string;
        backgroundColor: string;
        position: "relative";
    };
    previewLoader: {
        height: string;
        '& svg': {
            position: "absolute";
            top: string;
            left: string;
        };
    };
    previewVideo: {
        height: string;
        width: string;
        objectFit: "cover";
    };
    error: {
        display: string;
        alignItems: string;
        justifyContent: string;
        width: string;
        height: string;
        position: "relative";
    };
};
/**
 * Implements a React {@link PureComponent} which displays the virtual
 * background preview.
 *
 * @augments PureComponent
 */
declare class VirtualBackgroundPreview extends PureComponent<IProps, IState> {
    _componentWasUnmounted: boolean;
    /**
     * Initializes a new {@code VirtualBackgroundPreview} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Destroys the jitsiTrack object.
     *
     * @param {Object} jitsiTrack - The track that needs to be disposed.
     * @returns {Promise<void>}
     */
    _stopStream(jitsiTrack: any): void;
    /**
     * Creates and updates the track data.
     *
     * @returns {void}
     */
    _setTracks(): Promise<void>;
    /**
     * Apply background effect on video preview.
     *
     * @returns {Promise}
     */
    _applyBackgroundEffect(): Promise<void>;
    /**
     * Apply video preview loader.
     *
     * @returns {Promise}
     */
    _loadVideoPreview(): JSX.Element;
    /**
     * Renders a preview entry.
     *
     * @param {Object} data - The track data.
     * @returns {React$Node}
     */
    _renderPreviewEntry(data: Object): JSX.Element;
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#componentWillUnmount}.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): Promise<void>;
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<VirtualBackgroundPreview> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
