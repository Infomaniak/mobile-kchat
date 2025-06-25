/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link LeaveReasonDialog}.
 */
export interface IProps {
    /**
     * Callback invoked when {@code LeaveReasonDialog} is unmounted.
     */
    onClose: () => void;
    /**
     * The title to display in the dialog.
     */
    title?: string;
}
/**
 * A React {@code Component} for displaying a dialog with a reason that ended the conference.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
declare const LeaveReasonDialog: ({ onClose, title }: IProps) => JSX.Element;
export default LeaveReasonDialog;
