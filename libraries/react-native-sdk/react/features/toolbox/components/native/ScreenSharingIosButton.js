"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_webrtc_1 = require("react-native-webrtc");
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_native_1 = require("../../../base/tracks/functions.native");
const styles = {
    screenCapturePickerView: {
        display: 'none'
    }
};
/**
 * An implementation of a button for toggling screen sharing on iOS.
 */
class ScreenSharingIosButton extends AbstractButton_1.default {
    /**
   * Initializes a new {@code ScreenSharingIosButton} instance.
   *
   * @param {Object} props - The React {@code Component} props to initialize
   * the new {@code ScreenSharingIosButton} instance with.
   */
    constructor(props) {
        super(props);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.shareYourScreen';
        this.icon = svg_1.IconScreenshare;
        this.label = 'toolbar.startScreenSharing';
        this.toggledLabel = 'toolbar.stopScreenSharing';
        this._nativeComponent = null;
        // Bind event handlers so they are only bound once per instance.
        this._setNativeComponent = this._setNativeComponent.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render() {
        return (<>
                {super.render()}
                <react_native_webrtc_1.ScreenCapturePickerView ref={this._setNativeComponent} // @ts-ignore
         style={styles.screenCapturePickerView}/>
            </>);
    }
    /**
    * Sets the internal reference to the React Component wrapping the
    * {@code RPSystemBroadcastPickerView} component.
    *
    * @param {ReactComponent} component - React Component.
    * @returns {void}
    */
    _setNativeComponent(component) {
        this._nativeComponent = component;
    }
    /**
   * Handles clicking / pressing the button.
   *
   * @override
   * @protected
   * @returns {void}
   */
    _handleClick() {
        const handle = (0, react_native_1.findNodeHandle)(this._nativeComponent);
        react_native_1.NativeModules.ScreenCapturePickerViewManager.show(handle);
    }
    /**
   * Returns a boolean value indicating if this button is disabled or not.
   *
   * @protected
   * @returns {boolean}
   */
    _isDisabled() {
        return this.props._disabled;
    }
    /**
   * Indicates whether this button is in toggled state or not.
   *
   * @override
   * @protected
   * @returns {boolean}
   */
    _isToggled() {
        return this.props._screensharing;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ScreenSharingIosButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 * }}
 */
function _mapStateToProps(state) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.IOS_SCREENSHARING_ENABLED, false);
    return {
        _screensharing: (0, functions_native_1.isLocalVideoTrackDesktop)(state),
        // TODO: this should work on iOS 12 too, but our trick to show the picker doesn't work.
        visible: enabled
            && react_native_1.Platform.OS === 'ios'
            && Number.parseInt(react_native_1.Platform.Version.split('.')[0], 10) >= 14
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(ScreenSharingIosButton));
