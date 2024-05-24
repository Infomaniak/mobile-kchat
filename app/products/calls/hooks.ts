// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Check if calls is enabled. If it is, then run fn; if it isn't, show an alert and set
// msgPostfix to ' (Not Available)'.
import {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Alert, Platform} from 'react-native';
import Permissions from 'react-native-permissions';

import {Screens} from '@app/constants';
import {initializeVoiceTrack} from '@calls/actions/calls';
import {
    setMicPermissionsGranted,
    useCallsState,
    useChannelsWithCalls,
    useCurrentCall,
    useGlobalCallsState,
    useIncomingCalls,
} from '@calls/state';
import {errorAlert} from '@calls/utils';
import {
    CALL_ERROR_BAR_HEIGHT,
    CALL_NOTIFICATION_BAR_HEIGHT,
    CURRENT_CALL_BAR_HEIGHT,
    JOIN_CALL_BAR_HEIGHT,
} from '@constants/view';
import {useServerUrl} from '@context/server';
import {useAppState} from '@hooks/device';
import NetworkManager from '@managers/network_manager';
import {queryAllActiveServers} from '@queries/app/servers';
import {allOrientations, dismissAllModalsAndPopToScreen} from '@screens/navigation';
import CallManager from '@store/CallManager';
import {getFullErrorMessage} from '@utils/errors';

import type {CallPassedProps} from '@calls/screens/call_screen/call_screen';
import type {Client} from '@client/rest';
import type {Options} from 'react-native-navigation';

export const useTryCallsFunction = (fn: () => void) => {
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const [msgPostfix, setMsgPostfix] = useState('');
    const [clientError, setClientError] = useState('');

    let client: Client | undefined;
    if (!clientError) {
        try {
            client = NetworkManager.getClient(serverUrl);
        } catch (error) {
            setClientError(getFullErrorMessage(error));
        }
    }
    const tryFn = useCallback(async () => {
        let enabled;
        try {
            enabled = await client?.getEnabled();
        } catch (error) {
            errorAlert(getFullErrorMessage(error), intl);
            return;
        }

        if (enabled) {
            setMsgPostfix('');
            fn();
            return;
        }

        if (clientError) {
            errorAlert(clientError, intl);
            return;
        }

        const title = intl.formatMessage({
            id: 'mobile.calls_not_available_title',
            defaultMessage: 'Calls is not enabled',
        });
        const message = intl.formatMessage({
            id: 'mobile.calls_not_available_msg',
            defaultMessage: 'Please contact your System Admin to enable the feature.',
        });
        const ok = intl.formatMessage({
            id: 'mobile.calls_ok',
            defaultMessage: 'OK',
        });
        const notAvailable = intl.formatMessage({
            id: 'mobile.calls_not_available_option',
            defaultMessage: '(Not available)',
        });

        Alert.alert(
            title,
            message,
            [
                {
                    text: ok,
                    style: 'cancel',
                },
            ],
        );
        setMsgPostfix(` ${notAvailable}`);
    }, [client, fn, clientError, intl]);

    return [tryFn, msgPostfix] as [() => Promise<void>, string];
};

const micPermission = Platform.select({
    ios: Permissions.PERMISSIONS.IOS.MICROPHONE,
    default: Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
});

export const usePermissionsChecker = (micPermissionsGranted: boolean) => {
    const appState = useAppState();

    useEffect(() => {
        const asyncFn = async () => {
            if (appState === 'active') {
                const hasPermission = (await Permissions.check(micPermission)) === Permissions.RESULTS.GRANTED;
                if (hasPermission) {
                    initializeVoiceTrack();
                    setMicPermissionsGranted(hasPermission);
                }
            }
        };
        if (!micPermissionsGranted) {
            asyncFn();
        }
    }, [appState]);
};

export const useCallsAdjustment = (serverUrl: string, channelId: string): number => {
    const incomingCalls = useIncomingCalls().incomingCalls;
    const channelsWithCalls = useChannelsWithCalls(serverUrl);
    const callsState = useCallsState(serverUrl);
    const globalCallsState = useGlobalCallsState();
    const currentCall = useCurrentCall();
    const [numServers, setNumServers] = useState(1);
    const dismissed = Boolean(callsState.calls[channelId]?.dismissed[callsState.myUserId]);
    const inCurrentCall = currentCall?.id === channelId;
    const joinCallBannerVisible = Boolean(channelsWithCalls[channelId]) && !dismissed && !inCurrentCall;

    useEffect(() => {
        const getNumServers = async () => {
            const query = await queryAllActiveServers()?.fetch();
            setNumServers(query?.length || 0);
        };
        getNumServers();
    }, []);

    // Do we have calls banners?
    const currentCallBarVisible = Boolean(currentCall);
    const micPermissionsError = !globalCallsState.micPermissionsGranted && (currentCall && !currentCall.micPermissionsErrorDismissed);
    const callQualityAlert = Boolean(currentCall?.callQualityAlert);
    const incomingCallsShowing = incomingCalls.filter((ic) => ic.channelID !== channelId);
    const notificationBarHeight = CALL_NOTIFICATION_BAR_HEIGHT + (numServers > 1 ? 8 : 0);
    const callsIncomingAdjustment = (incomingCallsShowing.length * notificationBarHeight) + (incomingCallsShowing.length * 8);
    return (currentCallBarVisible ? CURRENT_CALL_BAR_HEIGHT + 8 : 0) +
        (micPermissionsError ? CALL_ERROR_BAR_HEIGHT + 8 : 0) +
        (callQualityAlert ? CALL_ERROR_BAR_HEIGHT + 8 : 0) +
        (joinCallBannerVisible ? JOIN_CALL_BAR_HEIGHT + 8 : 0) +
        callsIncomingAdjustment;
};

/**
 * Create an "onCall" callback that joins a kMeet and pop the call screen
 */
export const useOnCall = () => {
    const serverUrl = useServerUrl();
    const intl = useIntl();
    const {formatMessage} = intl;

    /**
     * Triggers a "Join/Start call" on a kMeet
     *  -> Answer/Start the kMeet
     *  -> Pop the CALL screen
     *
     * If the conferenceId is know it should
     * be passed as an arg to trigger a "Join call" instead of a "Start call"
     */
    const onCall = useCallback(async (channelId: string, conferenceId?: string) => {
        // Answer the call via API
        const call = typeof conferenceId === 'string' ? await CallManager.answerCall(serverUrl, conferenceId, channelId) : await CallManager.startCall(serverUrl, channelId);

        if (call !== null) {
            // Pop the CALL screen
            const title = formatMessage({id: 'mobile.calls_call_screen', defaultMessage: 'Call'});
            const passedProps: CallPassedProps = {
                serverUrl: call.server_url,
                channelId: call.channel_id,
                conferenceId,
            };
            const options: Options = {
                layout: {
                    backgroundColor: '#000',
                    componentBackgroundColor: '#000',
                    orientation: allOrientations,
                },
                topBar: {
                    background: {color: '#000'},
                    visible: Platform.OS === 'android',
                },
            };
            await dismissAllModalsAndPopToScreen(Screens.CALL, title, passedProps, options);
        }
    }, [formatMessage, serverUrl]);

    return onCall;
};
