import { IStateful } from '../app/types';
import { StyleType } from '../styles/functions.any';
/**
 * A registry class to register styles that need to be color-schemed.
 *
 * This class uses lazy initialization for scheme-ified style definitions on
 * request.
 */
declare class ColorSchemeRegistry {
    /**
     * A map of already scheme-ified style definitions.
     */
    _schemedStyles: Map<any, any>;
    /**
     * A map of registered style templates.
     */
    _styleTemplates: Map<any, any>;
    /**
     * Clears the already scheme-ified style definitions.
     *
     * @returns {void}
     */
    clear(): void;
    /**
     * Retrieves the color-scheme applied style definition of a component.
     *
     * @param {Object | Function} stateful - An object or function that can be
     * resolved to Redux state using the {@code toState} function.
     * @param {string} componentName - The name of the component whose style we
     * want to retrieve.
     * @returns {StyleType}
     */
    get(stateful: IStateful, componentName: string): StyleType;
    /**
     * Registers a style definition to the registry for color-scheming.
     *
     * NOTE: It's suggested to only use this registry on styles where color
     * scheming is needed, otherwise just use a static style object as before.
     *
     * @param {string} componentName - The name of the component to register the
     * style to (e.g. {@code 'Toolbox'}).
     * @param {StyleType} style - The style definition to register.
     * @returns {void}
     */
    register(componentName: string, style: any): void;
    /**
     * Creates a color schemed style object applying the color scheme to every
     * colors in the style object prepared in a special way.
     *
     * @param {Object | Function} stateful - An object or function that can be
     * resolved to Redux state using the {@code toState} function.
     * @param {string} componentName - The name of the component to apply the
     * color scheme to.
     * @param {StyleType} style - The style definition to apply the color scheme
     * to.
     * @returns {StyleType}
     */
    _applyColorScheme(stateful: IStateful, componentName: string, style: StyleType | null): StyleType;
    /**
     * Function to get the color value for the provided identifier.
     *
     * @param {Object | Function} stateful - An object or function that can be
     * resolved to Redux state using the {@code toState} function.
     * @param {string} componentName - The name of the component to get the
     * color value for.
     * @param {string} colorDefinition - The string identifier of the color,
     * e.g. {@code appBackground}.
     * @returns {string}
     */
    _getColor(stateful: IStateful, componentName: string, colorDefinition: string): string;
}
declare const _default: ColorSchemeRegistry;
export default _default;
