"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const js_utils_1 = require("@jitsi/js-utils");
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const i18next_1 = __importDefault(require("../../i18n/i18next"));
const MiddlewareRegistry_1 = __importDefault(require("../../redux/MiddlewareRegistry"));
const PersistenceRegistry_1 = __importDefault(require("../../redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../../redux/ReducerRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../../redux/StateListenerRegistry"));
const SoundCollection_1 = __importDefault(require("../../sounds/components/SoundCollection"));
const helpers_1 = require("../../util/helpers");
const actions_1 = require("../actions");
const logger_1 = __importDefault(require("../logger"));
/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
class BaseApp extends react_1.Component {
    /**
     * Initializes a new {@code BaseApp} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            route: {},
            store: undefined
        };
    }
    /**
     * Initializes the app.
     *
     * @inheritdoc
    */
    async componentDidMount() {
        /**
         * Make the mobile {@code BaseApp} wait until the {@code AsyncStorage}
         * implementation of {@code Storage} initializes fully.
         *
         * @private
         * @see {@link #_initStorage}
         * @type {Promise}
         */
        this._init = (0, helpers_1.createDeferred)();
        try {
            await this._initStorage();
            const setStatePromise = new Promise(resolve => {
                this.setState({
                    // @ts-ignore
                    store: this._createStore()
                }, resolve);
            });
            await setStatePromise;
            await this._extraInit();
        }
        catch (err) {
            /* BaseApp should always initialize! */
            logger_1.default.error(err);
        }
        this.state.store?.dispatch((0, actions_1.appWillMount)(this));
        // @ts-ignore
        this._init.resolve();
    }
    /**
     * De-initializes the app.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this.state.store?.dispatch((0, actions_1.appWillUnmount)(this));
    }
    /**
     * Logs for errors that were not caught.
     *
     * @param {Error} error - The error that was thrown.
     * @param {Object} info - Info about the error(stack trace);.
     *
     * @returns {void}
     */
    componentDidCatch(error, info) {
        logger_1.default.error(error, info);
    }
    /**
     * Delays this {@code BaseApp}'s startup until the {@code Storage}
     * implementation of {@code localStorage} initializes. While the
     * initialization is instantaneous on Web (with Web Storage API), it is
     * asynchronous on mobile/react-native.
     *
     * @private
     * @returns {Promise}
     */
    _initStorage() {
        const _initializing = js_utils_1.jitsiLocalStorage.getItem('_initializing');
        return _initializing || Promise.resolve();
    }
    /**
     * Extra initialisation that subclasses might require.
     *
     * @returns {void}
     */
    _extraInit() {
        // To be implemented by subclass.
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { route: { component, props }, store } = this.state;
        if (store) {
            return (react_1.default.createElement(react_i18next_1.I18nextProvider, { i18n: i18next_1.default },
                react_1.default.createElement(react_redux_1.Provider, { store: store },
                    react_1.default.createElement(react_1.Fragment, null,
                        this._createMainElement(component, props),
                        react_1.default.createElement(SoundCollection_1.default, null),
                        this._createExtraElement(),
                        this._renderDialogContainer()))));
        }
        return null;
    }
    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @returns {ReactElement}
     * @abstract
     * @protected
     */
    _createExtraElement() {
        return null;
    }
    /**
     * Creates a {@link ReactElement} from the specified component, the
     * specified props and the props of this {@code AbstractApp} which are
     * suitable for propagation to the children of this {@code Component}.
     *
     * @param {Component} component - The component from which the
     * {@code ReactElement} is to be created.
     * @param {Object} props - The read-only React {@code Component} props with
     * which the {@code ReactElement} is to be initialized.
     * @returns {ReactElement}
     * @protected
     */
    _createMainElement(component, props) {
        return component ? react_1.default.createElement(component, props || {}) : null;
    }
    /**
     * Initializes a new redux store instance suitable for use by this
     * {@code AbstractApp}.
     *
     * @private
     * @returns {Store} - A new redux store instance suitable for use by
     * this {@code AbstractApp}.
     */
    _createStore() {
        // Create combined reducer from all reducers in ReducerRegistry.
        const reducer = ReducerRegistry_1.default.combineReducers();
        // Apply all registered middleware from the MiddlewareRegistry and
        // additional 3rd party middleware:
        // - Thunk - allows us to dispatch async actions easily. For more info
        // @see https://github.com/gaearon/redux-thunk.
        const middleware = MiddlewareRegistry_1.default.applyMiddleware(redux_thunk_1.default);
        // @ts-ignore
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
        const store = (0, redux_1.createStore)(reducer, PersistenceRegistry_1.default.getPersistedState(), composeEnhancers(middleware));
        // StateListenerRegistry
        StateListenerRegistry_1.default.subscribe(store);
        // This is temporary workaround to be able to dispatch actions from
        // non-reactified parts of the code (conference.js for example).
        // Don't use in the react code!!!
        // FIXME: remove when the reactification is finished!
        if (typeof APP !== 'undefined') {
            // @ts-ignore
            APP.store = store;
        }
        return store;
    }
    /**
     * Navigates to a specific Route.
     *
     * @param {Route} route - The Route to which to navigate.
     * @returns {Promise}
     */
    _navigate(route) {
        if (lodash_1.default.isEqual(route, this.state.route)) {
            return Promise.resolve();
        }
        if (route.href) {
            // This navigation requires loading a new URL in the browser.
            window.location.href = route.href;
            return Promise.resolve();
        }
        // XXX React's setState is asynchronous which means that the value of
        // this.state.route above may not even be correct. If the check is
        // performed before setState completes, the app may not navigate to the
        // expected route. In order to mitigate the problem, _navigate was
        // changed to return a Promise.
        return new Promise(resolve => {
            this.setState({ route }, resolve);
        });
    }
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return null;
    }
}
exports.default = BaseApp;
