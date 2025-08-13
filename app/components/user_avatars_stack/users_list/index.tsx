// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, type ListRenderItemInfo} from 'react-native';

import GestureResponsiveFlatList from '@components/user_avatars_stack/users_list/gesture_responsive_flat_list';
import UserItem from '@components/user_item';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    channelId?: string;
    location: AvailableScreens;
    type?: BottomSheetList;
    users: UserModel[];
};

type ItemProps = {
    channelId?: string;
    location: AvailableScreens;
    user: UserModel;
}

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

const Item = ({channelId, location, user}: ItemProps) => {
    if (!channelId) {
        return null;
    }
    return (
        <UserItem
            user={user}
            onUserPress={useOpenUserProfile(channelId, location)}
        />
    );
};

const UsersList = ({channelId, location, type = 'FlatList', users}: Props) => {
    const renderItem = useCallback(({item}: ListRenderItemInfo<UserModel>) => (
        <Item
            channelId={channelId}
            location={location}
            user={item}
        />
    ), [channelId, location]);

    if (type === 'BottomSheetFlatList') {
        return (
            <BottomSheetFlatList
                data={users}
                renderItem={renderItem}
                overScrollMode={'always'}
            />
        );
    }

    return (
        <GestureResponsiveFlatList
            data={users}
            renderItem={renderItem}
        />
    );
};

export default UsersList;
