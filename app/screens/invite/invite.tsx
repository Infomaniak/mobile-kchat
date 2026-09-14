// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, View, type LayoutChangeEvent} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {searchProfiles} from '@actions/remote/user';
import Loading from '@components/loading';
import NavigationButton from '@components/navigation_button';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useKeyboardOverlap} from '@hooks/device';
import {dismissModal} from '@screens/navigation';
import {isEmail} from '@utils/helpers';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {secureGetFromRecord} from '@utils/types';

import {sendGuestInvites, sendMembersInvites} from './actions';
import Selection from './selection';
import Summary from './summary';

import type {EmailInvite, Result, SearchResult, SendOptions} from './types';
import type {AvailableScreens} from '@typings/screens/navigation';

const TIMEOUT_MILLISECONDS = 200;
const DEFAULT_RESULT = {sent: [], notSent: []};

const closeModal = async () => {
    Keyboard.dismiss();
    await dismissModal();
};

const getStyleSheet = makeStyleSheetFromTheme(() => {
    return {
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    };
});

enum Stage {
    SELECTION = 'selection',
    RESULT = 'result',
    LOADING = 'loading',
}

type InviteProps = {
    componentId: AvailableScreens;
    teamId: string;
    teamDisplayName: string;
    teamLastIconUpdate: number;
    teamInviteId: string;
    teammateNameDisplay: string;
    isAdmin: boolean;
    emailInvitationsEnabled: boolean;
    canInviteGuests: boolean;
    allowGuestMagicLink: boolean;
}

export default function Invite({
    componentId,
    teamId,
    teamDisplayName,
    teamLastIconUpdate,
    teamInviteId,
    teammateNameDisplay,
    isAdmin,
    emailInvitationsEnabled,
    canInviteGuests,
    allowGuestMagicLink,
}: InviteProps) {
    const intl = useIntl();
    const {formatMessage} = intl;
    const theme = useTheme();
    const navigation = useNavigation();
    const styles = getStyleSheet(theme);
    const serverUrl = useServerUrl();

    const mainView = useRef<View>(null);
    const [wrapperHeight, setWrapperHeight] = useState(0);
    const keyboardOverlap = useKeyboardOverlap(mainView, wrapperHeight);

    const searchTimeoutId = useRef<NodeJS.Timeout | null>(null);
    const retryTimeoutId = useRef<NodeJS.Timeout | null>(null);

    const [term, setTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedIds, setSelectedIds] = useState<{[id: string]: SearchResult}>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Result>(DEFAULT_RESULT);
    const [stage, setStage] = useState(Stage.SELECTION);
    const [sendError, setSendError] = useState('');

    const [sendOptions, setSendOptions] = useState<SendOptions>({
        inviteAsGuest: false,
        includeCustomMessage: false,
        customMessage: '',
        selectedChannels: [],
        guestMagicLink: false,
    });

    const isSelecting = stage === Stage.SELECTION;

    const selectedCount = Object.keys(selectedIds).length;
    const hasSelection = selectedCount > 0;

    const onLayoutWrapper = useCallback((e: LayoutChangeEvent) => {
        setWrapperHeight(e.nativeEvent.layout.height);
    }, []);

    const handleClearSearch = useCallback(() => {
        setTerm('');
        setSearchResults([]);
    }, []);

    const searchUsers = useCallback(async (searchTerm: string) => {
        if (searchTerm === '') {
            handleClearSearch();
            return;
        }

        const {data} = await searchProfiles(serverUrl, searchTerm.toLowerCase(), {});
        const results: SearchResult[] = data ?? [];

        if (!results.length && isEmail(searchTerm.trim()) && emailInvitationsEnabled) {
            results.push(searchTerm.trim() as EmailInvite);
        }

        setSearchResults(results);
    }, [emailInvitationsEnabled, handleClearSearch, serverUrl]);

    const handleReset = useCallback(() => {
        setSendError('');
        setTerm('');
        setSearchResults([]);
        setResult(DEFAULT_RESULT);
        setStage(Stage.SELECTION);
    }, []);

    const handleSearchChange = useCallback((text: string) => {
        setLoading(true);
        setTerm(text);

        if (searchTimeoutId.current) {
            clearTimeout(searchTimeoutId.current);
        }

        searchTimeoutId.current = setTimeout(async () => {
            await searchUsers(text);
            setLoading(false);
        }, TIMEOUT_MILLISECONDS);
    }, [searchUsers]);

    const handleSelectItem = useCallback((item: SearchResult) => {
        const email = typeof item === 'string';
        const id = email ? item : (item as UserProfile).id;
        const newSelectedIds = Object.assign({}, selectedIds);

        if (!secureGetFromRecord(selectedIds, id)) {
            newSelectedIds[id] = item;
        }

        setSelectedIds(newSelectedIds);

        handleClearSearch();
    }, [selectedIds, handleClearSearch]);

    const handleSendError = useCallback(() => {
        setSendError(formatMessage({id: 'invite.send_error', defaultMessage: 'Something went wrong while trying to send invitations. Please check your network connection and try again.'}));
        setResult(DEFAULT_RESULT);
        setStage(Stage.RESULT);
    }, [formatMessage]);

    const handleSend = useCallback(async () => {
        if (!hasSelection) {
            return;
        }

        setStage(Stage.LOADING);

        if (sendOptions.inviteAsGuest) {
            const {sent, notSent} = await sendGuestInvites(serverUrl, teamId, selectedIds, sendOptions, formatMessage);
            setResult({sent, notSent});
            setStage(Stage.RESULT);
            return;
        }

        const {sent, notSent, error} = await sendMembersInvites(serverUrl, teamId, selectedIds, isAdmin, teamDisplayName, formatMessage);
        if (error) {
            handleSendError();
        } else {
            setResult({sent, notSent});
            setStage(Stage.RESULT);
        }
    }, [formatMessage, handleSendError, isAdmin, hasSelection, selectedIds, sendOptions, serverUrl, teamDisplayName, teamId]);

    const handleRetry = useCallback(() => {
        setSendError('');
        setStage(Stage.LOADING);

        retryTimeoutId.current = setTimeout(() => {
            handleSend();
        }, TIMEOUT_MILLISECONDS);
    }, [handleSend]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: isSelecting ? () => (
                <NavigationButton
                    onPress={handleSend}
                    text={formatMessage({id: 'invite.send_invite', defaultMessage: 'Send'})}
                    testID='invite.send.button'
                    color={theme.sidebarHeaderTextColor}
                    disabled={!hasSelection}
                />
            ) : undefined,
        });
    }, [navigation, isSelecting, handleSend, hasSelection, formatMessage, theme.sidebarHeaderTextColor]);

    useEffect(() => {
        return () => {
            if (searchTimeoutId.current) {
                clearTimeout(searchTimeoutId.current);
            }

            if (retryTimeoutId.current) {
                clearTimeout(retryTimeoutId.current);
            }
        };
    }, []);

    const handleRemoveItem = useCallback((id: string) => {
        const newSelectedIds = Object.assign({}, selectedIds);

        Reflect.deleteProperty(newSelectedIds, id);

        setSelectedIds(newSelectedIds);
    }, [selectedIds]);

    useAndroidHardwareBackHandler(componentId, closeModal);

    const renderContent = () => {
        switch (stage) {
            case Stage.LOADING:
                return (
                    <Loading
                        containerStyle={styles.loadingContainer}
                        size='large'
                        color={theme.centerChannelColor}
                    />
                );
            case Stage.RESULT:
                return (
                    <Summary
                        result={result}
                        selectedIds={selectedIds}
                        error={sendError}
                        onClose={closeModal}
                        onRetry={handleRetry}
                        onBack={handleReset}
                        testID='invite.screen.summary'
                    />
                );
            default:
                return (
                    <Selection
                        teamId={teamId}
                        teamDisplayName={teamDisplayName}
                        teamLastIconUpdate={teamLastIconUpdate}
                        teamInviteId={teamInviteId}
                        teammateNameDisplay={teammateNameDisplay}
                        serverUrl={serverUrl}
                        term={term}
                        searchResults={searchResults}
                        selectedIds={selectedIds}
                        keyboardOverlap={keyboardOverlap}
                        wrapperHeight={wrapperHeight}
                        loading={loading}
                        onSearchChange={handleSearchChange}
                        onSelectItem={handleSelectItem}
                        onRemoveItem={handleRemoveItem}
                        onClose={closeModal}
                        testID='invite.screen.selection'
                        sendOptions={sendOptions}
                        onSendOptionsChange={setSendOptions}
                        canInviteGuests={canInviteGuests}
                        allowGuestMagicLink={allowGuestMagicLink}
                    />
                );
        }
    };

    return (
        <SafeAreaView
            style={styles.container}
            onLayout={onLayoutWrapper}
            ref={mainView}
            testID='invite.screen'
            nativeID={`${componentId}.screen`}
        >
            {renderContent()}
        </SafeAreaView>
    );
}
