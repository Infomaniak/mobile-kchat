import { IStateful } from '../base/app/types';
import { MediaType } from '../base/media/constants';
/**
 * Tells whether or not the notifications are enabled and if there are any
 * notifications to be displayed based on the current Redux state.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export declare function areThereNotifications(stateful: IStateful): boolean;
/**
 * Tells whether join/leave notifications are enabled in interface_config.
 *
 * @returns {boolean}
 */
export declare function joinLeaveNotificationsDisabled(): boolean;
/**
 * Returns whether or not the moderation notification for the given type is displayed.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export declare function isModerationNotificationDisplayed(mediaType: MediaType, stateful: IStateful): boolean;
