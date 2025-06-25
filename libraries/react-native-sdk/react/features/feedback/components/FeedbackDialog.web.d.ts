/// <reference types="react" />
import { IJitsiConference } from '../../base/conference/reducer';
/**
 * The type of the React {@code Component} props of {@link FeedbackDialog}.
 */
export interface IProps {
    /**
     * The JitsiConference that is being rated. The conference is passed in
     * because feedback can occur after a conference has been left, so
     * references to it may no longer exist in redux.
     */
    conference: IJitsiConference;
    /**
     * Callback invoked when {@code FeedbackDialog} is unmounted.
     */
    onClose: Function;
    /**
     * The title to display in the dialog. Usually the reason that triggered the feedback.
     */
    title?: string;
}
/**
 * A React {@code Component} for displaying a dialog to rate the current
 * conference quality, write a message describing the experience, and submit
 * the feedback.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
declare const FeedbackDialog: ({ conference, onClose, title }: IProps) => JSX.Element;
export default FeedbackDialog;
