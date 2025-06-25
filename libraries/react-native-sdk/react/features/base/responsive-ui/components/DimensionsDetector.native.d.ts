import React from 'react';
export interface IProps {
    /**
     * Any nested components.
     */
    children: React.ReactNode;
    /**
     * The "onLayout" handler.
     */
    onDimensionsChanged?: Function;
    /**
     * The safe are insets handler.
     */
    onSafeAreaInsetsChanged?: Function;
}
/**
 * A {@link View} which captures the 'onLayout' event and calls a prop with the
 * component size.
 *
 * @param {IProps} props - The read-only properties with which the new
 * instance is to be initialized.
 * @returns {Component} - Renders the root view and it's children.
 */
export default function DimensionsDetector(props: IProps): JSX.Element;
