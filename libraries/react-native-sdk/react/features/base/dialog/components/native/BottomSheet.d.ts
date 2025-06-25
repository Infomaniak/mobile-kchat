import React, { PureComponent, ReactNode } from 'react';
import { IStore } from '../../../../app/types';
/**
 * The type of {@code BottomSheet}'s React {@code Component} prop types.
 */
type Props = {
    /**
     * Whether to add padding to scroll view.
     */
    addScrollViewPadding?: boolean;
    /**
     * The children to be displayed within this component.
     */
    children: ReactNode;
    /**
     * Redux Dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Handler for the cancel event, which happens when the user dismisses
     * the sheet.
     */
    onCancel?: Function;
    /**
     * Function to render a bottom sheet footer element, if necessary.
     */
    renderFooter?: () => React.ReactNode;
    /**
     * Function to render a bottom sheet header element, if necessary.
     */
    renderHeader?: Function;
    /**
     * Whether to show sliding view or not.
     */
    showSlidingView?: boolean;
    /**
     * The component's external style.
     */
    style?: Object;
};
/**
 * A component emulating Android's BottomSheet.
 */
declare class BottomSheet extends PureComponent<Props> {
    /**
     * Default values for {@code BottomSheet} component's properties.
     *
     * @static
     */
    static defaultProps: {
        addScrollViewPadding: boolean;
        showSlidingView: boolean;
    };
    /**
     * Initializes a new instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new instance with.
     */
    constructor(props: Props);
    /**
     * Handles the cancel event, when the user dismissed the sheet. By default we close it.
     *
     * @returns {void}
     */
    _onCancel(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof BottomSheet, import("react-redux").Omit<Pick<React.ClassAttributes<BottomSheet> & Props, "style" | "dispatch" | "children" | "onCancel" | "renderFooter" | "renderHeader" | keyof React.ClassAttributes<BottomSheet>> & Partial<Pick<React.ClassAttributes<BottomSheet> & Props, "addScrollViewPadding" | "showSlidingView">> & Partial<Pick<{
    addScrollViewPadding: boolean;
    showSlidingView: boolean;
}, never>>, "dispatch">>;
export default _default;
