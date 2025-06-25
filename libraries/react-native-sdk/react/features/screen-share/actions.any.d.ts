/**
 * Updates the capture frame rate for screenshare in redux.
 *
 * @param {number} captureFrameRate - The frame rate to be used for screenshare.
 * @returns {{
 *      type: SET_SCREENSHARE_CAPTURE_FRAME_RATE,
 *      captureFrameRate: number
 * }}
 */
export declare function setScreenshareFramerate(captureFrameRate: number): {
    type: string;
    captureFrameRate: number;
};
