/// <reference types="react" />
interface ITabProps {
    accessibilityLabel: string;
    className?: string;
    onChange: (id: string) => void;
    selected: string;
    tabs: Array<{
        accessibilityLabel: string;
        controlsId: string;
        countBadge?: number;
        disabled?: boolean;
        id: string;
        label: string;
    }>;
}
declare const Tabs: ({ accessibilityLabel, className, onChange, selected, tabs }: ITabProps) => JSX.Element;
export default Tabs;
