import React, { Component, ReactNode } from 'react';
/**
 * The type of the React {@code Component} props of {@link Popover}.
 */
export interface IProps {
    /**
     * Whether the child element can be clicked on.
     */
    allowClick?: boolean;
    /**
     * A child React Element to use as the trigger for showing the dialog.
     */
    children: ReactNode;
    /**
     * Additional CSS classnames to apply to the root of the {@code Popover}
     * component.
     */
    className?: string;
    /**
     * The ReactElement to display within the dialog.
     */
    content: ReactNode;
    /**
     * Whether displaying of the popover should be prevented.
     */
    disablePopover?: boolean;
    /**
     * Whether we can reach the popover element via keyboard or not when trigger is 'hover' (true by default).
     *
     * Only works when trigger is set to 'hover'.
     *
     * There are some rare cases where we want to set this to false,
     * when the popover content is not necessary for screen reader users, because accessible elsewhere.
     */
    focusable?: boolean;
    /**
     * The id of the dom element acting as the Popover label (matches aria-labelledby).
     */
    headingId?: string;
    /**
     * String acting as the Popover label (matches aria-label).
     *
     * If headingId is set, this will not be used.
     */
    headingLabel?: string;
    /**
     * An id attribute to apply to the root of the {@code Popover}
     * component.
     */
    id?: string;
    /**
    * Callback to invoke when the popover has closed.
    */
    onPopoverClose: Function;
    /**
     * Callback to invoke when the popover has opened.
     */
    onPopoverOpen?: Function;
    /**
     * Whether to display the Popover as a drawer.
     */
    overflowDrawer?: boolean;
    /**
     * Where should the popover content be placed.
     */
    position: string;
    /**
     * Whether the trigger for open/ close should be click or hover.
     */
    trigger?: 'hover' | 'click';
    /**
     * Whether the popover is visible or not.
     */
    visible: boolean;
}
/**
 * The type of the React {@code Component} state of {@link Popover}.
 */
export interface IState {
    /**
     * The style to apply to the context menu in order to position it correctly.
     */
    contextMenuStyle?: {
        bottom?: string;
        left?: string;
        position: string;
        top?: string;
    } | null;
    /**
     * Whether the popover should be focus locked or not.
     *
     * This is enabled if we notice the popover is interactive
     * (trigger is click or focusable is true).
     */
    enableFocusLock: boolean;
}
/**
 * Implements a React {@code Component} for showing an {@code Popover} on
 * mouseenter of the trigger and contents, and hiding the dialog on mouseleave.
 *
 * @augments Component
 */
declare class Popover extends Component<IProps, IState> {
    /**
     * Default values for {@code Popover} component's properties.
     *
     * @static
     */
    static defaultProps: {
        className: string;
        focusable: boolean;
        id: string;
        trigger: string;
    };
    /**
     * Reference to the dialog container.
     */
    _containerRef: React.RefObject<HTMLDivElement>;
    _contextMenuRef: HTMLElement;
    /**
     * Initializes a new {@code Popover} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Sets up a touch event listener to attach.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Removes the listener set up in the {@code componentDidMount} method.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Handles click outside the popover.
     *
     * @param {MouseEvent} e - The click event.
     * @returns {void}
     */
    _onOutsideClick(e: React.MouseEvent): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Sets the context menu dialog style for positioning it on screen.
     *
     * @param {DOMRectReadOnly} size -The size info of the current context menu.
     *
     * @returns {void}
     */
    _setContextMenuStyle(size: DOMRectReadOnly): void;
    /**
     * Sets the context menu's ref.
     *
     * @param {HTMLElement} elem -The html element of the context menu.
     *
     * @returns {void}
     */
    _setContextMenuRef(elem: HTMLElement): void;
    /**
     * Hide dialog on touch outside of the context menu.
     *
     * @param {TouchEvent} event - The touch event.
     * @private
     * @returns {void}
     */
    _onTouchStart(event: TouchEvent): void;
    /**
     * Stops displaying the {@code Popover}.
     *
     * @private
     * @returns {void}
     */
    _onHideDialog(): void;
    /**
     * Displays the {@code Popover} and calls any registered onPopoverOpen
     * callbacks.
     *
     * @param {Object} event - The mouse event or the keypress event to intercept.
     * @private
     * @returns {void}
     */
    _onShowDialog(event?: React.MouseEvent | React.KeyboardEvent): void;
    /**
     * Prevents switching from tile view to stage view on accidentally clicking
     * the popover thumbs.
     *
     * @param {Object} event - The mouse event or the keypress event to intercept.
     * @private
     * @returns {void}
     */
    _onClick(event: React.MouseEvent): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e: React.KeyboardEvent): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onEscKey(e: React.KeyboardEvent): void;
    /**
     * Gets style for positioning the context menu on screen in regards to the trigger's
     * position.
     *
     * @param {DOMRectReadOnly} size -The current context menu's size info.
     *
     * @returns {Object} - The new style of the context menu.
     */
    _getCustomDialogStyle(size: DOMRectReadOnly): {
        position: string;
        bottom: string;
    } | {
        position: string;
        top: string;
    } | {
        position: string;
        right: string;
    } | {
        position: string;
        left: string;
    } | undefined;
    /**
     * Renders the React Element to be displayed in the {@code Popover}.
     * Also adds padding to support moving the mouse from the trigger to the
     * dialog to prevent mouseleave events.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderContent(): JSX.Element;
    /**
     * Returns whether the popover is considered interactive or not.
     *
     * Interactive means the popover content is certainly composed of buttons, links…
     * Non-interactive popovers are mostly tooltips.
     *
     * @private
     * @returns {boolean}
     */
    _isInteractive(): boolean;
    /**
     * Enables the focus lock in the popover dialog.
     *
     * @private
     * @returns {void}
     */
    _enableFocusLock(): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Popover, import("react-redux").Omit<Pick<IProps, "visible" | "children" | "content" | "position" | "overflowDrawer" | "headingId" | "allowClick" | "disablePopover" | "headingLabel" | "onPopoverClose" | "onPopoverOpen"> & Partial<Pick<IProps, "id" | "className" | "focusable" | "trigger">> & Partial<Pick<{
    className: string;
    focusable: boolean;
    id: string;
    trigger: string;
}, never>>, "overflowDrawer">>;
export default _default;
