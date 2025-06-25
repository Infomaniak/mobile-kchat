import { IPromotionRequest } from './types';
export interface IVisitorsState {
    count?: number;
    demoteActorDisplayName?: string;
    iAmVisitor: boolean;
    promotionRequests: IPromotionRequest[];
    supported: boolean;
}
