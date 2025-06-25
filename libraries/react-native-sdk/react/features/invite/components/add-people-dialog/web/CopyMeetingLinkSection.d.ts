/// <reference types="react" />
export interface IProps {
    /**
     * The URL of the conference.
     */
    url: string;
}
/**
 * Component meant to enable users to copy the conference URL.
 *
 * @returns {React$Element<any>}
 */
declare function CopyMeetingLinkSection({ url }: IProps): JSX.Element;
export default CopyMeetingLinkSection;
