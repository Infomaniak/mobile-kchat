import React, { ComponentType } from 'react';
import { GestureResponderEvent } from 'react-native';
/**
 * The type of the React {@code Component} props of inheriting component.
 */
type InputProps = {
    /**
     * ID of the poll to display.
     */
    pollId: string;
};
export type AnswerInfo = {
    name: string;
    percentage: number;
    voterCount: number;
    voters?: Array<{
        id: string;
        name: string;
    } | undefined>;
};
/**
 * The type of the React {@code Component} props of {@link AbstractPollResults}.
 */
export type AbstractProps = {
    answers: Array<AnswerInfo>;
    changeVote: (e?: React.MouseEvent<HTMLButtonElement> | GestureResponderEvent) => void;
    creatorName: string;
    haveVoted: boolean;
    question: string;
    showDetails: boolean;
    t: Function;
    toggleIsDetailed: (e?: React.MouseEvent<HTMLButtonElement> | GestureResponderEvent) => void;
};
/**
 * Higher Order Component taking in a concrete PollResult component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
declare const AbstractPollResults: (Component: ComponentType<AbstractProps>) => (props: InputProps) => JSX.Element;
export default AbstractPollResults;
