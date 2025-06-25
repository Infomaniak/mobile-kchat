"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_DIALOG_SIZE = void 0;
/**
 * A preferred (or optimal) dialog size. This constant is reused in many
 * components, where dialog size optimization is suggested.
 *
 * NOTE: Even though we support valious devices, including tablets, we don't
 * want the dialogs to be oversized even on larger devices. This number seems
 * to be a good compromise, but also easy to update.
 */
exports.PREFERRED_DIALOG_SIZE = 300;
