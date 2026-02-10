// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {type ListRenderItemInfo, StyleSheet, View, Text} from 'react-native';

import Loading from '@components/loading';
import UserItem from '@components/user_item';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {changeOpacity} from '@utils/theme';
import {typography} from '@utils/typography';

import GroupIcon from './group_icon';

type Props = {
    closeButtonId: string;
    groupId: string;
}

type Group = {
    id: string;
    name: string;
    display_name: string;
    description: string;
    source: string;
    remote_id: string;
    member_count?: number;
    allow_reference: boolean;
    create_at: number;
    update_at: number;
    delete_at: number;
}

const styles = StyleSheet.create({
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
    headerTitle: {
    },
    headerSubtitle: {
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 5,
        marginBottom: 16,
    },
    listItemContainer: {
        margin: 10,
    },
});

const ITEM_HEIGHT = 64;
const MEMBERS_PER_PAGE = 60;

const keyExtractor = (item: UserProfile) => item.id;

const GroupMembers = ({closeButtonId, groupId}: Props) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchGroup = useCallback(async () => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const response = await client.getGroup(groupId, true);
            setGroup(response);
        } catch (error) {
            console.log('Error fetching group:', error);
        }
    }, [serverUrl, groupId]);

    const fetchMembers = useCallback(async (pageToLoad: number, isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
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
        } catch (error) {
            console.log('Error fetching group members:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [serverUrl, groupId]);

    useEffect(() => {
        console.log('Fetching group and members for groupId:', groupId);
        fetchGroup();
        fetchMembers(0, true);
    }, [fetchGroup, fetchMembers]);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            fetchMembers(page, false);
        }
    }, [loadingMore, hasMore, page, fetchMembers]);

    const snapPoints = useMemo(() => {
        if (loading || members.length === 0) {
            return [1, '50%', '80%'];
        }
        const listHeight = Math.min((members.length * ITEM_HEIGHT) + 80, 400);
        return [1, listHeight, '80%'];
    }, [loading, members.length]);

    const renderItem = useCallback(({item}: ListRenderItemInfo<UserProfile>) => (
        <View style={styles.listItemContainer}>
            <UserItem
                user={item}
                padding={5}
                testID={`group_members.user_item.${item.id}`}
            />
        </View>
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
                            style={[
                                styles.headerTitle,
                                {
                                    color: theme.centerChannelColor,
                                    ...typography('Heading', 600),
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {group.display_name || group.name}
                        </Text>
                        {Boolean(group.name) && (
                            <Text
                                style={[
                                    styles.headerSubtitle,
                                    {
                                        color: changeOpacity(theme.centerChannelColor, 0.64),
                                        ...typography('Body', 100),
                                    },
                                ]}
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

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <Loading
                        color={theme.buttonBg}
                        size='large'
                    />
                </View>
            );
        }

        return (
            <>
                {renderHeader()}
                <BottomSheetFlatList
                    data={members}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    testID='group_members.flat_list'
                />
            </>
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
