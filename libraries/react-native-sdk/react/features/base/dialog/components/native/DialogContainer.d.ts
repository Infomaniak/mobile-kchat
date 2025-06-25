import React from 'react';
import AbstractDialogContainer from '../AbstractDialogContainer';
/**
 * Implements a DialogContainer responsible for showing all dialogs. We will
 * need a separate container so we can handle multiple dialogs by showing them
 * simultaneously or queueing them.
 *
 * @augments AbstractDialogContainer
 */
declare class DialogContainer extends AbstractDialogContainer {
    /**
     * Returns the reactions to be displayed.
     *
     * @returns {Array<React$Element>}
     */
    _renderReactions(): JSX.Element[];
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof DialogContainer, import("react-redux").Omit<React.ClassAttributes<DialogContainer> & import("../AbstractDialogContainer").IProps, "_reducedUI" | "_component" | "_componentProps" | "_reactionsQueue">>;
export default _default;
