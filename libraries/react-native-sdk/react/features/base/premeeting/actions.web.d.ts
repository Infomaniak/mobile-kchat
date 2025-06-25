/**
 * Sets the consent of the user for joining the unsafe room.
 *
 * @param {boolean} consent - The user's consent.
 * @returns {{
 *      type: SET_UNSAFE_ROOM_CONSENT,
*       consent: boolean
* }}
 */
export declare function setUnsafeRoomConsent(consent: boolean): {
    type: string;
    consent: boolean;
};
