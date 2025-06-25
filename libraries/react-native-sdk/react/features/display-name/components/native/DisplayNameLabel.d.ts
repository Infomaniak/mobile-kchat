import * as React from 'react';
export interface IProps {
    /**
     * The name of the participant to render.
     */
    _participantName: string;
    /**
     * True of the label needs to be rendered. False otherwise.
     */
    _render: boolean;
    /**
     * Whether or not the name is in a container.
     */
    contained?: boolean;
    /**
     * The ID of the participant to render the label for.
     */
    participantId: string;
}
/**
 * Renders a label with the display name of the on-stage participant.
 */
declare class DisplayNameLabel extends React.Component<IProps> {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof DisplayNameLabel, import("react-redux").Omit<React.ClassAttributes<DisplayNameLabel> & IProps, "_participantName" | "_render"> & Partial<IProps>>;
export default _default;
