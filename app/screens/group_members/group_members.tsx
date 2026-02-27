// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Dimensions, type ListRenderItemInfo, StyleSheet, TouchableOpacity, View, Text} from 'react-native';

import Loading from '@components/loading';
import UserItem from '@components/user_item';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {changeOpacity} from '@utils/theme';
import {typography} from '@utils/typography';

import GroupIcon from './group_icon';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type Props = {
    closeButtonId: string;
    groupId: string;
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

const keyExtractor = (item: UserProfile) => item.id;

const GroupMembers = ({closeButtonId, groupId}: Props) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const intl = useIntl();
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);

    const fetchGroup = useCallback(async () => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const response = await client.getGroup(groupId, true);
            setGroup(response);

            // Sync fresh group data (including member_count) to local DB so badges are up to date
            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            operator.handleGroups({groups: [response], prepareRecordsOnly: false});
        } catch {
            // Group details are a nice to have, so we can just log the error and not block the screen if the request fails
        }
    }, [serverUrl, groupId]);

    const fetchMembers = useCallback(async (pageToLoad: number, isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
                setError(false);
            } else {
                setLoadingMore(true);
            }
            const client = NetworkManager.getClient(serverUrl);
            const response = await client.getUsersInGroup(groupId, pageToLoad, MEMBERS_PER_PAGE);

            if (Array.isArray(response)) {
                if (isInitial) {
                    setMembers(response);
                    setPage(1);
                } else {
                    setMembers((prev) => [...prev, ...response]);
                    setPage(pageToLoad + 1);
                }

                // If less than MEMBERS_PER_PAGE returned, no more data
                setHasMore(response.length === MEMBERS_PER_PAGE);
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
        fetchGroup();
        fetchMembers(0, true);
    }, [fetchGroup, fetchMembers]);

    useEffect(() => {
        fetchGroup();
        fetchMembers(0, true);
    }, [fetchGroup, fetchMembers]);

    const loadMore = useCallback(() => {
        if (hasMore && !loadingMore) {
            fetchMembers(page, false);
        }
    }, [hasMore, loadingMore, page, fetchMembers]);

    const snapPoints = useMemo(() => {
        return [1, '50%', '80%'];
    }, []);

    const renderItem = useCallback(({item}: ListRenderItemInfo<UserProfile>) => (
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
                            {group.display_name || group.name}
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
    }, [group, theme]);

    const renderError = () => (
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
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={[styles.container, styles.loadingContainer]}>
                    <Loading
                        color={theme.buttonBg}
                        size='large'
                    />
                </View>
            );
        }

        if (error) {
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
    };

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
