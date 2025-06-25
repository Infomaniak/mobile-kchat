/// <reference types="react" />
export interface IProps {
    accessibilityLabel: string;
    className?: string;
    icon: Function;
    id?: string;
    onClick: () => void;
}
declare const ClickableIcon: ({ accessibilityLabel, className, icon, id, onClick }: IProps) => JSX.Element;
export default ClickableIcon;
