/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link PasswordForm}.
 */
export interface IProps {
    /**
     * Whether or not to show the password editing field.
     */
    editEnabled: boolean;
    /**
     * The value for how the conference is locked (or undefined if not locked)
     * as defined by room-lock constants.
     */
    locked?: string;
    /**
     * Callback to invoke when the local participant is submitting a password
     * set request.
     */
    onSubmit: Function;
    /**
     * The current known password for the JitsiConference.
     */
    password?: string;
    /**
     * The number of digits to be used in the password.
     */
    passwordNumberOfDigits?: number;
    /**
     * Whether or not the password should be visible.
     */
    visible: boolean;
}
/**
 * React {@code Component} for displaying and editing the conference password.
 *
 * @returns {ReactElement}
 */
export default function PasswordForm({ editEnabled, locked, onSubmit, password, passwordNumberOfDigits, visible }: IProps): JSX.Element;
