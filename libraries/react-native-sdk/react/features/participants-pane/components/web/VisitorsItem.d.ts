/// <reference types="react" />
import { IPromotionRequest } from '../../../visitors/types';
export interface IProps {
    /**
     * Promotion request reference.
     */
    request: IPromotionRequest;
}
export declare const VisitorsItem: ({ request: r }: IProps) => JSX.Element;
