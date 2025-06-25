import { ComponentType } from 'react';
import BaseApp from '../../../base/app/components/BaseApp';
type Props = {
    /**
     * Indicates the style type that needs to be applied.
     */
    styleType: string;
};
/**
 * Wrapper application for prejoin.
 *
 * @augments BaseApp
 */
export default class PrejoinApp extends BaseApp<Props> {
    /**
     * Navigates to {@link Prejoin} upon mount.
     *
     * @returns {void}
     */
    componentDidMount(): Promise<void>;
    /**
     * Overrides the parent method to inject {@link AtlasKitThemeProvider} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component: ComponentType<any>, props: Object): JSX.Element;
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer(): JSX.Element;
}
export {};
