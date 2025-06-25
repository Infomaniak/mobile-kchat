/// <reference types="react" />
import { IStore } from '../../app/types';
export interface IProps {
    /**
     * The resource for the description, computed based on the maxMode and whether the switch is toggled or not.
     */
    _descriptionResource?: string;
    /**
     * Custom e2ee labels.
     */
    _e2eeLabels: any;
    /**
     * Whether the switch is currently enabled or not.
     */
    _enabled: boolean;
    /**
     * Indicates whether all participants in the conference currently support E2EE.
     */
    _everyoneSupportE2EE: boolean;
    /**
     * Whether E2EE is currently enabled or not.
     */
    _toggled: boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}
declare const _default: import("react-redux").ConnectedComponent<({ _descriptionResource, _enabled, _e2eeLabels, _everyoneSupportE2EE, _toggled, dispatch }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "dispatch" | "_descriptionResource" | "_enabled" | "_e2eeLabels" | "_everyoneSupportE2EE" | "_toggled">>;
export default _default;
