/// <reference types="react" />
/**
 * Whiteboard wrapper for mobile.
 *
 * @returns {JSX.Element}
 */
declare const WhiteboardWrapper: ({ className, collabDetails, collabServerUrl, localParticipantName }: {
    className?: string | undefined;
    collabDetails: {
        roomId: string;
        roomKey: string;
    };
    collabServerUrl: string;
    localParticipantName: string;
}) => JSX.Element;
export default WhiteboardWrapper;
