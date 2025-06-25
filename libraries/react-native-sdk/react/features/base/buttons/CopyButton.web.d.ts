/// <reference types="react" />
export interface IProps {
    /**
     * The invisible text for screen readers.
     *
     * Intended to give the same info as `displayedText`, but can be customized to give more necessary context.
     * If not given, `displayedText` will be used.
     */
    accessibilityText?: string;
    /**
     * Css class to apply on container.
     */
    className?: string;
    /**
     * The displayed text.
     */
    displayedText: string;
    /**
     * The id of the button.
     */
    id?: string;
    /**
     * The text displayed on copy success.
     */
    textOnCopySuccess: string;
    /**
     * The text displayed on mouse hover.
     */
    textOnHover: string;
    /**
     * The text that needs to be copied (might differ from the displayedText).
     */
    textToCopy: string;
}
/**
 * Component meant to enable users to copy the conference URL.
 *
 * @returns {React$Element<any>}
 */
declare function CopyButton({ accessibilityText, className, displayedText, textToCopy, textOnHover, textOnCopySuccess, id }: IProps): JSX.Element;
export default CopyButton;
