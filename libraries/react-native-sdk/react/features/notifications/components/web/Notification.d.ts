/// <reference types="react" />
import { INotificationProps } from '../../types';
export interface IProps extends INotificationProps {
    /**
     * Callback invoked when the user clicks to dismiss the notification.
     */
    onDismissed: Function;
}
declare const Notification: ({ appearance, customActionHandler, customActionNameKey, customActionType, description, descriptionArguments, descriptionKey, hideErrorSupportLink, icon, onDismissed, title, titleArguments, titleKey, uid }: IProps) => JSX.Element;
export default Notification;
