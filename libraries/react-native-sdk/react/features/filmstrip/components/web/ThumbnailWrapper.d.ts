import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link ThumbnailWrapper}.
 */
export interface IProps {
    /**
     * Whether or not to hide the self view.
     */
    _disableSelfView?: boolean;
    /**
     * The type of filmstrip this thumbnail is displayed in.
     */
    _filmstripType?: string;
    /**
     * The horizontal offset in px for the thumbnail. Used to center the thumbnails in the last row in tile view.
     */
    _horizontalOffset?: number;
    /**
     * Whether or not the thumbnail is a local screen share.
     */
    _isLocalScreenShare?: boolean;
    /**
     * The ID of the participant associated with the Thumbnail.
     */
    _participantID?: string;
    /**
     * The width of the thumbnail. Used for expanding the width of the thumbnails on last row in case
     * there is empty space.
     */
    _thumbnailWidth?: number;
    /**
     * The index of the column in tile view.
     */
    columnIndex?: number;
    /**
     * The index of the ThumbnailWrapper in stage view.
     */
    index?: number;
    /**
     * The index of the row in tile view.
     */
    rowIndex?: number;
    /**
     * The styles coming from react-window.
     */
    style: Object;
}
/**
 * A wrapper Component for the Thumbnail that translates the react-window specific props
 * to the Thumbnail Component's props.
 */
declare class ThumbnailWrapper extends Component<IProps> {
    shouldComponentUpdate: (p: any, s: any) => boolean;
    /**
     * Creates new ThumbnailWrapper instance.
     *
     * @param {IProps} props - The props of the component.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ThumbnailWrapper, import("react-redux").Omit<React.ClassAttributes<ThumbnailWrapper> & IProps, "_disableSelfView" | "_filmstripType" | "_horizontalOffset" | "_isLocalScreenShare" | "_participantID" | "_thumbnailWidth"> & {
    columnIndex: number;
    data: {
        filmstripType: string;
    };
    index?: number | undefined;
    rowIndex: number;
}>;
export default _default;
