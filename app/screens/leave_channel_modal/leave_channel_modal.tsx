// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, type LayoutChangeEvent, Platform, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {leaveChannel, updateChannelMemberSchemeRoles} from '@actions/remote/channel';
import {fetchProfilesInChannel} from '@actions/remote/user';
import {showLeaveChannelMembersSnackbar} from '@utils/snack_bar';
import CompassIcon from '@components/compass_icon';
import Loading from '@components/loading';
import Search from '@components/search';
import SelectedUsers from '@components/selected_users';
import ServerUserList from '@components/server_user_list';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useKeyboardOverlap} from '@hooks/device';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import {dismissAllModalsAndPopToRoot, dismissModal} from '@screens/navigation';
import {mergeNavigationOptions} from '@utils/navigation';
import {changeOpacity, getKeyboardAppearanceFromTheme, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {UserModel} from '@database/models/server';
import type ChannelModel from '@typings/database/models/servers/channel';
import type {AvailableScreens} from '@typings/screens/navigation';

const CLOSE_BUTTON_ID = 'close-add-member';
const TEST_ID = 'add_members';
const CLOSE_BUTTON_TEST_ID = 'close.button';

export const getHeaderOptions = async (theme: Theme, displayName: string, inModal = false) => {
    let leftButtons;
    if (!inModal) {
        const closeButton = await CompassIcon.getImageSourceSync('close', 24, theme.sidebarHeaderTextColor);
        leftButtons = [{
            id: CLOSE_BUTTON_ID,
            icon: closeButton,
            testID: `${TEST_ID}.${CLOSE_BUTTON_TEST_ID}`,
        }];
    }
    return {
        topBar: {
            subtitle: {
                color: changeOpacity(theme.sidebarHeaderTextColor, 0.72),
                text: displayName,
            },
            leftButtons,
            backButton: inModal ? {
                color: theme.sidebarHeaderTextColor,
            } : undefined,
        },
    };
};

type Props = {
    componentId: AvailableScreens;
    channel?: ChannelModel;
    teammateNameDisplay: string;
    tutorialWatched: boolean;
    inModal?: boolean;
    currentUser: UserModel;
}

const close = () => {
    Keyboard.dismiss();
    dismissModal();
};

const getStyleFromTheme = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            flex: 1,
        },
        searchBar: {
            marginLeft: 12,
            marginRight: Platform.select({ios: 4, default: 12}),
            marginVertical: 12,
        },
        loadingContainer: {
            alignItems: 'center',
            backgroundColor: theme.centerChannelBg,
            height: 70,
            justifyContent: 'center',
        },
        loadingText: {
            color: changeOpacity(theme.centerChannelColor, 0.6),
        },
        noResultContainer: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        noResultText: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
            ...typography('Body', 600, 'Regular'),
        },
    };
});

function removeProfileFromList(list: {[id: string]: UserProfile}, id: string) {
    const newSelectedIds = Object.assign({}, list);

    Reflect.deleteProperty(newSelectedIds, id);
    return newSelectedIds;
}

export default function LeaveChannelModal({
    componentId,
    channel,
    currentUser,
    teammateNameDisplay,
    tutorialWatched,
    inModal,
}: Props) {
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const style = getStyleFromTheme(theme);
    const intl = useIntl();
    const {formatMessage} = intl;

    const mainView = useRef<View>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const keyboardOverlap = useKeyboardOverlap(mainView, containerHeight);

    const [term, setTerm] = useState('');
    const [addingMembers, setAddingMembers] = useState(false);
    const [selectedIds, setSelectedIds] = useState<{[id: string]: UserProfile}>({});

    const clearSearch = useCallback(() => {
        setTerm('');
    }, []);

    const handleRemoveProfile = useCallback((id: string) => {
        setSelectedIds((current) => removeProfileFromList(current, id));
    }, []);

    const closeChannelModal = async () => {
        await dismissAllModalsAndPopToRoot();
    };

    const addMembers = useCallback(async () => {
        if (!channel) {
            return;
        }

        if (addingMembers) {
            return;
        }

        const idsToUse = Object.keys(selectedIds);
        if (!idsToUse.length) {
            return;
        }
        setAddingMembers(true);
        try {
            await Promise.all(idsToUse.map(async (userId) => {
                await updateChannelMemberSchemeRoles(serverUrl, channel.id, userId, true, true);
            }));
            close();
            await leaveChannel(serverUrl, channel.id);
            closeChannelModal();
            setTimeout(() => {
                showLeaveChannelMembersSnackbar(channel.displayName);
            }, 1200);
        } catch (error) {
            // do nothing
        }
    }, [channel, addingMembers, selectedIds, serverUrl, intl]);

    const handleSelectProfile = useCallback((user: UserProfile) => {
        clearSearch();
        setSelectedIds((current) => {
            if (current[user.id]) {
                return removeProfileFromList(current, user.id);
            }
            return {...current, [user.id]: user};
        });
    }, [clearSearch, currentUser.id]);

    const onTextChange = useCallback((searchTerm: string) => {
        setTerm(searchTerm);
    }, []);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setContainerHeight(e.nativeEvent.layout.height);
    }, []);

    const updateNavigationButtons = useCallback(async () => {
        const options = await getHeaderOptions(theme, channel?.displayName || '', inModal);
        mergeNavigationOptions(componentId, options);
    }, [theme, channel?.displayName, inModal, componentId]);

    const userFetchFunction = useCallback(async (page: number) => {
        if (!channel) {
            return [];
        }
        const fetchProfiles = await fetchProfilesInChannel(serverUrl, channel.id, currentUser.id, {page});
        const filteredUsersInChannel = fetchProfiles.users?.filter((u) => {
            return !u.delete_at;
        }) || [];
        if (fetchProfiles.users?.length) {
            return filteredUsersInChannel;
        }

        return [];
    }, [serverUrl, channel]);

    const userSearchFunction = useCallback(async () => {
        if (!channel) {
            return [];
        }

        const results = await fetchProfilesInChannel(serverUrl, channel.id);
        if (results) {
            return results.users || [];
        }

        return [];
    }, [serverUrl, channel]);

    const createUserFilter = useCallback((exactMatches: UserProfile[], searchTerm: string) => {
        return (p: UserProfile) => {
            if (p.username === searchTerm || p.username.startsWith(searchTerm)) {
                exactMatches.push(p);
                return false;
            }

            return true;
        };
    }, []);

    useNavButtonPressed(CLOSE_BUTTON_ID, componentId, close, [close]);
    useAndroidHardwareBackHandler(componentId, close);

    useEffect(() => {
        updateNavigationButtons();
    }, [updateNavigationButtons]);

    if (addingMembers) {
        return (
            <View style={style.container}>
                <Loading color={theme.centerChannelColor}/>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={style.container}
            testID={`${TEST_ID}.screen`}
            onLayout={onLayout}
            ref={mainView}
            edges={['top', 'left', 'right']}
        >
            <View style={style.searchBar}>
                <Search
                    testID={`${TEST_ID}.search_bar`}
                    placeholder={formatMessage({id: 'search_bar.search', defaultMessage: 'Search'})}
                    cancelButtonTitle={formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'})}
                    placeholderTextColor={changeOpacity(theme.centerChannelColor, 0.5)}
                    onChangeText={onTextChange}
                    onCancel={clearSearch}
                    autoCapitalize='none'
                    keyboardAppearance={getKeyboardAppearanceFromTheme(theme)}
                    value={term}
                />
            </View>
            <ServerUserList
                currentUserId={currentUser.id}
                handleSelectProfile={handleSelectProfile}
                selectedIds={selectedIds}
                term={term}
                testID={`${TEST_ID}.user_list`}
                tutorialWatched={tutorialWatched}
                fetchFunction={userFetchFunction}
                searchFunction={userSearchFunction}
                createFilter={createUserFilter}
                loadUsers={true}
            />
            <SelectedUsers
                keyboardOverlap={keyboardOverlap}
                selectedIds={selectedIds}
                onRemove={handleRemoveProfile}
                teammateNameDisplay={teammateNameDisplay}
                onPress={addMembers}
                buttonText={formatMessage({id: 'channel_info.leave_private_channel_last_admin_end', defaultMessage: 'Finish'})}
                testID={`${TEST_ID}.selected`}
            />
        </SafeAreaView>
    );
}

