/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link DisplayName}.
 */
export interface IProps {
    /**
     * Whether or not the display name should be editable on click.
     */
    allowEditing: boolean;
    /**
     * A string to append to the displayName, if provided.
     */
    displayNameSuffix: string;
    /**
     * The ID attribute to add to the component. Useful for global querying for
     * the component by legacy components and torture tests.
     */
    elementID: string;
    /**
     * The ID of the participant whose name is being displayed.
     */
    participantID: string;
    /**
     * The type of thumbnail.
     */
    thumbnailType?: string;
}
declare const DisplayName: ({ allowEditing, displayNameSuffix, elementID, participantID, thumbnailType }: IProps) => JSX.Element;
export default DisplayName;
