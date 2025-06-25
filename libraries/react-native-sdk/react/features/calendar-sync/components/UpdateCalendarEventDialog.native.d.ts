import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the event to be updated.
     */
    eventId: string;
}
/**
 * Component for the add Jitsi link confirm dialog.
 */
declare class UpdateCalendarEventDialog extends Component<IProps> {
    /**
     * Initializes a new {@code UpdateCalendarEventDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Callback for the confirm button.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit(): boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<UpdateCalendarEventDialog> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
