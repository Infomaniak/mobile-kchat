import * as React from 'react';
export interface IProps {
    /**
     * The default theme or theme set through advanced branding.
     */
    _theme: Object;
    /**
    * The children of the component.
    */
    children: React.ReactNode;
}
/**
 * The theme provider for the web app.
 *
 * @param {Object} props - The props of the component.
 * @returns {React.ReactNode}
 */
declare function JitsiThemeProvider(props: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof JitsiThemeProvider, import("react-redux").Omit<IProps, "_theme">>;
export default _default;
