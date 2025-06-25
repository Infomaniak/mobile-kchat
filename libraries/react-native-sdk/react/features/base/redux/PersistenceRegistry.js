"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const js_utils_1 = require("@jitsi/js-utils");
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const json_1 = require("@jitsi/js-utils/json");
const js_md5_1 = __importDefault(require("js-md5"));
const logger_1 = __importDefault(require("./logger"));
/**
 * A registry to allow features to register their redux store subtree to be
 * persisted and also handles the persistency calls too.
 */
class PersistenceRegistry {
    constructor() {
        this._checksum = '';
        this._defaultStates = {};
        this._elements = {};
    }
    /**
     * Returns the persisted redux state. Takes the {@link #_elements} into
     * account as we may have persisted something in the past that we don't want
     * to retrieve anymore. The next {@link #persistState} will remove such
     * values.
     *
     * @returns {Object}
     */
    getPersistedState() {
        const filteredPersistedState = {};
        // localStorage key per feature
        for (const subtreeName of Object.keys(this._elements)) {
            // Assumes that the persisted value is stored under the same key as
            // the feature's redux state name.
            const persistedSubtree = this._getPersistedSubtree(subtreeName, this._elements[subtreeName], this._defaultStates[subtreeName]);
            if (persistedSubtree !== undefined) {
                filteredPersistedState[subtreeName] = persistedSubtree;
            }
        }
        // Initialize the checksum.
        this._checksum = this._calculateChecksum(filteredPersistedState);
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            logger_1.default.info('redux state rehydrated as', filteredPersistedState);
        }
        return filteredPersistedState;
    }
    /**
     * Initiates a persist operation, but its execution will depend on the
     * current checksums (checks changes).
     *
     * @param {Object} state - The redux state.
     * @returns {void}
     */
    persistState(state) {
        const filteredState = this._getFilteredState(state);
        const checksum = this._calculateChecksum(filteredState);
        if (checksum !== this._checksum) {
            for (const subtreeName of Object.keys(filteredState)) {
                try {
                    js_utils_1.jitsiLocalStorage.setItem(subtreeName, JSON.stringify(filteredState[subtreeName]));
                }
                catch (error) {
                    logger_1.default.error('Error persisting redux subtree', subtreeName, error);
                }
            }
            logger_1.default.info(`redux state persisted. ${this._checksum} -> ${checksum}`);
            this._checksum = checksum;
        }
    }
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
    register(name, config = true, defaultState) {
        this._elements[name] = config;
        this._defaultStates[name] = defaultState;
    }
    /**
     * Calculates the checksum of a specific state.
     *
     * @param {Object} state - The redux state to calculate the checksum of.
     * @private
     * @returns {string} The checksum of the specified {@code state}.
     */
    _calculateChecksum(state) {
        try {
            return js_md5_1.default.hex(JSON.stringify(state) || '');
        }
        catch (error) {
            logger_1.default.error('Error calculating checksum for state', error);
            return '';
        }
    }
    /**
     * Prepares a filtered state from the actual or the persisted redux state,
     * based on this registry.
     *
     * @param {Object} state - The actual or persisted redux state.
     * @private
     * @returns {Object}
     */
    _getFilteredState(state) {
        const filteredState = {};
        for (const name of Object.keys(this._elements)) {
            if (state[name]) {
                filteredState[name]
                    = this._getFilteredSubtree(state[name], this._elements[name]);
            }
        }
        return filteredState;
    }
    /**
     * Prepares a filtered subtree based on the config for persisting or for
     * retrieval.
     *
     * @param {Object} subtree - The redux state subtree.
     * @param {ElementConfig} subtreeConfig - The related config.
     * @private
     * @returns {Object}
     */
    _getFilteredSubtree(subtree, subtreeConfig) {
        let filteredSubtree;
        if (typeof subtreeConfig === 'object') {
            // Only a filtered subtree gets persisted as specified by
            // subtreeConfig.
            filteredSubtree = {};
            for (const persistedKey of Object.keys(subtree)) {
                if (subtreeConfig[persistedKey]) {
                    filteredSubtree[persistedKey] = subtree[persistedKey];
                }
            }
        }
        else if (subtreeConfig) {
            // Persist the entire subtree.
            filteredSubtree = subtree;
        }
        return filteredSubtree;
    }
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
    _getPersistedSubtree(subtreeName, subtreeConfig, subtreeDefaults) {
        let persistedSubtree = js_utils_1.jitsiLocalStorage.getItem(subtreeName);
        if (persistedSubtree) {
            try {
                persistedSubtree = (0, json_1.safeJsonParse)(persistedSubtree);
                const filteredSubtree = this._getFilteredSubtree(persistedSubtree, subtreeConfig);
                if (filteredSubtree !== undefined) {
                    return this._mergeDefaults(filteredSubtree, subtreeDefaults);
                }
            }
            catch (error) {
                logger_1.default.error('Error parsing persisted subtree', subtreeName, persistedSubtree, error);
            }
        }
        return undefined;
    }
    /**
     * Merges the persisted subtree with its defaults before rehydrating the
     * values.
     *
     * @private
     * @param {Object} subtree - The Redux subtree.
     * @param {?Object} defaults - The defaults, if any.
     * @returns {Object}
     */
    _mergeDefaults(subtree, defaults) {
        if (!defaults) {
            return subtree;
        }
        // If the subtree is an array, we don't need to merge it with the
        // defaults, because if it has a value, it will overwrite it, and if
        // it's undefined, it won't be even returned, and Redux will natively
        // use the default values instead.
        if (!Array.isArray(subtree)) {
            return {
                ...defaults,
                ...subtree
            };
        }
    }
}
exports.default = new PersistenceRegistry();
