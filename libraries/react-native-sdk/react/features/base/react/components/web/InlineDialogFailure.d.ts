/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link InlineDialogFailure}.
 */
export interface IProps {
    /**
     * Allows to retry the call that previously didn't succeed.
     */
    onRetry: Function;
    /**
     * Indicates whether the support link should be shown in case of an error.
     */
    showSupportLink: Boolean;
}
/**
 * Inline dialog that represents a failure and allows a retry.
 *
 * @returns {Element}
 */
declare const InlineDialogFailure: ({ onRetry, showSupportLink }: IProps) => JSX.Element;
export default InlineDialogFailure;
