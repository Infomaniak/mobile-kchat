/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link DeviceSelector}.
 */
export interface IProps {
    /**
     * MediaDeviceInfos used for display in the select element.
     */
    devices: Array<MediaDeviceInfo> | undefined;
    /**
     * If false, will return a selector with no selection options.
     */
    hasPermission: boolean;
    /**
     * CSS class for the icon to the left of the dropdown trigger.
     */
    icon: string;
    /**
     * The id of the dropdown element.
     */
    id: string;
    /**
     * If true, will render the selector disabled with a default selection.
     */
    isDisabled: boolean;
    /**
     * The translation key to display as a menu label.
     */
    label: string;
    /**
     * The callback to invoke when a selection is made.
     */
    onSelect: Function;
    /**
     * The default device to display as selected.
     */
    selectedDeviceId: string;
}
declare const DeviceSelector: ({ devices, hasPermission, id, isDisabled, label, onSelect, selectedDeviceId }: IProps) => JSX.Element | null;
export default DeviceSelector;
