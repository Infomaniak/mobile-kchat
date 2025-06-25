/**
 * The default list of domains known to the feature base/known-domains.
 * Generally, it should be in sync with the domains associated with the app
 * through its manifest (in other words, Universal Links, deep linking). Anyway,
 * we need a hardcoded list because it has proven impossible to programmatically
 * read the information out of the app's manifests: App Store strips the
 * associated domains manifest out of the app so it's never downloaded on the
 * client and we did not spend a lot of effort to read the associated domains
 * out of the Android manifest.
 */
export declare const DEFAULT_STATE: string[];
export type IKnownDomainsState = Array<string>;
