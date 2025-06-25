/// <reference types="react" />
export interface IProps {
    /**
     * The selected label to show details.
     */
    visibleExpandedLabel?: string;
}
declare const ExpandedLabelPopup: ({ visibleExpandedLabel }: IProps) => JSX.Element | null;
export default ExpandedLabelPopup;
