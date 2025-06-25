/// <reference types="react" />
/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {any} _stateful - Used on web.
 * @returns {Promise<Object>}
 */
export declare function _getRouteToRender(_stateful?: any): Promise<{
    component: import("react-redux").ConnectedComponent<({ dispatch, isUnsafeRoomWarningAvailable, isWelcomePageAvailable }: import("../mobile/navigation/components/RootNavigationContainer").IProps) => JSX.Element, import("react-redux").Omit<import("../mobile/navigation/components/RootNavigationContainer").IProps, "dispatch" | "isUnsafeRoomWarningAvailable" | "isWelcomePageAvailable">>;
    href: undefined;
}>;
