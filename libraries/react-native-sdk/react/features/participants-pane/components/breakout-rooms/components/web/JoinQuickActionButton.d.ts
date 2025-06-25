/// <reference types="react" />
export interface IProps {
    /**
     * The room to join.
     */
    room: {
        id: string;
        jid: string;
    };
}
declare const JoinActionButton: ({ room }: IProps) => JSX.Element;
export default JoinActionButton;
