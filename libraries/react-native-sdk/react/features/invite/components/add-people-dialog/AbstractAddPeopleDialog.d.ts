import { Component } from 'react';
import { IReduxState, IStore } from '../../../app/types';
import { IInviteSelectItem, IInvitee } from '../../types';
export interface IProps {
    /**
     * Whether or not to show Add People functionality.
     */
    _addPeopleEnabled: boolean;
    /**
     * The app id of the user.
     */
    _appId: string;
    /**
     * Whether or not call flows are enabled.
     */
    _callFlowsEnabled: boolean;
    /**
     * The URL for validating if a phone number can be called.
     */
    _dialOutAuthUrl: string;
    /**
     * Whether or not to show Dial Out functionality.
     */
    _dialOutEnabled: boolean;
    /**
     * The URL for validating if an outbound destination is allowed.
     */
    _dialOutRegionUrl: string;
    /**
     * The JWT token.
     */
    _jwt: string;
    /**
     * The query types used when searching people.
     */
    _peopleSearchQueryTypes: Array<string>;
    /**
     * The URL pointing to the service allowing for people search.
     */
    _peopleSearchUrl: string;
    /**
     * The region where we connected to.
     */
    _region: string;
    /**
     * Whether or not to allow sip invites.
     */
    _sipInviteEnabled: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
export interface IState {
    /**
     * Indicating that an error occurred when adding people to the call.
     */
    addToCallError: boolean;
    /**
     * Indicating that we're currently adding the new people to the
     * call.
     */
    addToCallInProgress: boolean;
    /**
     * The list of invite items.
     */
    inviteItems: Array<IInvitee | IInviteSelectItem>;
}
/**
 * Implements an abstract dialog to invite people to the conference.
 */
export default class AbstractAddPeopleDialog<P extends IProps, S extends IState> extends Component<P, S> {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Retrieves the notification display name for the invitee.
     *
     * @param {IInvitee} invitee - The invitee object.
     * @returns {string}
     */
    _getDisplayName(invitee: IInvitee): string;
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
    _invite(invitees: IInvitee[]): Promise<IInvitee[]>;
    /**
     * Indicates if the Add button should be disabled.
     *
     * @private
     * @returns {boolean} - True to indicate that the Add button should
     * be disabled, false otherwise.
     */
    _isAddDisabled(): boolean;
    /**
     * Performs a people and phone number search request.
     *
     * @param {string} query - The search text.
     * @private
     * @returns {Promise}
     */
    _query(query?: string): Promise<any>;
}
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
export declare function _mapStateToProps(state: IReduxState): {
    _addPeopleEnabled: boolean;
    _appId: string;
    _callFlowsEnabled: boolean;
    _dialOutAuthUrl: string;
    _dialOutRegionUrl: string;
    _dialOutEnabled: boolean;
    _jwt: string;
    _peopleSearchQueryTypes: string[];
    _peopleSearchUrl: string;
    _region: string;
    _sipInviteEnabled: boolean;
};
