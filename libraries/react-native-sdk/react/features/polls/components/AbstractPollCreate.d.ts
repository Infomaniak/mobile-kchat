import { ComponentType, FormEvent } from 'react';
import { IAnswerData, IPoll } from '../types';
/**
 * The type of the React {@code Component} props of inheriting component.
 */
type InputProps = {
    setCreateMode: (mode: boolean) => void;
};
export type AbstractProps = InputProps & {
    addAnswer: (index?: number) => void;
    answers: Array<IAnswerData>;
    editingPoll: IPoll | undefined;
    editingPollId: string | undefined;
    isSubmitDisabled: boolean;
    onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    question: string;
    removeAnswer: (index: number) => void;
    setAnswer: (index: number, value: IAnswerData) => void;
    setQuestion: (question: string) => void;
    t: Function;
};
/**
 * Higher Order Component taking in a concrete PollCreate component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
declare const AbstractPollCreate: (Component: ComponentType<AbstractProps>) => (props: InputProps) => JSX.Element;
export default AbstractPollCreate;
