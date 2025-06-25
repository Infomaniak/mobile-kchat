import { ComponentType } from 'react';
export interface IDialogState {
    component?: ComponentType;
    componentProps?: Object;
    sheet?: ComponentType;
    sheetProps?: Object;
}
