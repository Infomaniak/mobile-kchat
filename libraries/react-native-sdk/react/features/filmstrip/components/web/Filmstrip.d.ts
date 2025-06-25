import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { styles } from './styles';
/**
 * The type of the React {@code Component} props of {@link Filmstrip}.
 */
export interface IProps extends WithTranslation {
    /**
     * Additional CSS class names top add to the root.
     */
    _className: string;
    /**
     * The number of columns in tile view.
     */
    _columns: number;
    /**
     * The current layout of the filmstrip.
     */
    _currentLayout?: string;
    /**
     * Whether or not to hide the self view.
     */
    _disableSelfView: boolean;
    /**
     * Whether vertical/horizontal filmstrip is disabled through config.
     */
    _filmstripDisabled: boolean;
    /**
     * The height of the filmstrip.
     */
    _filmstripHeight: number;
    /**
     * The width of the filmstrip.
     */
    _filmstripWidth: number;
    /**
     * Whether or not we have scroll on the filmstrip.
     */
    _hasScroll: boolean;
    /**
     * Whether this is a recorder or not.
     */
    _iAmRecorder: boolean;
    /**
     * Whether the filmstrip button is enabled.
     */
    _isFilmstripButtonEnabled: boolean;
    /**
    * Whether or not the toolbox is displayed.
    */
    _isToolboxVisible: Boolean;
    /**
     * Whether or not the current layout is vertical filmstrip.
     */
    _isVerticalFilmstrip: boolean;
    /**
     * The local screen share participant. This prop is behind the sourceNameSignaling feature flag.
     */
    _localScreenShareId: string | undefined;
    /**
     * Whether or not the filmstrip videos should currently be displayed.
     */
    _mainFilmstripVisible: boolean;
    /**
     * The maximum width of the vertical filmstrip.
     */
    _maxFilmstripWidth: number;
    /**
     * The maximum height of the top panel.
     */
    _maxTopPanelHeight: number;
    /**
     * The participants in the call.
     */
    _remoteParticipants: Array<string>;
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
    _thumbnailHeight: number;
    /**
     * The width of the thumbnail.
     */
    _thumbnailWidth: number;
    /**
     * Whether or not the filmstrip is top panel.
     */
    _topPanelFilmstrip: boolean;
    /**
     * The height of the top panel (user resized).
     */
    _topPanelHeight?: number | null;
    /**
     * The max height of the top panel.
     */
    _topPanelMaxHeight: number;
    /**
     * Whether or not the top panel is visible.
     */
    _topPanelVisible: boolean;
    /**
     * The width of the vertical filmstrip (user resized).
     */
    _verticalFilmstripWidth?: number | null;
    /**
     * Whether or not the vertical filmstrip should have a background color.
     */
    _verticalViewBackground: boolean;
    /**
     * Whether or not the vertical filmstrip should be displayed as grid.
     */
    _verticalViewGrid: boolean;
    /**
     * The max width of the vertical filmstrip.
     */
    _verticalViewMaxWidth: number;
    /**
     * Additional CSS class names to add to the container of all the thumbnails.
     */
    _videosClassName: string;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The type of filmstrip to be displayed.
     */
    filmstripType: string;
}
export interface IState {
    /**
     * Initial top panel height on drag handle mouse down.
     */
    dragFilmstripHeight?: number;
    /**
     * Initial filmstrip width on drag handle mouse down.
     */
    dragFilmstripWidth?: number | null;
    /**
     * Whether or not the mouse is pressed.
     */
    isMouseDown: boolean;
    /**
     * Initial mouse position on drag handle mouse down.
     */
    mousePosition?: number | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
