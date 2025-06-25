/// <reference types="react" />
import { ITrack } from '../../../base/tracks/types';
/**
 * The type of the React {@code Component} props of {@link AudioTracksContainer}.
 */
export interface IProps {
    /**
     * All media tracks stored in redux.
     */
    _tracks: ITrack[];
}
/**
 * A container for the remote tracks audio elements.
 *
 * @param {IProps} props - The props of the component.
 * @returns {Array<ReactElement>}
 */
declare function AudioTracksContainer(props: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof AudioTracksContainer, import("react-redux").Omit<IProps, "_tracks">>;
export default _default;
