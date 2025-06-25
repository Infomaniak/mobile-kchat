/**
 * The config keys to whitelist, the keys that can be overridden.
 * Whitelisting a key allows all properties under that key to be overridden.
 * For example whitelisting 'p2p' allows 'p2p.enabled' to be overridden, and
 * overriding 'p2p.enabled' does not modify any other keys under 'p2p'.
 * The whitelist is used only for config.js.
 *
 * @type Array
 */
declare const _default: string[];
export default _default;
