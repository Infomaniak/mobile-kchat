"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_redux_1 = require("react-redux");
// @ts-expect-error
const constants_1 = require("../../../modules/API/constants");
const actions_1 = require("../app/actions");
const actions_any_1 = require("../app/actions.any");
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const utils_1 = require("../base/connection/utils");
const actions_2 = require("../base/dialog/actions");
const functions_2 = require("../base/dialog/functions");
const dateUtil_1 = require("../base/i18n/dateUtil");
const functions_3 = require("../base/i18n/functions");
const i18next_2 = __importDefault(require("../base/i18n/i18next"));
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actions_3 = require("../base/participants/actions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actionTypes_2 = require("../base/responsive-ui/actionTypes");
const constants_any_1 = require("../base/ui/constants.any");
const iframeUtils_1 = require("../base/util/iframeUtils");
const functions_4 = require("../calendar-sync/functions");
const FeedbackDialog_1 = __importDefault(require("../feedback/components/FeedbackDialog"));
const actions_any_2 = require("../filmstrip/actions.any");
const functions_5 = require("../jaas/functions");
const actions_4 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actions_5 = require("../recording/actions");
const actions_6 = require("../salesforce/actions");
const actions_any_3 = require("../toolbox/actions.any");
const actionTypes_3 = require("./actionTypes");
const actions_7 = require("./actions");
const constants_3 = require("./constants");
let intervalID;
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            _conferenceJoined(store);
            break;
        }
        case actionTypes_2.SET_REDUCED_UI: {
            _setReducedUI(store);
            break;
        }
        case actionTypes_3.DISMISS_CALENDAR_NOTIFICATION:
        case actionTypes_1.CONFERENCE_LEFT:
        case actionTypes_1.CONFERENCE_FAILED: {
            clearInterval(intervalID);
            intervalID = null;
            break;
        }
    }
    return result;
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, close all dialogs and unpin any pinned participants.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch, getState }, prevConference) => {
    const { authRequired, membersOnly, passwordRequired } = getState()['features/base/conference'];
    if (conference !== prevConference) {
        // Unpin participant, in order to avoid the local participant
        // remaining pinned, since it's not destroyed across runs.
        dispatch((0, actions_3.pinParticipant)(null));
        // Clear raised hands.
        dispatch((0, actions_3.raiseHandClear)());
        // XXX I wonder if there is a better way to do this. At this stage
        // we do know what dialogs we want to keep but the list of those
        // we want to hide is a lot longer. Thus we take a bit of a shortcut
        // and explicitly check.
        if (typeof authRequired === 'undefined'
            && typeof passwordRequired === 'undefined'
            && typeof membersOnly === 'undefined'
            && !(0, functions_2.isDialogOpen)(getState(), FeedbackDialog_1.default)) {
            // Conference changed, left or failed... and there is no
            // pending authentication, nor feedback request, so close any
            // dialog we might have open.
            dispatch((0, actions_2.hideDialog)());
        }
    }
});
/**
 * Configures the UI. In reduced UI mode some components will
 * be hidden if there is no space to render them.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _setReducedUI({ dispatch, getState }) {
    const { reducedUI } = getState()['features/base/responsive-ui'];
    dispatch((0, actions_any_3.setToolboxEnabled)(!reducedUI));
    dispatch((0, actions_any_2.setFilmstripEnabled)(!reducedUI));
}
/**
 * Does extra sync up on properties that may need to be updated after the
 * conference was joined.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _conferenceJoined({ dispatch, getState }) {
    _setReducedUI({
        dispatch,
        getState
    });
    if (!intervalID) {
        intervalID = setInterval(() => _maybeDisplayCalendarNotification({
            dispatch,
            getState
        }), 10 * 1000);
    }
    dispatch((0, actions_6.showSalesforceNotification)());
    dispatch((0, actions_5.showStartRecordingNotification)());
    _checkIframe(getState(), dispatch);
}
/**
 * Additional checks for embedding in iframe.
 *
 * @param {IReduxState} state - The current state of the app.
 * @param {Function} dispatch - The Redux dispatch function.
 * @private
 * @returns {void}
 */
function _checkIframe(state, dispatch) {
    let allowIframe = false;
    if (document.referrer === '' && lib_jitsi_meet_1.browser.isElectron()) {
        // no iframe
        allowIframe = true;
    }
    else {
        try {
            allowIframe = constants_3.IFRAME_EMBED_ALLOWED_LOCATIONS.includes(new URL(document.referrer).hostname);
        }
        catch (e) {
            // wrong URL in referrer
        }
    }
    if ((0, iframeUtils_1.inIframe)() && state['features/base/config'].disableIframeAPI && !lib_jitsi_meet_1.browser.isElectron()
        && !(0, functions_5.isVpaasMeeting)(state) && !allowIframe) {
        // show sticky notification and redirect in 5 minutes
        const { locationURL } = state['features/base/connection'];
        let translationKey = 'notify.disabledIframe';
        const hostname = locationURL?.hostname ?? '';
        let domain = '';
        const mapping = {
            '8x8.vc': 'https://jaas.8x8.vc',
            'meet.jit.si': 'https://jitsi.org/jaas'
        };
        const jaasDomain = mapping[hostname];
        if (jaasDomain) {
            translationKey = 'notify.disabledIframeSecondary';
            domain = hostname;
        }
        dispatch((0, actions_4.showWarningNotification)({
            description: (0, functions_3.translateToHTML)(i18next_2.default.t.bind(i18next_2.default), translationKey, {
                domain,
                jaasDomain,
                timeout: constants_3.IFRAME_DISABLED_TIMEOUT_MINUTES
            })
        }, constants_2.NOTIFICATION_TIMEOUT_TYPE.STICKY));
        setTimeout(() => {
            // redirect to the promotional page
            dispatch((0, actions_any_1.redirectToStaticPage)('static/close3.html', `#jitsi_meet_external_api_id=${constants_1.API_ID}`));
        }, constants_3.IFRAME_DISABLED_TIMEOUT_MINUTES * 60 * 1000);
    }
}
/**
 * Periodically checks if there is an event in the calendar for which we
 * need to show a notification.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _maybeDisplayCalendarNotification({ dispatch, getState }) {
    const state = getState();
    const calendarEnabled = (0, functions_4.isCalendarEnabled)(state);
    const { events: eventList } = state['features/calendar-sync'];
    const { locationURL } = state['features/base/connection'];
    const { reducedUI } = state['features/base/responsive-ui'];
    const currentConferenceURL = locationURL ? (0, utils_1.getURLWithoutParamsNormalized)(locationURL) : '';
    const ALERT_MILLISECONDS = 5 * 60 * 1000;
    const now = Date.now();
    let eventToShow;
    if (!calendarEnabled && reducedUI) {
        return;
    }
    if (eventList?.length) {
        for (const event of eventList) {
            const eventURL = event?.url && (0, utils_1.getURLWithoutParamsNormalized)(new URL(event.url));
            if (eventURL && eventURL !== currentConferenceURL) {
                // @ts-ignore
                if ((!eventToShow && event.startDate > now && event.startDate < now + ALERT_MILLISECONDS)
                    // @ts-ignore
                    || (event.startDate < now && event.endDate > now)) {
                    eventToShow = event;
                }
            }
        }
    }
    _calendarNotification({
        dispatch,
        getState
    }, eventToShow);
}
/**
 * Calendar notification.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {eventToShow} eventToShow - Next or ongoing event.
 * @private
 * @returns {void}
 */
function _calendarNotification({ dispatch, getState }, eventToShow) {
    const state = getState();
    const { locationURL } = state['features/base/connection'];
    const currentConferenceURL = locationURL ? (0, utils_1.getURLWithoutParamsNormalized)(locationURL) : '';
    const now = Date.now();
    if (!eventToShow) {
        return;
    }
    const customActionNameKey = ['notify.joinMeeting', 'notify.dontRemindMe'];
    const customActionType = [constants_any_1.BUTTON_TYPES.PRIMARY, constants_any_1.BUTTON_TYPES.DESTRUCTIVE];
    const customActionHandler = [() => (0, react_redux_1.batch)(() => {
            dispatch((0, actions_4.hideNotification)(constants_2.CALENDAR_NOTIFICATION_ID));
            if (eventToShow?.url && (eventToShow.url !== currentConferenceURL)) {
                dispatch((0, actions_1.appNavigate)(eventToShow.url));
            }
        }), () => dispatch((0, actions_7.dismissCalendarNotification)())];
    const description = (0, dateUtil_1.getLocalizedDateFormatter)(eventToShow.startDate).fromNow();
    const icon = constants_2.NOTIFICATION_ICON.WARNING;
    const title = (eventToShow.startDate < now) && (eventToShow.endDate > now)
        ? `${i18next_1.default.t('calendarSync.ongoingMeeting')}: \n${eventToShow.title}`
        : `${i18next_1.default.t('calendarSync.nextMeeting')}: \n${eventToShow.title}`;
    const uid = constants_2.CALENDAR_NOTIFICATION_ID;
    dispatch((0, actions_4.showNotification)({
        customActionHandler,
        customActionNameKey,
        customActionType,
        description,
        icon,
        maxLines: 1,
        title,
        uid
    }, constants_2.NOTIFICATION_TIMEOUT_TYPE.STICKY));
}
