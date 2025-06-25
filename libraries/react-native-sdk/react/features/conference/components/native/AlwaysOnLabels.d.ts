/// <reference types="react" />
export interface IProps {
    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    createOnPress: Function;
}
declare const AlwaysOnLabels: ({ createOnPress }: IProps) => JSX.Element;
export default AlwaysOnLabels;
