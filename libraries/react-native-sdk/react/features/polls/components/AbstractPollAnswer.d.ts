import { ComponentType } from 'react';
import { IPoll } from '../types';
/**
 * The type of the React {@code Component} props of inheriting component.
 */
type InputProps = {
    pollId: string;
    setCreateMode: (mode: boolean) => void;
};
export type AbstractProps = {
    checkBoxStates: boolean[];
    creatorName: string;
    poll: IPoll;
    pollId: string;
    sendPoll: () => void;
    setCheckbox: Function;
    setCreateMode: (mode: boolean) => void;
    skipAnswer: () => void;
    skipChangeVote: () => void;
    submitAnswer: () => void;
    t: Function;
};
/**
 * Higher Order Component taking in a concrete PollAnswer component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
declare const AbstractPollAnswer: (Component: ComponentType<AbstractProps>) => (props: InputProps) => JSX.Element;
export default AbstractPollAnswer;
