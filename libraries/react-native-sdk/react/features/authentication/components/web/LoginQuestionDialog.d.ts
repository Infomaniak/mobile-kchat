/// <reference types="react" />
/**
 * The type of {@link LoginQuestionDialog}'s React {@code Component} props.
 */
export interface IProps {
    /**
     * The handler.
     */
    handler: () => void;
}
/**
 * Implements the dialog that warns the user that the login will leave the conference.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
declare const LoginQuestionDialog: ({ handler }: IProps) => JSX.Element;
export default LoginQuestionDialog;
