/// <reference types="react" />
export interface IProps {
    /**
     * The phone number to dial to begin the process of dialing into a
     * conference.
     */
    phoneNumber: string;
}
/**
 * Returns a ReactElement for showing how to dial into the conference, if
 * dialing in is available.
 *
 * @private
 * @returns {null|ReactElement}
 */
declare function DialInSection({ phoneNumber }: IProps): JSX.Element;
export default DialInSection;
