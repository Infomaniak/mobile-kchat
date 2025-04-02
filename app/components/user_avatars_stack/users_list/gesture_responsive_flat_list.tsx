// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, type NativeScrollEvent, type NativeSyntheticEvent, type ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useBottomSheetListsFix} from '@hooks/bottom_sheet_lists_fix';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';

import type UserModel from '@typings/database/models/servers/user';

export const useOpenUserProfile = (channelId: string, location: string) => {
    const intl = useIntl();
    const theme = useTheme();

    return useCallback(async (u: UserModel | UserProfile) => {
        await dismissBottomSheet(Screens.BOTTOM_SHEET);
        const screen = Screens.USER_PROFILE;
        const title = intl.formatMessage({id: 'mobile.routes.user_profile', defaultMessage: 'Profile'});
        const closeButtonId = 'close-user-profile';
        const props = {closeButtonId, location, userId: u.id, channelId};

        Keyboard.dismiss();
        openAsBottomSheet({screen, title, theme, closeButtonId, props});
    }, [location, channelId, theme, intl]);
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const GestureResponsiveFlatList = <T extends unknown>(
    {renderItem, data}:
    { renderItem: ListRenderItem<T>; data: T[]},
) => {
    const listRef = useRef<FlatList>(null);
    const {direction, enabled, panResponder, setEnabled} = useBottomSheetListsFix();

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (e.nativeEvent.contentOffset.y <= 0 && enabled && direction === 'down') {
            setEnabled(false);
            listRef.current?.scrollToOffset({animated: true, offset: 0});
        }
    }, [enabled, direction, setEnabled]);

    return (
        <FlatList
            data={data}
            ref={listRef}
            renderItem={renderItem}
            onScroll={onScroll}
            overScrollMode={'always'}
            scrollEnabled={enabled}
            scrollEventThrottle={60}
            {...panResponder.panHandlers}
        />
    );
};

export default GestureResponsiveFlatList;
