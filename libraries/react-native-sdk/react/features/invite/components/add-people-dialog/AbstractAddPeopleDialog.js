"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_any_1 = require("../../../base/config/functions.any");
const actions_1 = require("../../../notifications/actions");
const constants_1 = require("../../../notifications/constants");
const actions_any_1 = require("../../actions.any");
const constants_2 = require("../../constants");
const functions_2 = require("../../functions");
const logger_1 = __importDefault(require("../../logger"));
/**
 * Implements an abstract dialog to invite people to the conference.
 */
class AbstractAddPeopleDialog extends react_1.Component {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._query = this._query.bind(this);
    }
    /**
     * Retrieves the notification display name for the invitee.
     *
     * @param {IInvitee} invitee - The invitee object.
     * @returns {string}
     */
    _getDisplayName(invitee) {
        if (invitee.type === constants_2.INVITE_TYPES.PHONE) {
            return invitee.number;
        }
        if (invitee.type === constants_2.INVITE_TYPES.SIP) {
            return invitee.address;
        }
        return invitee.name ?? '';
    }
    /**
     * Invite people and numbers to the conference. The logic works by inviting
     * numbers, people/rooms, sip endpoints and videosipgw in parallel. All invitees are
     * stored in an array. As each invite succeeds, the invitee is removed
     * from the array. After all invites finish, close the modal if there are
     * no invites left to send. If any are left, that means an invite failed
     * and an error state should display.
     *
     * @param {Array<IInvitee>} invitees - The items to be invited.
     * @returns {Promise<Array<any>>}
     */
    _invite(invitees) {
        const inviteTypeCounts = (0, functions_2.getInviteTypeCounts)(invitees);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createInviteDialogEvent)('clicked', 'inviteButton', {
            ...inviteTypeCounts,
            inviteAllowed: this._isAddDisabled()
        }));
        if (this._isAddDisabled()) {
            return Promise.resolve([]);
        }
        this.setState({
            addToCallInProgress: true
        });
        const { _callFlowsEnabled, dispatch } = this.props;
        return dispatch((0, actions_any_1.invite)(invitees))
            .then((invitesLeftToSend) => {
            this.setState({
                addToCallInProgress: false
            });
            // If any invites are left that means something failed to send
            // so treat it as an error.
            if (invitesLeftToSend.length) {
                const erroredInviteTypeCounts = (0, functions_2.getInviteTypeCounts)(invitesLeftToSend);
                logger_1.default.error(`${invitesLeftToSend.length} invites failed`, erroredInviteTypeCounts);
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createInviteDialogEvent)('error', 'invite', {
                    ...erroredInviteTypeCounts
                }));
                dispatch((0, actions_1.showErrorNotification)({
                    titleKey: 'addPeople.failedToAdd'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            }
            else if (!_callFlowsEnabled) {
                const invitedCount = invitees.length;
                let notificationProps;
                if (invitedCount >= 3) {
                    notificationProps = {
                        titleArguments: {
                            name: this._getDisplayName(invitees[0]),
                            count: `${invitedCount - 1}`
                        },
                        titleKey: 'notify.invitedThreePlusMembers'
                    };
                }
                else if (invitedCount === 2) {
                    notificationProps = {
                        titleArguments: {
                            first: this._getDisplayName(invitees[0]),
                            second: this._getDisplayName(invitees[1])
                        },
                        titleKey: 'notify.invitedTwoMembers'
                    };
                }
                else if (invitedCount) {
                    notificationProps = {
                        titleArguments: {
                            name: this._getDisplayName(invitees[0])
                        },
                        titleKey: 'notify.invitedOneMember'
                    };
                }
                if (notificationProps) {
                    dispatch((0, actions_1.showNotification)(notificationProps, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
                }
            }
            return invitesLeftToSend;
        });
    }
    /**
     * Indicates if the Add button should be disabled.
     *
     * @private
     * @returns {boolean} - True to indicate that the Add button should
     * be disabled, false otherwise.
     */
    _isAddDisabled() {
        return !this.state.inviteItems.length
            || this.state.addToCallInProgress;
    }
    /**
     * Performs a people and phone number search request.
     *
     * @param {string} query - The search text.
     * @private
     * @returns {Promise}
     */
    _query(query = '') {
        const { _addPeopleEnabled: addPeopleEnabled, _appId: appId, _dialOutAuthUrl: dialOutAuthUrl, _dialOutRegionUrl: dialOutRegionUrl, _dialOutEnabled: dialOutEnabled, _jwt: jwt, _peopleSearchQueryTypes: peopleSearchQueryTypes, _peopleSearchUrl: peopleSearchUrl, _region: region, _sipInviteEnabled: sipInviteEnabled } = this.props;
        const options = {
            addPeopleEnabled,
            appId,
            dialOutAuthUrl,
            dialOutEnabled,
            dialOutRegionUrl,
            jwt,
            peopleSearchQueryTypes,
            peopleSearchUrl,
            region,
            sipInviteEnabled
        };
        return (0, functions_2.getInviteResultsForQuery)(query, options);
    }
}
exports.default = AbstractAddPeopleDialog;
/**
 * Maps (parts of) the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _addPeopleEnabled: boolean,
 *     _dialOutAuthUrl: string,
 *     _dialOutEnabled: boolean,
 *     _jwt: string,
 *     _peopleSearchQueryTypes: Array<string>,
 *     _peopleSearchUrl: string
 * }}
 */
function _mapStateToProps(state) {
    const { callFlowsEnabled, dialOutAuthUrl, dialOutRegionUrl, peopleSearchQueryTypes, peopleSearchUrl } = state['features/base/config'];
    return {
        _addPeopleEnabled: (0, functions_2.isAddPeopleEnabled)(state),
        _appId: state['features/base/jwt']?.tenant ?? '',
        _callFlowsEnabled: callFlowsEnabled ?? false,
        _dialOutAuthUrl: dialOutAuthUrl ?? '',
        _dialOutRegionUrl: dialOutRegionUrl ?? '',
        _dialOutEnabled: (0, functions_2.isDialOutEnabled)(state),
        _jwt: state['features/base/jwt'].jwt ?? '',
        _peopleSearchQueryTypes: peopleSearchQueryTypes ?? [],
        _peopleSearchUrl: peopleSearchUrl ?? '',
        _region: (0, functions_any_1.getMeetingRegion)(state),
        _sipInviteEnabled: (0, functions_2.isSipInviteEnabled)(state)
    };
}
exports._mapStateToProps = _mapStateToProps;
