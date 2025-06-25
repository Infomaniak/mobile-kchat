/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link ReactionMenu}.
 */
export interface IProps {
    /**
     * Used to close the overflow menu after raise hand is clicked.
     */
    onCancel: Function;
    /**
     * Whether or not it's displayed in the overflow menu.
     */
    overflowMenu: boolean;
}
/**
 * Animated reaction emoji.
 *
 * @returns {ReactElement}
 */
declare function ReactionMenu({ onCancel, overflowMenu }: IProps): JSX.Element;
export default ReactionMenu;
