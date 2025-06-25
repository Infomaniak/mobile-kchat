/// <reference types="react" />
import { IReactionEmojiProps } from '../../constants';
export interface IProps extends IReactionEmojiProps {
    /**
     * Index of reaction on the queue.
     * Used to differentiate between first and other animations.
     */
    index: number;
}
/**
 * Animated reaction emoji.
 *
 * @returns {ReactElement}
 */
declare function ReactionEmoji({ reaction, uid, index }: IProps): JSX.Element;
export default ReactionEmoji;
