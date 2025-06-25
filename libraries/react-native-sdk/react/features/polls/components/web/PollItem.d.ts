import React from 'react';
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
declare const PollItem: React.ForwardRefExoticComponent<IProps & React.RefAttributes<HTMLDivElement>>;
export default PollItem;
