import { ComponentType } from 'react';
import { IProps as IBaseProps } from './BaseDialog';
interface IObject {
    [key: string]: string | string[] | boolean | number | number[] | {} | undefined;
}
export interface IDialogTab<P> {
    cancel?: Function;
    className?: string;
    component: ComponentType<any>;
    icon: Function;
    labelKey: string;
    name: string;
    props?: IObject;
    propsUpdateFunction?: (tabState: IObject, newProps: P, tabStates?: (IObject | undefined)[]) => P;
    submit?: Function;
}
export interface IProps extends IBaseProps {
    defaultTab?: string;
    tabs: IDialogTab<any>[];
}
declare const DialogWithTabs: ({ className, defaultTab, titleKey, tabs }: IProps) => JSX.Element;
export default DialogWithTabs;
