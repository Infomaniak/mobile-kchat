// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useMemo} from 'react';
import {defineMessages, type IntlShape, useIntl} from 'react-intl';
import {Keyboard, type ListRenderItemInfo, Platform, SectionList, type SectionListData, Text, View} from 'react-native';

import {storeProfile} from '@actions/local/user';
import Loading from '@components/loading';
import NoResultsWithTerm from '@components/no_results_with_term';
import UserListRow from '@components/user_list_row';
import {General} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useKeyboardHeight} from '@hooks/device';
import {openUserProfileModal} from '@screens/navigation';
import {
    changeOpacity,
    makeStyleSheetFromTheme,
} from '@utils/theme';
import {typography} from '@utils/typography';

import GroupRow from './group_row';

import type GroupModel from '@typings/database/models/servers/group';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

type UserProfileWithChannelAdmin = UserProfile & {scheme_admin?: boolean}
type RenderItemType = ListRenderItemInfo<UserProfileWithChannelAdmin | GroupModel> & {section?: SectionListData<UserProfileWithChannelAdmin | GroupModel>}
type SectionWithGroupFlag = SectionListData<UserProfileWithChannelAdmin | GroupModel> & {isGroupSection?: boolean}

const INITIAL_BATCH_TO_RENDER = 15;
const SCROLL_EVENT_THROTTLE = 60;

const messages = defineMessages({
    admins: {
        id: 'mobile.manage_members.section_title_admins',
        defaultMessage: 'CHANNEL ADMINS',
    },
    groups: {
        id: 'mobile.manage_members.section_title_groups',
        defaultMessage: 'TEAMS',
    },
    members: {
        id: 'mobile.manage_members.section_title_members',
        defaultMessage: 'MEMBERS',
    },
});

const keyboardDismissProp = Platform.select({
    android: {
        onScrollBeginDrag: Keyboard.dismiss,
    },
    ios: {
        keyboardDismissMode: 'on-drag' as const,
    },
});

const keyExtractor = (item: UserProfile | GroupModel) => {
    return item.id;
};

const isGroupModel = (item: UserProfile | GroupModel): item is GroupModel => !('username' in item);

const sectionKeyExtractor = (profile: UserProfile) => {
    // Group items alphabetically by first letter of username
    return profile.username[0].toUpperCase();
};

const sectionRoleKeyExtractor = (cAdmin: boolean) => {
    // Group items by channel admin or channel member
    return cAdmin ? messages.admins : messages.members;
};

export function createProfilesSections(intl: IntlShape, profiles: UserProfile[], members?: ChannelMembership[], groups?: GroupModel[]) {
    if (!profiles.length && !groups?.length) {
        return [];
    }

    const {formatMessage} = intl;

    if (members?.length) {
        // when channel members are provided, build the sections by admins and members
        const membersDictionary = new Map<string, ChannelMembership>();
        const membersSections = new Map<string, UserProfileWithChannelAdmin[]>();
        members.forEach((m) => membersDictionary.set(m.user_id, m));
        profiles.forEach((p) => {
            const member = membersDictionary.get(p.id);
            if (member) {
                const sectionKey = sectionRoleKeyExtractor(member.scheme_admin!).id;
                const section = membersSections.get(sectionKey) || [];
                section.push({...p, scheme_admin: member.scheme_admin});
                membersSections.set(sectionKey, section);
            }
        });

        const results: Array<{first: boolean; id: string; data: Array<UserProfileWithChannelAdmin | GroupModel>; isGroupSection?: boolean}> = [];
        let index = 0;

        const admins = membersSections.get(messages.admins.id) || [];
        if (admins.length) {
            results.push({first: index === 0, id: formatMessage(messages.admins), data: admins});
            index++;
        }

        // Insert groups section between admins and members
        if (groups?.length) {
            results.push({first: index === 0, id: formatMessage(messages.groups), data: groups, isGroupSection: true});
            index++;
        }

        const membersData = membersSections.get(messages.members.id) || [];
        if (membersData.length) {
            results.push({first: index === 0, id: formatMessage(messages.members), data: membersData});
            index++;
        }

        return results;
    }

    // when channel members are not provided, build the sections alphabetically
    const sections = new Map<string, UserProfileWithChannelAdmin[]>();
    profiles.forEach((p) => {
        const sectionKey = sectionKeyExtractor(p);
        const sectionValue = sections.get(sectionKey) || [];
        const section = [...sectionValue, p];
        sections.set(sectionKey, section);
    });

    const results = [];
    let index = 0;
    for (const [k, v] of sections) {
        if (v.length) {
            results.push({
                first: index === 0,
                id: k,
                data: v,
            });
            index++;
        }
    }
    return results;
}

const getStyleFromTheme = makeStyleSheetFromTheme((theme) => {
    return {
        list: {
            backgroundColor: theme.centerChannelBg,
            flex: 1,
        },
        container: {
            flexGrow: 1,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        noResultContainer: {
            flexGrow: 1,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        sectionContainer: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
            paddingLeft: 16,
            justifyContent: 'center',
            height: 24,
        },
        sectionWrapper: {
            backgroundColor: theme.centerChannelBg,
        },
        sectionText: {
            color: theme.centerChannelColor,
            ...typography('Body', 75, 'SemiBold'),
        },
    };
});

type Props = {
    profiles: UserProfile[];
    channelMembers?: ChannelMembership[];
    groups?: GroupModel[];
    currentUserId: string;
    handleSelectProfile: (user: UserProfile | UserModel) => void;
    fetchMore?: () => void;
    loading: boolean;
    manageMode?: boolean;
    showManageMode?: boolean;
    showNoResults: boolean;
    selectedIds: {[id: string]: UserProfile};
    testID?: string;
    term?: string;
    tutorialWatched: boolean;
    includeUserMargin?: boolean;
    location: AvailableScreens;
}

export default function UserList({
    profiles,
    channelMembers,
    groups,
    selectedIds,
    currentUserId,
    handleSelectProfile,
    fetchMore,
    loading,
    manageMode = false,
    showManageMode = false,
    showNoResults,
    term,
    testID,
    tutorialWatched,
    includeUserMargin,
    location,
}: Props) {
    const intl = useIntl();
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const style = getStyleFromTheme(theme);
    const keyboardHeight = useKeyboardHeight();
    const noResutsStyle = useMemo(() => [
        style.noResultContainer,
        {paddingBottom: keyboardHeight},
    ], [style, keyboardHeight]);

    const filteredGroups = useMemo(() => {
        if (!term || !groups?.length) {
            return groups;
        }
        const lowerTerm = term.toLowerCase();
        return groups.filter((g) =>
            g.name.toLowerCase().includes(lowerTerm) ||
            g.displayName.toLowerCase().includes(lowerTerm),
        );
    }, [groups, term]);

    const data = useMemo(() => {
        if (profiles.length === 0 && !filteredGroups?.length && !loading) {
            return [];
        }

        return createProfilesSections(intl, profiles, channelMembers, filteredGroups);
    }, [channelMembers, filteredGroups, intl, loading, profiles]);

    const openUserProfile = useCallback(async (profile: UserProfile | UserModel) => {
        let user: UserModel;
        if ('create_at' in profile) {
            const res = await storeProfile(serverUrl, profile);
            if (!res.user) {
                return;
            }
            user = res.user;
        } else {
            user = profile;
        }

        openUserProfileModal(intl, theme, {
            userId: user.id,
            location,
        });
    }, [intl, location, serverUrl, theme]);

    const renderItem = useCallback(({item, index, section}: RenderItemType) => {
        if (isGroupModel(item)) {
            return null; // handled by per-section renderItem
        }

        // The list will re-render when the selection changes because it's passed into the list as extraData
        const selected = Boolean(selectedIds[item.id]);
        const canAdd = Object.keys(selectedIds).length < General.MAX_USERS_IN_GM;

        const isChAdmin = item.scheme_admin || false;

        return (
            <UserListRow
                key={item.id}
                highlight={section?.first && index === 0}
                id={item.id}
                isChannelAdmin={isChAdmin}
                isMyUser={currentUserId === item.id}
                manageMode={manageMode}
                onPress={handleSelectProfile}
                onLongPress={openUserProfile}
                selectable={manageMode || canAdd}
                disabled={!canAdd}
                selected={selected}
                showManageMode={showManageMode}
                testID='create_direct_message.user_list.user_item'
                tutorialWatched={tutorialWatched}
                user={item}
                includeMargin={includeUserMargin}
            />
        );
    }, [selectedIds, currentUserId, manageMode, handleSelectProfile, openUserProfile, showManageMode, tutorialWatched, includeUserMargin]);

    const renderLoading = useCallback(() => {
        if (!loading) {
            return null;
        }

        return (
            <Loading
                color={theme.buttonBg}
                containerStyle={style.loadingContainer}
                size='large'
            />
        );
    }, [loading, theme]);

    const renderNoResults = useCallback(() => {
        if (!showNoResults || !term) {
            return null;
        }

        return (
            <View style={noResutsStyle}>
                <NoResultsWithTerm term={term}/>
            </View>
        );
    }, [showNoResults && style, term, noResutsStyle]);

    const renderGroupItem = useCallback(({item}: RenderItemType) => {
        if (!isGroupModel(item)) {
            return null;
        }
        return (
            <GroupRow
                group={item}
            />
        );
    }, []);

    const renderSectionHeader = useCallback(({section}: {section: SectionListData<UserProfile>}) => {
        return (
            <View style={style.sectionWrapper}>
                <View style={style.sectionContainer}>
                    <Text style={style.sectionText}>{section.id}</Text>
                </View>
            </View>
        );
    }, [style]);

    const renderSectionList = (sections: SectionWithGroupFlag[]) => {
        // Inject per-section renderItem for group sections
        const enhancedSections = sections.map((section) => {
            if (section.isGroupSection) {
                return {
                    ...section,
                    renderItem: renderGroupItem,
                    keyExtractor: (item: GroupModel) => item.id,
                };
            }
            return section;
        });

        return (
            <SectionList
                contentContainerStyle={style.container}
                keyboardShouldPersistTaps='always'
                {...keyboardDismissProp}
                keyExtractor={keyExtractor}
                initialNumToRender={INITIAL_BATCH_TO_RENDER}
                ListEmptyComponent={renderNoResults}
                ListFooterComponent={renderLoading}
                maxToRenderPerBatch={INITIAL_BATCH_TO_RENDER + 1}
                removeClippedSubviews={true}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                scrollEventThrottle={SCROLL_EVENT_THROTTLE}
                sections={enhancedSections}
                style={style.list}
                stickySectionHeadersEnabled={false}
                testID={`${testID}.section_list`}
                onEndReached={fetchMore}
            />
        );
    };

    return renderSectionList(data as SectionWithGroupFlag[]);
}
