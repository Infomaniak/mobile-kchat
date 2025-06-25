import React from 'react';
import { IStore } from '../../../app/types';
/**
 * Type definition for a single entry in the device list.
 */
interface IDevice {
    /**
     * Name of the icon which will be rendered on the right.
     */
    icon: Function;
    /**
     * True if the element is selected (will be highlighted in blue),
     * false otherwise.
     */
    selected: boolean;
    /**
     * Text which will be rendered in the row.
     */
    text: string;
    /**
     * Device type.
     */
    type: string;
    /**
     * Unique device ID.
     */
    uid?: string;
}
/**
 * "Raw" device, as returned by native.
 */
export interface IRawDevice {
    /**
     * Display name for the device.
     */
    name?: string;
    /**
     * Is this device selected?
     */
    selected: boolean;
    /**
     * Device type.
     */
    type: string;
    /**
     * Unique device ID.
     */
    uid?: string;
}
/**
 * {@code AudioRoutePickerDialog}'s React {@code Component} prop types.
 */
export interface IProps {
    /**
     * Object describing available devices.
     */
    _devices: Array<IRawDevice>;
    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: IStore['dispatch'];
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
/**
 * {@code AudioRoutePickerDialog}'s React {@code Component} state types.
 */
export interface IState {
    /**
     * Array of available devices.
     */
    devices: Array<IDevice>;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
