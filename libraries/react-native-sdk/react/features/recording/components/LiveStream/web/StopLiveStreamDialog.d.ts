import React from 'react';
import AbstractStopLiveStreamDialog from '../AbstractStopLiveStreamDialog';
/**
 * A React Component for confirming the participant wishes to stop the currently
 * active live stream of the conference.
 *
 * @augments Component
 */
declare class StopLiveStreamDialog extends AbstractStopLiveStreamDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StopLiveStreamDialog> & import("../AbstractStopLiveStreamDialog").IProps, "_conference" | "_session">, keyof import("react-i18next").WithTranslation>>;
export default _default;
