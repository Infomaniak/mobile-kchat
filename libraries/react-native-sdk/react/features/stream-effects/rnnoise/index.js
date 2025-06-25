"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRnnoiseProcessor = exports.RNNOISE_SAMPLE_LENGTH = void 0;
// Script expects to find rnnoise webassembly binary in the same public path root, otherwise it won't load
// During the build phase this needs to be taken care of manually
// @ts-expect-error
const rnnoise_wasm_1 = require("@jitsi/rnnoise-wasm");
const RnnoiseProcessor_1 = __importDefault(require("./RnnoiseProcessor"));
var RnnoiseProcessor_2 = require("./RnnoiseProcessor");
Object.defineProperty(exports, "RNNOISE_SAMPLE_LENGTH", { enumerable: true, get: function () { return RnnoiseProcessor_2.RNNOISE_SAMPLE_LENGTH; } });
let rnnoiseModule;
/**
 * Creates a new instance of RnnoiseProcessor.
 *
 * @returns {Promise<RnnoiseProcessor>}
 */
function createRnnoiseProcessor() {
    if (!rnnoiseModule) {
        rnnoiseModule = (0, rnnoise_wasm_1.createRNNWasmModule)();
    }
    return rnnoiseModule?.then(mod => new RnnoiseProcessor_1.default(mod));
}
exports.createRnnoiseProcessor = createRnnoiseProcessor;
