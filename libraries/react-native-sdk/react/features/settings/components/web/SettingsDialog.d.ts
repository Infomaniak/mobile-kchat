/// <reference types="react" />
import { IStore } from '../../../app/types';
import { IDialogTab } from '../../../base/ui/components/web/DialogWithTabs';
/**
 * The type of the React {@code Component} props of
 * {@link ConnectedSettingsDialog}.
 */
export interface IProps {
    /**
     * Information about the tabs to be rendered.
     */
    _tabs: IDialogTab<any>[];
    /**
     * Which settings tab should be initially displayed. If not defined then
     * the first tab will be displayed.
     */
    defaultTab: string;
    /**
     * Invoked to save changed settings.
     */
    dispatch: IStore['dispatch'];
    /**
     * Indicates whether the device selection dialog is displayed on the
     * welcome page or not.
     */
    isDisplayedOnWelcomePage: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<({ _tabs, defaultTab, dispatch }: IProps) => JSX.Element, any>;
export default _default;
