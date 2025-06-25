import { ComponentType } from 'react';
import { AbstractApp, IProps as AbstractAppProps } from './AbstractApp';
import '../middlewares.native';
import '../reducers.native';
/**
 * The type of React {@code Component} props of {@link App}.
 */
export interface IProps extends AbstractAppProps {
    /**
     * An object with the feature flags.
     */
    flags?: any;
    /**
     * An object with user information (display name, email, avatar URL).
     */
    userInfo?: Object;
}
/**
 * Root app {@code Component} on mobile/React Native.
 *
 * @augments AbstractApp
 */
export declare class App extends AbstractApp<IProps> {
    /**
     * Initializes a new {@code App} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Initializes the color scheme.
     *
     * @inheritdoc
     *
     * @returns {void}
     */
    componentDidMount(): Promise<void>;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Initializes feature flags and updates settings.
     *
     * @returns {void}
     */
    _extraInit(): Promise<void>;
    /**
     * Overrides the parent method to inject {@link DimensionsDetector} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component: ComponentType<any>, props: Object): JSX.Element;
    /**
     * Attempts to disable the use of React Native
     * {@link ExceptionsManager#handleException} on platforms and in
     * configurations on/in which the use of the method in questions has been
     * determined to be undesirable. For example, React Native will
     * (intentionally) throw an unhandled {@code JavascriptException} for an
     * unhandled JavaScript error in the Release configuration. This will
     * effectively kill the app. In accord with the Web, do not kill the app.
     *
     * @private
     * @returns {void}
     */
    _maybeDisableExceptionsManager(): void;
    /**
     * Updates the known available size for the app to occupy.
     *
     * @param {number} width - The component's current width.
     * @param {number} height - The component's current height.
     * @private
     * @returns {void}
     */
    _onDimensionsChanged(width: number, height: number): void;
    /**
     * Updates the safe are insets values.
     *
     * @param {Object} insets - The insets.
     * @param {number} insets.top - The top inset.
     * @param {number} insets.right - The right inset.
     * @param {number} insets.bottom - The bottom inset.
     * @param {number} insets.left - The left inset.
     * @private
     * @returns {void}
     */
    _onSafeAreaInsetsChanged(insets: Object): void;
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer(): JSX.Element;
}
