/// <reference types="react" />
import { FaceLandmarks } from '../../../face-landmarks/types';
export interface IProps {
    faceLandmarks?: FaceLandmarks[];
}
declare const Timeline: ({ faceLandmarks }: IProps) => JSX.Element;
export default Timeline;
