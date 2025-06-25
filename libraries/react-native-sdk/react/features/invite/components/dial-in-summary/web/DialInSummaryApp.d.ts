import { ComponentType } from 'react';
import BaseApp from '../../../../base/app/components/BaseApp';
/**
 * Wrapper application for prejoin.
 *
 * @augments BaseApp
 */
export default class DialInSummaryApp extends BaseApp<any> {
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
    _renderDialogContainer(): null;
}
