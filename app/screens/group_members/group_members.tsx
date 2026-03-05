// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Dimensions, type ListRenderItemInfo, StyleSheet, TouchableOpacity, View, Text} from 'react-native';

import Loading from '@components/loading';
import UserItem from '@components/user_item';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {syncGroupMembershipsForGroup, upsertGroupMembershipsForGroup} from '@queries/servers/group';
import BottomSheet from '@screens/bottom_sheet';
import {changeOpacity} from '@utils/theme';
import {typography} from '@utils/typography';

import GroupIcon from './group_icon';

import type GroupModel from '@typings/database/models/servers/group';
import type UserModel from '@typings/database/models/servers/user';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type Props = {
    closeButtonId: string;
    groupId: string;
    group: GroupModel | undefined;
    members: UserModel[];
}

const styles = StyleSheet.create({
    container: {
        minHeight: SCREEN_HEIGHT * 0.4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingTop: 12,
        paddingBottom: 16,
    },
    headerIcon: {
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 5,
        marginBottom: 16,
    },
    errorContainer: {
        minHeight: SCREEN_HEIGHT * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    errorText: {
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 4,
    },
    retryButtonText: {
        ...typography('Body', 200, 'SemiBold'),
    },
    listContent: {
        paddingBottom: 40,
    },
});

const MEMBERS_PER_PAGE = 60;

const keyExtractor = (item: UserModel) => item.id;

const GroupMembers = ({closeButtonId, groupId, group, members}: Props) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const intl = useIntl();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);
    const accumulatedUserIds = useRef<string[]>([]);

    const fetchMembers = useCallback(async (pageToLoad: number, isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
                setError(false);
                // Reset accumulator so a fresh load or retry starts clean
                accumulatedUserIds.current = [];
            } else {
                setLoadingMore(true);
            }
            const client = NetworkManager.getClient(serverUrl);
            const response = await client.getUsersInGroup(groupId, pageToLoad, MEMBERS_PER_PAGE);

            if (Array.isArray(response)) {
                const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

                if (response.length) {
                    await operator.handleUsers({users: response, prepareRecordsOnly: false});
                    accumulatedUserIds.current = [...accumulatedUserIds.current, ...response.map((u) => u.id)];
                }

                const isLastPage = response.length < MEMBERS_PER_PAGE;
                if (isLastPage) {
                    // Last page: full sync with all accumulated IDs to remove
                    // any members that were removed from the group since last load
                    await syncGroupMembershipsForGroup(database, groupId, accumulatedUserIds.current);
                } else {
                    // Intermediate page: only insert new records, don't delete —
                    // members from upcoming pages haven't been fetched yet
                    await upsertGroupMembershipsForGroup(database, groupId, response.map((u) => u.id));
                }

                if (isInitial) {
                    setPage(1);
                } else {
                    setPage(pageToLoad + 1);
                }
                setHasMore(!isLastPage);
            } else {
                setHasMore(false);
            }
        } catch {
            if (isInitial) {
                setError(true);
            }
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [serverUrl, groupId]);

    const handleRetry = useCallback(() => {
        fetchMembers(0, true);
    }, [fetchMembers]);

    useEffect(() => {
        fetchMembers(0, true);
    }, [fetchMembers]);

    const loadMore = useCallback(() => {
        if (hasMore && !loadingMore) {
            fetchMembers(page, false);
        }
    }, [hasMore, loadingMore, page, fetchMembers]);

    const snapPoints = useMemo(() => {
        return [1, '50%', '80%'];
    }, []);

    const renderItem = useCallback(({item}: ListRenderItemInfo<UserModel>) => (
        <UserItem
            user={item}
            padding={5}
            includeMargin={true}
            testID={`group_members.user_item.${item.id}`}
        />
    ), []);

    const renderFooter = useCallback(() => {
        if (!loadingMore) {
            return null;
        }
        return (
            <View style={styles.loadingContainer}>
                <Loading
                    color={theme.buttonBg}
                    size='small'
                />
            </View>
        );
    }, [loadingMore, theme.buttonBg]);

    const renderHeader = useCallback(() => {
        if (!group) {
            return null;
        }

        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <GroupIcon size={56}/>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text
                            style={{
                                color: theme.centerChannelColor,
                                ...typography('Heading', 600),
                            }}
                            numberOfLines={1}
                        >
                            {group.displayName || group.name}
                        </Text>
                        {Boolean(group.name) && (
                            <Text
                                style={{
                                    color: changeOpacity(theme.centerChannelColor, 0.64),
                                    ...typography('Body', 100),
                                }}
                                numberOfLines={1}
                            >
                                {`@${group.name}`}
                            </Text>
                        )}
                    </View>
                </View>
                <View
                    style={[
                        styles.separator,
                        {backgroundColor: changeOpacity(theme.centerChannelColor, 0.16)},
                    ]}
                />
            </View>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group?.displayName, group?.name, theme]);

    const renderError = useCallback(() => (
        <View style={styles.errorContainer}>
            <Text
                style={[
                    styles.errorText,
                    {
                        color: theme.centerChannelColor,
                        ...typography('Body', 200),
                    },
                ]}
            >
                {intl.formatMessage({
                    id: 'group_members.load_error',
                    defaultMessage: 'Oops! Something went wrong while loading this group.',
                })}
            </Text>
            <TouchableOpacity
                onPress={handleRetry}
                style={[
                    styles.retryButton,
                    {backgroundColor: theme.buttonBg},
                ]}
                testID='group_members.retry_button'
            >
                <Text
                    style={[
                        styles.retryButtonText,
                        {color: theme.buttonColor},
                    ]}
                >
                    {intl.formatMessage({
                        id: 'group_members.retry',
                        defaultMessage: 'Retry',
                    })}
                </Text>
            </TouchableOpacity>
        </View>
    ), [handleRetry, intl, theme]);

    const renderContent = useCallback(() => {
        if (loading && !members.length) {
            return (
                <View style={[styles.container, styles.loadingContainer]}>
                    <Loading
                        color={theme.buttonBg}
                        size='large'
                    />
                </View>
            );
        }

        if (error && !members.length) {
            return (
                <View style={styles.container}>
                    {renderError()}
                </View>
            );
        }

        return (
            <BottomSheetFlatList
                data={members}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                testID='group_members.flat_list'
            />
        );
    }, [error, loading, loadMore, members, renderError, renderFooter, renderHeader, renderItem, theme.buttonBg]);

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={closeButtonId}
            componentId={Screens.GROUP_MEMBERS}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            testID='group_members'
        />
    );
};

export default GroupMembers;
