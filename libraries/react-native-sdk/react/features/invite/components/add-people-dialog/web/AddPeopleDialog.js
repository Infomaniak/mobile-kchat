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
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../../analytics/functions");
const functions_2 = require("../../../../base/connection/functions");
const functions_3 = require("../../../../base/i18n/functions");
const lib_jitsi_meet_1 = require("../../../../base/lib-jitsi-meet");
const Dialog_1 = __importDefault(require("../../../../base/ui/components/web/Dialog"));
const uri_1 = require("../../../../base/util/uri");
const functions_any_1 = require("../../../../dynamic-branding/functions.any");
const functions_4 = require("../../../../recording/functions");
const actions_web_1 = require("../../../actions.web");
const functions_5 = require("../../../functions");
const CopyMeetingLinkSection_1 = __importDefault(require("./CopyMeetingLinkSection"));
const DialInLimit_1 = __importDefault(require("./DialInLimit"));
const DialInSection_1 = __importDefault(require("./DialInSection"));
const InviteByEmailSection_1 = __importDefault(require("./InviteByEmailSection"));
const InviteContactsSection_1 = __importDefault(require("./InviteContactsSection"));
const LiveStreamSection_1 = __importDefault(require("./LiveStreamSection"));
/**
 * Invite More component.
 *
 * @returns {React$Element<any>}
 */
function AddPeopleDialog({ _dialIn, _dialInVisible, _urlSharingVisible, _emailSharingVisible, _invitationText, _invitationTextiOS, _inviteAppName, _inviteContactsVisible, _inviteUrl, _isDialInOverLimit, _liveStreamViewURL, _phoneNumber, t, updateNumbers }) {
    /**
     * Updates the dial-in numbers.
     */
    (0, react_1.useEffect)(() => {
        if (!_dialIn.numbers) {
            updateNumbers();
        }
    }, []);
    /**
     * Sends analytics events when the dialog opens/closes.
     *
     * @returns {void}
     */
    (0, react_1.useEffect)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createInviteDialogEvent)('opened', 'dialog'));
        return () => {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createInviteDialogEvent)('closed', 'dialog'));
        };
    }, []);
    const inviteSubject = t('addPeople.inviteMoreMailSubject', {
        appName: _inviteAppName ?? interfaceConfig.APP_NAME
    });
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { hidden: true }, titleKey: 'addPeople.inviteMorePrompt' },
        react_1.default.createElement("div", { className: 'invite-more-dialog' },
            _inviteContactsVisible && react_1.default.createElement(InviteContactsSection_1.default, null),
            _urlSharingVisible ? react_1.default.createElement(CopyMeetingLinkSection_1.default, { url: _inviteUrl }) : null,
            _emailSharingVisible
                ? react_1.default.createElement(InviteByEmailSection_1.default, { inviteSubject: inviteSubject, inviteText: _invitationText, inviteTextiOS: _invitationTextiOS })
                : null,
            react_1.default.createElement("div", { className: 'invite-more-dialog separator' }),
            _liveStreamViewURL
                && react_1.default.createElement(LiveStreamSection_1.default, { liveStreamViewURL: _liveStreamViewURL }),
            _phoneNumber
                && _dialInVisible
                && react_1.default.createElement(DialInSection_1.default, { phoneNumber: _phoneNumber }),
            !_phoneNumber && _dialInVisible && _isDialInOverLimit && react_1.default.createElement(DialInLimit_1.default, null))));
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code AddPeopleDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state, ownProps) {
    const currentLiveStreamingSession = (0, functions_4.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM);
    const { iAmRecorder, inviteAppName } = state['features/base/config'];
    const addPeopleEnabled = (0, functions_5.isAddPeopleEnabled)(state);
    const dialOutEnabled = (0, functions_5.isDialOutEnabled)(state);
    const hideInviteContacts = iAmRecorder || (!addPeopleEnabled && !dialOutEnabled);
    const dialIn = state['features/invite']; // @ts-ignore
    const phoneNumber = dialIn?.numbers ? (0, functions_5._getDefaultPhoneNumber)(dialIn.numbers) : undefined;
    const isDialInOverLimit = dialIn?.error?.status === uri_1.StatusCode.PaymentRequired;
    return {
        _dialIn: dialIn,
        _dialInVisible: (0, functions_5.isSharingEnabled)(functions_5.sharingFeatures.dialIn),
        _urlSharingVisible: (0, functions_any_1.isDynamicBrandingDataLoaded)(state) && (0, functions_5.isSharingEnabled)(functions_5.sharingFeatures.url),
        _emailSharingVisible: (0, functions_5.isSharingEnabled)(functions_5.sharingFeatures.email),
        _invitationText: (0, functions_5.getInviteText)({ state,
            phoneNumber,
            t: ownProps.t }),
        _invitationTextiOS: (0, functions_5.getInviteTextiOS)({ state,
            phoneNumber,
            t: ownProps.t }),
        _inviteAppName: inviteAppName,
        _inviteContactsVisible: interfaceConfig.ENABLE_DIAL_OUT && !hideInviteContacts,
        _inviteUrl: (0, functions_2.getInviteURL)(state),
        _isDialInOverLimit: isDialInOverLimit,
        _liveStreamViewURL: currentLiveStreamingSession?.liveStreamViewURL,
        _phoneNumber: phoneNumber
    };
}
/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @returns {IProps}
 */
const mapDispatchToProps = {
    updateNumbers: () => (0, actions_web_1.updateDialInNumbers)()
};
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(AddPeopleDialog));
