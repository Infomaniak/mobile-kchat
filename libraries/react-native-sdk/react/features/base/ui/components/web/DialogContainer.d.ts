import React, { Component, ComponentType } from 'react';
export interface IProps {
    /**
     * The component to render.
     */
    _component?: ComponentType;
    /**
     * The props to pass to the component that will be rendered.
     */
    _componentProps?: Object;
    /**
     * Whether the overflow drawer should be used.
     */
    _overflowDrawer: boolean;
    /**
     * True if the UI is in a compact state where we don't show dialogs.
     */
    _reducedUI: boolean;
}
/**
 * Implements a DialogContainer responsible for showing all dialogs. Necessary
 * for supporting @atlaskit's modal animations.
 *
 */
declare class DialogContainer extends Component<IProps> {
    /**
     * Returns the dialog to be displayed.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderDialogContent(): React.ReactElement<{}, string | React.JSXElementConstructor<any>> | null;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof DialogContainer, import("react-redux").Omit<React.ClassAttributes<DialogContainer> & IProps, "_overflowDrawer" | "_component" | "_componentProps" | "_reducedUI">>;
export default _default;
