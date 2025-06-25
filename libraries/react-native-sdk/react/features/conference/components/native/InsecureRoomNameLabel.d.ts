import React from 'react';
import AbstractInsecureRoomNameLabel from '../AbstractInsecureRoomNameLabel';
/**
 * Renders a label indicating that we are in a room with an insecure name.
 */
declare class InsecureRoomNameLabel extends AbstractInsecureRoomNameLabel {
    /**
     * Renders the platform dependent content.
     *
     * @inheritdoc
     */
    _render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<InsecureRoomNameLabel> & import("../AbstractInsecureRoomNameLabel").IProps, "_visible">, keyof import("react-i18next").WithTranslation>>;
export default _default;
