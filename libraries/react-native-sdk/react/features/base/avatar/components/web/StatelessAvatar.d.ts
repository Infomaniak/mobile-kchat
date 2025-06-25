/// <reference types="react" />
import { IAvatarProps } from '../../types';
export interface IProps extends IAvatarProps {
    /**
     * External class name passed through props.
     */
    className?: string;
    /**
     * The default avatar URL if we want to override the app bundled one (e.g. AlwaysOnTop).
     */
    defaultAvatar?: string;
    /**
     * ID of the component to be rendered.
     */
    id?: string;
    /**
     * One of the expected status strings (e.g. 'available') to render a badge on the avatar, if necessary.
     */
    status?: string;
    /**
     * TestId of the element, if any.
     */
    testId?: string;
    /**
     * The URL of the avatar to render.
     */
    url?: string | Function;
    /**
     * Indicates whether to load the avatar using CORS or not.
     */
    useCORS?: boolean;
}
declare const StatelessAvatar: ({ className, color, iconUser, id, initials, onAvatarLoadError, onAvatarLoadErrorParams, size, status, testId, url, useCORS }: IProps) => JSX.Element;
export default StatelessAvatar;
