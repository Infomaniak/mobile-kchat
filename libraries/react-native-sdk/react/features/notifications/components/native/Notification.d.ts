/// <reference types="react" />
import { INotificationProps } from '../../types';
export interface IProps extends INotificationProps {
    _participants: ArrayLike<any>;
    onDismissed: Function;
}
declare const Notification: ({ appearance, customActionHandler, customActionNameKey, customActionType, description, descriptionArguments, descriptionKey, icon, onDismissed, title, titleArguments, titleKey, uid }: IProps) => JSX.Element;
export default Notification;
