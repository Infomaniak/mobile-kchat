"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractApp = void 0;
const BaseApp_1 = __importDefault(require("../../base/app/components/BaseApp"));
const uri_1 = require("../../base/util/uri");
const actions_1 = require("../actions");
const functions_1 = require("../functions");
/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
class AbstractApp extends BaseApp_1.default {
    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    async componentDidMount() {
        await super.componentDidMount();
        // If a URL was explicitly specified to this React Component, then
        // open it; otherwise, use a default.
        this._openURL((0, uri_1.toURLString)(this.props.url) || this._getDefaultURL());
    }
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    async componentDidUpdate(prevProps) {
        const previousUrl = (0, uri_1.toURLString)(prevProps.url);
        const currentUrl = (0, uri_1.toURLString)(this.props.url);
        const previousTimestamp = prevProps.timestamp;
        const currentTimestamp = this.props.timestamp;
        await this._init.promise;
        // Deal with URL changes.
        if (previousUrl !== currentUrl
            // XXX Refer to the implementation of loadURLObject: in
            // ios/sdk/src/JitsiMeetView.m for further information.
            || previousTimestamp !== currentTimestamp) {
            this._openURL(currentUrl || this._getDefaultURL());
        }
    }
    /**
     * Gets the default URL to be opened when this {@code App} mounts.
     *
     * @protected
     * @returns {string} The default URL to be opened when this {@code App}
     * mounts.
     */
    _getDefaultURL() {
        // @ts-ignore
        return (0, functions_1.getDefaultURL)(this.state.store);
    }
    /**
     * Navigates this {@code AbstractApp} to (i.e. Opens) a specific URL.
     *
     * @param {Object|string} url - The URL to navigate this {@code AbstractApp}
     * to (i.e. The URL to open).
     * @protected
     * @returns {void}
     */
    _openURL(url) {
        this.state.store?.dispatch((0, actions_1.appNavigate)((0, uri_1.toURLString)(url)));
    }
}
exports.AbstractApp = AbstractApp;
