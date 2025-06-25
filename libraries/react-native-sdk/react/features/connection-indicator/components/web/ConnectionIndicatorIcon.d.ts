/// <reference types="react" />
import { ITrack } from '../../../base/tracks/types';
export interface IProps {
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<'icon' | 'inactiveIcon', string>>;
    /**
     * A CSS class that interprets the current connection status as a color.
     */
    colorClass: string;
    /**
     * Disable/enable inactive indicator.
     */
    connectionIndicatorInactiveDisabled: boolean;
    /**
     * Whether or not the connection status is inactive.
     */
    isConnectionStatusInactive: boolean;
    /**
     * Whether or not the connection status is interrupted.
     */
    isConnectionStatusInterrupted?: boolean;
    /**
     * JitsiTrack instance.
     */
    track?: ITrack;
}
export declare const ConnectionIndicatorIcon: ({ classes, colorClass, connectionIndicatorInactiveDisabled, isConnectionStatusInactive, isConnectionStatusInterrupted, track }: IProps) => JSX.Element | null;
