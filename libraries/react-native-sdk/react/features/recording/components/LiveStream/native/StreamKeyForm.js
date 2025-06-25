"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/dialog/functions");
const functions_2 = require("../../../../base/i18n/functions");
const Button_1 = __importDefault(require("../../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../../base/ui/constants.native");
const AbstractStreamKeyForm_1 = __importDefault(require("../AbstractStreamKeyForm"));
const functions_3 = require("../functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * A React Component for entering a key for starting a YouTube live stream.
 *
 * @augments Component
 */
class StreamKeyForm extends AbstractStreamKeyForm_1.default {
    /**
     * Initializes a new {@code StreamKeyForm} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code StreamKeyForm} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onOpenGooglePrivacyPolicy = this._onOpenGooglePrivacyPolicy.bind(this);
        this._onOpenHelp = this._onOpenHelp.bind(this);
        this._onOpenYoutubeTerms = this._onOpenYoutubeTerms.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _dialogStyles, t } = this.props;
        return (<>
                <react_native_1.View style={styles_1.default.formWrapper}>
                    <Input_1.default customStyles={{
                input: styles_1.default.streamKeyInput,
                container: styles_1.default.streamKeyContainer
            }} onChange={this._onInputChange} placeholder={t('liveStreaming.enterStreamKey')} value={this.props.value}/>
                    <react_native_1.View style={styles_1.default.formValidationItem}>
                        {this.state.showValidationError && <react_native_1.Text style={[
                    _dialogStyles.text,
                    styles_1.default.warningText
                ]}>
                                {t('liveStreaming.invalidStreamKey')}
                            </react_native_1.Text>}
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={styles_1.default.formButtonsWrapper}>
                    <Button_1.default accessibilityLabel='liveStreaming.streamIdHelp' labelKey='liveStreaming.streamIdHelp' labelStyle={styles_1.default.buttonLabelStyle} onClick={this._onOpenHelp} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    <Button_1.default accessibilityLabel='liveStreaming.youtubeTerms' labelKey='liveStreaming.youtubeTerms' labelStyle={styles_1.default.buttonLabelStyle} onClick={this._onOpenYoutubeTerms} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    <Button_1.default accessibilityLabel='liveStreaming.googlePrivacyPolicy' labelKey='liveStreaming.googlePrivacyPolicy' labelStyle={styles_1.default.buttonLabelStyle} onClick={this._onOpenGooglePrivacyPolicy} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                </react_native_1.View>
            </>);
    }
    /**
     * Opens the Google Privacy Policy web page.
     *
     * @private
     * @returns {void}
     */
    _onOpenGooglePrivacyPolicy() {
        const url = this.props._liveStreaming.dataPrivacyURL;
        if (typeof url === 'string') {
            react_native_1.Linking.openURL(url);
        }
    }
    /**
     * Opens the information link on how to manually locate a YouTube broadcast
     * stream key.
     *
     * @private
     * @returns {void}
     */
    _onOpenHelp() {
        const url = this.props._liveStreaming.helpURL;
        if (typeof url === 'string') {
            react_native_1.Linking.openURL(url);
        }
    }
    /**
     * Opens the YouTube terms and conditions web page.
     *
     * @private
     * @returns {void}
     */
    _onOpenYoutubeTerms() {
        const url = this.props._liveStreaming.termsURL;
        if (typeof url === 'string') {
            react_native_1.Linking.openURL(url);
        }
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code StreamKeyForm} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *    _liveStreaming: LiveStreamingProps
 * }}
 */
function _mapStateToProps(state) {
    return {
        ...(0, functions_1._abstractMapStateToProps)(state),
        _liveStreaming: (0, functions_3.getLiveStreaming)(state)
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(StreamKeyForm));
