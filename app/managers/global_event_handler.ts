// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import RNUtils, {type SplitViewResult} from '@mattermost/rnutils';
import {Alert, DeviceEventEmitter, Linking, NativeEventEmitter, NativeModules, Platform} from 'react-native';
import semver from 'semver';

import {switchToChannelById} from '@actions/remote/channel';
import {switchToConferenceByChannelId} from '@actions/remote/conference';
import {Device, Events, Sso} from '@constants';
import {MIN_REQUIRED_VERSION} from '@constants/supported_server';
import DatabaseManager from '@database/manager';
import {DEFAULT_LOCALE, getTranslations, t} from '@i18n';
import {getServerCredentials} from '@init/credentials';
import {getActiveServerUrl} from '@queries/app/servers';
import {queryTeamDefaultChannel} from '@queries/servers/channel';
import {getCommonSystemValues} from '@queries/servers/system';
import {getTeamChannelHistory} from '@queries/servers/team';
import {setScreensOrientation} from '@screens/navigation';
import CallManager, {CallAnsweredEvent, CallEndedEvent, CallMutedEvent, CallVideoMutedEvent} from '@store/CallManager';
import {alertInvalidDeepLink, handleDeepLink} from '@utils/deep_link';
import {getIntlShape} from '@utils/general';
import {logError} from '@utils/log';

type LinkingCallbackArg = {url: string};

const callManagerEmitter = new NativeEventEmitter(NativeModules.CallManagerModule);
const splitViewEmitter = new NativeEventEmitter(RNUtils);

class GlobalEventHandlerSingleton {
    JavascriptAndNativeErrorHandler: jsAndNativeErrorHandler | undefined;

    constructor() {
        DeviceEventEmitter.addListener(Events.SERVER_VERSION_CHANGED, this.onServerVersionChanged);
        callManagerEmitter.addListener('CallAnswered', this.onCallAnswered);
        callManagerEmitter.addListener('CallEnded', this.onCallEnded);
        if (Platform.OS === 'ios') {
            callManagerEmitter.addListener('CallMuted', this.onCallMuted);
        }

        // callManagerEmitter.addListener('CallVideoMuted', this.onCallMuted);
        splitViewEmitter.addListener('SplitViewChanged', this.onSplitViewChanged);
        Linking.addEventListener('url', this.onDeepLink);

        this.initialized();
    }

    init = () => {
        this.JavascriptAndNativeErrorHandler = require('@utils/error_handling').default;
        this.JavascriptAndNativeErrorHandler?.initializeErrorHandling();
    };

    initialized = () => {
        try {
            const {initialized} = NativeModules.CallManagerModule;
            if (typeof initialized === 'function') {
                initialized();
            }
        } catch (error) {
            // logError(error);
        }
    };

    onDeepLink = async (event: LinkingCallbackArg) => {
        if (event.url?.startsWith(Sso.REDIRECT_URL_SCHEME) || event.url?.startsWith(Sso.REDIRECT_URL_SCHEME_DEV)) {
            return;
        }

        if (event.url) {
            const {error} = await handleDeepLink(event.url, undefined, undefined, true);
            if (error) {
                alertInvalidDeepLink(getIntlShape(DEFAULT_LOCALE));
            }
        }
    };

    onServerVersionChanged = async ({serverUrl, serverVersion}: {serverUrl: string; serverVersion?: string}) => {
        const match = serverVersion?.match(/^[0-9]*.[0-9]*.[0-9]*(-[a-zA-Z0-9.-]*)?/g);
        const version = match && match[0];
        const locale = DEFAULT_LOCALE;
        const translations = getTranslations(locale);

        if (version) {
            if (semver.valid(version) && semver.lt(version, MIN_REQUIRED_VERSION)) {
                Alert.alert(
                    translations[t('mobile.server_upgrade.title')],
                    translations[t('mobile.server_upgrade.description')],
                    [{
                        text: translations[t('mobile.server_upgrade.button')],
                        onPress: () => this.serverUpgradeNeeded(serverUrl),
                    }],
                    {cancelable: false},
                );
            }
        }
    };

    onCallAnswered = async (event: unknown) => {
        const parsed = CallAnsweredEvent.safeParse(event);
        if (parsed.success) {
            const {data} = parsed;
            const serverUrl = await DatabaseManager.getServerUrlFromIdentifier(data.serverId);
            if (typeof serverUrl === 'string') {
                switchToConferenceByChannelId(serverUrl, data.channelId, {
                    conferenceJWT: data.conferenceJWT,
                    initiator: 'native',
                });
            }
        } else {
            logError('UNABLE TO PARSE CallAnsweredEvent', parsed.error);
        }
    };

    onCallEnded = async (event: unknown) => {
        const parsed = CallEndedEvent.safeParse(event);
        if (parsed.success) {
            CallManager.leaveCallScreen(parsed.data);
        } else {
            logError('UNABLE TO PARSE CallEndedEvent', parsed.error);
        }
    };

    onCallMuted = async (event: unknown) => {
        const parsed = CallMutedEvent.safeParse(event);
        if (parsed.success) {
            CallManager.toggleAudioMuted(parsed.data.isMuted === 'true');
        } else {
            logError('UNABLE TO PARSE CallMutedEvent', parsed.error);
        }
    };

    onCallVideoMuted = async (event: unknown) => {
        const parsed = CallVideoMutedEvent.safeParse(event);
        if (parsed.success) {
            CallManager.toggleAudioMuted(parsed.data.isMuted === 'true');
        } else {
            logError('UNABLE TO PARSE CallVideoMutedEvent', parsed.error);
        }
    };

    onSplitViewChanged = async (result: SplitViewResult) => {
        if (result.isTablet != null && Device.IS_TABLET !== result.isTablet) {
            Device.IS_TABLET = result.isTablet;
            const serverUrl = await getActiveServerUrl();
            if (serverUrl && result.isTablet) {
                try {
                    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
                    const {currentChannelId, currentTeamId} = await getCommonSystemValues(database);
                    if (currentTeamId && !currentChannelId) {
                        let channelId = '';
                        const teamChannelHistory = await getTeamChannelHistory(database, currentTeamId);
                        if (teamChannelHistory.length) {
                            channelId = teamChannelHistory[0];
                        } else {
                            const defaultChannel = await queryTeamDefaultChannel(database, currentTeamId).fetch();
                            if (defaultChannel.length) {
                                channelId = defaultChannel[0].id;
                            }
                        }

                        if (channelId) {
                            switchToChannelById(serverUrl, channelId);
                        }
                    }
                } catch {
                    // do nothing, the UI will not show a channel but that is fixed when the user picks one.
                }
            }
            setScreensOrientation(result.isTablet);
        }
    };

    serverUpgradeNeeded = async (serverUrl: string) => {
        const credentials = await getServerCredentials(serverUrl);

        if (credentials) {
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl, removeServer: false});
        }
    };
}

const GlobalEventHandler = new GlobalEventHandlerSingleton();
export default GlobalEventHandler;
