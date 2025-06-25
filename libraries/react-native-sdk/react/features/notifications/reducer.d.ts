export interface INotification {
    component: Object;
    props: {
        appearance?: string;
        descriptionArguments?: Object;
        descriptionKey?: string;
        titleKey: string;
    };
    timeout: number;
    uid: string;
}
export interface INotificationsState {
    enabled: boolean;
    notifications: INotification[];
}
