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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/dialog/functions");
const functions_2 = require("../../../../base/i18n/functions");
const constants_1 = require("../constants");
const styles_1 = __importStar(require("./styles"));
/**
 * Class to implement a stream key picker (dropdown) component to allow the user
 * to choose from the available Google Broadcasts/Streams.
 *
 * NOTE: This component is currently only used on mobile, but it is advised at
 * a later point to unify mobile and web logic for this functionality. But it's
 * out of the scope for now of the mobile live streaming functionality.
 */
class StreamKeyPicker extends react_1.Component {
    /**
     * Instantiates a new instance of StreamKeyPicker.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            streamKey: null
        };
        this._onOpenYoutubeDashboard = this._onOpenYoutubeDashboard.bind(this);
        this._onStreamPick = this._onStreamPick.bind(this);
    }
    /**
     * Renders the component.
     *
     * @inheritdoc
     */
    render() {
        const { _dialogStyles, broadcasts } = this.props;
        if (!broadcasts) {
            return null;
        }
        if (!broadcasts.length) {
            return (<react_native_1.View style={styles_1.default.formWrapper}>
                    <react_native_1.TouchableOpacity onPress={this._onOpenYoutubeDashboard}>
                        <react_native_1.Text style={[
                    _dialogStyles.text,
                    styles_1.default.warningText
                ]}>
                            {this.props.t('liveStreaming.getStreamKeyManually')}
                        </react_native_1.Text>
                    </react_native_1.TouchableOpacity>
                </react_native_1.View>);
        }
        return (<react_native_1.View style={styles_1.default.formWrapper}>
                <react_native_1.View style={styles_1.default.streamKeyPickerCta}>
                    <react_native_1.Text style={[
                _dialogStyles.text,
                styles_1.default.text
            ]}>
                        {this.props.t('liveStreaming.choose')}
                    </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles_1.default.streamKeyPickerWrapper}>
                    {broadcasts.map((broadcast, index) => (<react_native_1.TouchableHighlight activeOpacity={styles_1.ACTIVE_OPACITY} key={index} onPress={this._onStreamPick(broadcast.key)} style={[
                    styles_1.default.streamKeyPickerItem,
                    this.state.streamKey === broadcast.key
                        ? styles_1.default.streamKeyPickerItemHighlight : null
                ]} underlayColor={styles_1.TOUCHABLE_UNDERLAY}>
                            <react_native_1.Text style={[
                    _dialogStyles.text,
                    styles_1.default.text
                ]}>
                                {broadcast.title}
                            </react_native_1.Text>
                        </react_native_1.TouchableHighlight>))}
                </react_native_1.View>
            </react_native_1.View>);
    }
    /**
     * Opens the link which should display the YouTube broadcast live stream
     * key.
     *
     * @private
     * @returns {void}
     */
    _onOpenYoutubeDashboard() {
        react_native_1.Linking.openURL(constants_1.YOUTUBE_LIVE_DASHBOARD_URL);
    }
    /**
     * Callback to be invoked when the user picks a stream from the list.
     *
     * @private
     * @param {string} streamKey - The key of the stream selected.
     * @returns {Function}
     */
    _onStreamPick(streamKey) {
        return () => {
            this.setState({
                streamKey
            });
            this.props.onChange(streamKey);
        };
    }
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(functions_1._abstractMapStateToProps)(StreamKeyPicker));
