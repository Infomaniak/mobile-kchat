/// <reference types="react" />
import { WithTranslation } from 'react-i18next';
import ExpandedLabel, { IProps as AbstractProps } from '../../../base/label/components/native/ExpandedLabel';
export interface IProps extends AbstractProps, WithTranslation {
    getUnsafeRoomTextFn: Function;
}
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code InsecureRoomNameExpandedLabel}.
 */
declare class InsecureRoomNameExpandedLabel extends ExpandedLabel<IProps> {
    /**
     * Returns the color this expanded label should be rendered with.
     *
     * @returns {string}
     */
    _getColor(): any;
    /**
     * Returns the label specific text of this {@code ExpandedLabel}.
     *
     * @returns {string}
     */
    _getLabel(): any;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<import("react").ClassAttributes<InsecureRoomNameExpandedLabel> & IProps, "getUnsafeRoomTextFn">, keyof WithTranslation>>;
export default _default;
