import React, { Component } from 'react';
import { GestureResponderEvent } from 'react-native';
import { StyleType } from '../../../styles/functions.native';
import { Item } from '../../types';
export interface IProps {
    /**
     * If true, only the avatar gets rendered, no lines of text.
     */
    avatarOnly?: boolean;
    /**
     * Preferred size of the avatar.
     */
    avatarSize?: number;
    /**
     * One of the expected status strings (e.g. 'available') to render a badge on the avatar, if necessary.
     */
    avatarStatus?: string;
    /**
     * External style to be applied to the avatar (icon).
     */
    avatarStyle?: StyleType;
    /**
     * External style to be applied to the avatar (text).
     */
    avatarTextStyle?: StyleType;
    /**
     * Children of the component.
     */
    children?: React.ReactNode;
    /**
     * Item containing data to be rendered.
     */
    item: Item;
    /**
     * External style prop to be applied to the extra lines.
     */
    linesStyle?: StyleType;
    /**
     * Function to invoke on long press.
     */
    onLongPress?: (e: GestureResponderEvent) => void;
    /**
     * Function to invoke on press.
     */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * External style prop to be applied to the title.
     */
    titleStyle?: StyleType;
}
/**
 * Implements a list item with an avatar rendered for it.
 */
export default class AvatarListItem extends Component<IProps> {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Renders a single line from the additional lines.
     *
     * @param {string} line - The line text.
     * @param {number} index - The index of the line.
     * @private
     * @returns {React$Node}
     */
    _renderItemLine(line: string, index: number): JSX.Element | null;
    /**
     * Renders the additional item lines, if any.
     *
     * @param {Array<string>} lines - The lines to render.
     * @private
     * @returns {Array<React$Node>}
     */
    _renderItemLines(lines?: string[]): (JSX.Element | null)[] | null;
}
