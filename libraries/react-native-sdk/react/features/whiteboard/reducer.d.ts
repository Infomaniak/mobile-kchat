export interface IWhiteboardState {
    /**
     * The whiteboard collaboration details.
     */
    collabDetails?: {
        roomId: string;
        roomKey: string;
    };
    /**
     * The whiteboard collaboration url.
     */
    collabServerUrl?: string;
    /**
     * The indicator which determines whether the whiteboard is open.
     *
     * @type {boolean}
     */
    isOpen: boolean;
}
export interface IWhiteboardAction extends Partial<IWhiteboardState> {
    /**
     * The whiteboard collaboration details.
     */
    collabDetails?: {
        roomId: string;
        roomKey: string;
    };
    /**
     * The whiteboard collaboration url.
     */
    collabServerUrl?: string;
    /**
     * The action type.
     */
    type: string;
}
