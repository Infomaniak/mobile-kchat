/**
 * Mixed type of the element (subtree) config. If it's a {@code boolean} (and is
 * {@code true}), we persist the entire subtree. If it's an {@code Object}, we
 * perist a filtered subtree based on the properties of the config object.
 */
declare type ElementConfig = boolean | Object;
/**
 * The type of the name-config pairs stored in {@code PersistenceRegistry}.
 */
declare type PersistencyConfigMap = {
    [name: string]: ElementConfig;
};
/**
 * A registry to allow features to register their redux store subtree to be
 * persisted and also handles the persistency calls too.
 */
declare class PersistenceRegistry {
    _checksum: string;
    _defaultStates: {
        [name: string]: Object | undefined;
    };
    _elements: PersistencyConfigMap;
    /**
     * Returns the persisted redux state. Takes the {@link #_elements} into
     * account as we may have persisted something in the past that we don't want
     * to retrieve anymore. The next {@link #persistState} will remove such
     * values.
     *
     * @returns {Object}
     */
    getPersistedState(): any;
    /**
     * Initiates a persist operation, but its execution will depend on the
     * current checksums (checks changes).
     *
     * @param {Object} state - The redux state.
     * @returns {void}
     */
    persistState(state: Object): void;
    /**
     * Registers a new subtree config to be used for the persistency.
     *
     * @param {string} name - The name of the subtree the config belongs to.
     * @param {ElementConfig} config - The config {@code Object}, or
     * {@code boolean} if the entire subtree needs to be persisted.
     * @param {Object} defaultState - The default state of the component. If
     * it's provided, the rehydrated state will be merged with it before it gets
     * pushed into Redux.
     * @returns {void}
     */
    register(name: string, config?: ElementConfig, defaultState?: Object): void;
    /**
     * Calculates the checksum of a specific state.
     *
     * @param {Object} state - The redux state to calculate the checksum of.
     * @private
     * @returns {string} The checksum of the specified {@code state}.
     */
    _calculateChecksum(state: Object): string;
    /**
     * Prepares a filtered state from the actual or the persisted redux state,
     * based on this registry.
     *
     * @param {Object} state - The actual or persisted redux state.
     * @private
     * @returns {Object}
     */
    _getFilteredState(state: any): any;
    /**
     * Prepares a filtered subtree based on the config for persisting or for
     * retrieval.
     *
     * @param {Object} subtree - The redux state subtree.
     * @param {ElementConfig} subtreeConfig - The related config.
     * @private
     * @returns {Object}
     */
    _getFilteredSubtree(subtree: any, subtreeConfig: any): any;
    /**
     * Retrieves a persisted subtree from the storage.
     *
     * @param {string} subtreeName - The name of the subtree.
     * @param {Object} subtreeConfig - The config of the subtree from
     * {@link #_elements}.
     * @param {Object} subtreeDefaults - The defaults of the persisted subtree.
     * @private
     * @returns {Object}
     */
    _getPersistedSubtree(subtreeName: string, subtreeConfig: Object, subtreeDefaults?: Object): Object | undefined;
    /**
     * Merges the persisted subtree with its defaults before rehydrating the
     * values.
     *
     * @private
     * @param {Object} subtree - The Redux subtree.
     * @param {?Object} defaults - The defaults, if any.
     * @returns {Object}
     */
    _mergeDefaults(subtree: Object, defaults?: Object): Object | undefined;
}
declare const _default: PersistenceRegistry;
export default _default;
