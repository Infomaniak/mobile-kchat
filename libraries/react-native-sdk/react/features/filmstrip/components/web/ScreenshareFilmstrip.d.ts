/// <reference types="react" />
export interface IProps {
    /**
     * The number of columns in tile view.
     */
    _columns: number;
    /**
     * The current layout of the filmstrip.
     */
    _currentLayout?: string;
    /**
     * The height of the filmstrip.
     */
    _filmstripHeight?: number;
    /**
     * The width of the filmstrip.
     */
    _filmstripWidth?: number;
    /**
     * Whether or not the current layout is vertical filmstrip.
     */
    _isVerticalFilmstrip: boolean;
    /**
     * The participants in the call.
     */
    _remoteParticipants: Array<Object>;
    /**
     * The length of the remote participants array.
     */
    _remoteParticipantsLength: number;
    /**
     * Whether or not the filmstrip should be user-resizable.
     */
    _resizableFilmstrip: boolean;
    /**
     * The number of rows in tile view.
     */
    _rows: number;
    /**
     * The height of the thumbnail.
     */
    _thumbnailHeight?: number;
    /**
     * The width of the thumbnail.
     */
    _thumbnailWidth?: number;
    /**
     * Whether or not the vertical filmstrip should have a background color.
     */
    _verticalViewBackground: boolean;
    /**
     * Whether or not the vertical filmstrip should be displayed as grid.
     */
    _verticalViewGrid: boolean;
    /**
     * Additional CSS class names to add to the container of all the thumbnails.
     */
    _videosClassName: string;
}
declare const _default: import("react-redux").ConnectedComponent<(props: IProps) => JSX.Element | null, any>;
export default _default;
