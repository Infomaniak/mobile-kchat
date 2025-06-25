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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_3 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const functions_4 = require("../../../breakout-rooms/functions");
const actions_native_1 = require("../../../invite/actions.native");
const functions_5 = require("../../../share-room/functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the UI elements to be displayed in the lonely meeting experience.
 */
class LonelyMeetingExperience extends react_1.PureComponent {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onPress = this._onPress.bind(this);
    }
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _inviteOthersControl, _isInBreakoutRoom, _isInviteFunctionsDisabled, _isLonelyMeeting, t } = this.props;
        const { color, shareDialogVisible } = _inviteOthersControl;
        if (!_isLonelyMeeting) {
            return null;
        }
        return (<react_native_1.View style={styles_1.default.lonelyMeetingContainer}>
                <react_native_1.Text style={styles_1.default.lonelyMessage}>
                    {t('lonelyMeetingExperience.youAreAlone')}
                </react_native_1.Text>
                {!_isInviteFunctionsDisabled && !_isInBreakoutRoom && (<Button_1.default accessibilityLabel='lonelyMeetingExperience.button' disabled={shareDialogVisible} 
            // eslint-disable-next-line react/jsx-no-bind
            icon={() => (<Icon_1.default color={color} size={20} src={svg_1.IconAddUser}/>)} labelKey='lonelyMeetingExperience.button' onClick={this._onPress} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>)}
            </react_native_1.View>);
    }
    /**
     * Callback for the onPress function of the button.
     *
     * @returns {void}
     */
    _onPress() {
        const { _isAddPeopleFeatureEnabled, dispatch } = this.props;
        (0, functions_3.setShareDialogVisiblity)(_isAddPeopleFeatureEnabled, dispatch);
        dispatch((0, actions_native_1.doInvitePeople)());
    }
}
/**
 * Maps parts of the Redux state to the props of this Component.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { disableInviteFunctions } = state['features/base/config'];
    const { conference } = state['features/base/conference'];
    const _inviteOthersControl = (0, functions_5.getInviteOthersControl)(state);
    const flag = (0, functions_1.getFeatureFlag)(state, constants_1.INVITE_ENABLED, true);
    const _isAddPeopleFeatureEnabled = (0, functions_3.addPeopleFeatureControl)(state);
    const _isInBreakoutRoom = (0, functions_4.isInBreakoutRoom)(state);
    return {
        _isAddPeopleFeatureEnabled,
        _inviteOthersControl,
        _isInBreakoutRoom,
        _isInviteFunctionsDisabled: Boolean(!flag || disableInviteFunctions),
        _isLonelyMeeting: Boolean(conference && (0, functions_3.getParticipantCountWithFake)(state) === 1)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)((0, functions_2.translate)(LonelyMeetingExperience));
