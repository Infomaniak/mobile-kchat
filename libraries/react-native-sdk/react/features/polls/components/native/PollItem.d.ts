/// <reference types="react" />
export interface IProps {
    /**
     * Id of the poll.
     */
    pollId: string;
    /**
     * Create mode control.
     */
    setCreateMode: (mode: boolean) => void;
}
declare const PollItem: ({ pollId, setCreateMode }: IProps) => JSX.Element;
export default PollItem;
