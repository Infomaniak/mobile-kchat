import { ComponentType } from 'react';
export type AbstractProps = {
    createMode: boolean;
    onCreate: () => void;
    setCreateMode: (mode: boolean) => void;
    t: Function;
};
/**
 * Higher Order Component taking in a concrete PollsPane component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
declare const AbstractPollsPane: (Component: ComponentType<AbstractProps>) => () => JSX.Element;
export default AbstractPollsPane;
