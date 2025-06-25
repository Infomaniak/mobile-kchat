import { ReactNode } from 'react';
import { TEXT_OVERFLOW_TYPES } from '../../constants.web';
interface ITextWithOverflowProps {
    children: ReactNode;
    className?: string;
    overflowType?: TEXT_OVERFLOW_TYPES;
}
declare const TextWithOverflow: ({ className, overflowType, children }: ITextWithOverflowProps) => JSX.Element;
export default TextWithOverflow;
