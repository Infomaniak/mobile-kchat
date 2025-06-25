/// <reference types="react" />
export interface IProps {
    color?: string;
    size?: 'small' | 'medium' | 'large';
}
declare const Spinner: ({ color, size }: IProps) => JSX.Element;
export default Spinner;
