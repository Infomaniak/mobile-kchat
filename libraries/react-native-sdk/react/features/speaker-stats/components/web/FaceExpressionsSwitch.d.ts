/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link ToggleFaceExpressionsButton}.
 */
export interface IProps {
    /**
     * The function to initiate the change in the speaker stats table.
     */
    onChange: (checked?: boolean) => void;
    /**
     * The state of the button.
     */
    showFaceExpressions: boolean;
}
/**
 * React component for toggling face expressions grid.
 *
 * @returns {React$Element<any>}
 */
export default function FaceExpressionsSwitch({ onChange, showFaceExpressions }: IProps): JSX.Element;
