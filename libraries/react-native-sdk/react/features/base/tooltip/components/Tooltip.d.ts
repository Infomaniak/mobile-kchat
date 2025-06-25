import { ReactElement } from 'react';
import { TOOLTIP_POSITION } from '../../ui/constants.any';
export interface IProps {
    children: ReactElement;
    containerClassName?: string;
    content: string | ReactElement;
    position?: TOOLTIP_POSITION;
}
declare const Tooltip: ({ containerClassName, content, children, position }: IProps) => JSX.Element;
export default Tooltip;
