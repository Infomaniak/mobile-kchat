import { IStore } from '../../app/types';
/**
 * Loads the enabled stream effects.
 *
 * @param {Object} store - The Redux store.
 * @returns {Promise} - A Promise which resolves when all effects are created.
 */
export default function loadEffects(store: IStore): Promise<any>;
