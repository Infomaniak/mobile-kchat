/// <reference types="react" />
import { IStore } from '../../../app/types';
import { INotificationProps } from '../../types';
export interface IProps {
    /**
     * Whether we are a SIP gateway or not.
     */
    _iAmSipGateway: boolean;
    /**
     * Whether or not the chat is open.
     */
    _isChatOpen: boolean;
    /**
     * The notifications to be displayed, with the first index being the
     * notification at the top and the rest shown below it in order.
     */
    _notifications: Array<{
        props: INotificationProps;
        uid: string;
    }>;
    /**
     * Invoked to update the redux store in order to remove notifications.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not the notifications are displayed in a portal.
     */
    portal?: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<({ _iAmSipGateway, _notifications, dispatch, portal }: IProps) => JSX.Element | null, import("react-redux").Omit<IProps, "dispatch" | "_isChatOpen" | "_iAmSipGateway" | "_notifications">>;
export default _default;
