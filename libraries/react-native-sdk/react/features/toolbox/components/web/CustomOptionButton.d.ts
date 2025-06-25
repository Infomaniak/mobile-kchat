/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    backgroundColor?: string;
    icon: string;
    id?: string;
    text: string;
}
/**
 * Component that renders a custom toolbox button.
 *
 * @returns {Component}
 */
declare class CustomOptionButton extends AbstractButton<IProps> {
    iconSrc: string;
    id: string | undefined;
    text: string;
    backgroundColor: string | undefined;
    accessibilityLabel: string;
    /**
     * Custom icon component.
     *
     * @param {any} props - Icon's props.
     * @returns {img}
     */
    icon: (props: any) => JSX.Element;
    label: string;
    tooltip: string;
}
export default CustomOptionButton;
