// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {type ListRenderItemInfo} from 'react-native';

import {useOpenUserProfile} from '@app/components/user_avatars_stack/users_list';
import IkCallsParticipantStackStatusIcon from '@calls/components/ik_calls_participant_stack/status_icon';
import UserItem from '@components/user_item';
import UserModel from '@typings/database/models/servers/user';

import type ConferenceParticipantModel from '@app/database/models/server/conference_participant';

type ConferenceParticipantWithUser = ConferenceParticipantModel & { user?: UserModel };

/**
 * Link ConferenceParticipantModel with UserModel
 */
export const useParticipantsLinkedToUser = (participants: ConferenceParticipantModel[], users: UserModel[]) => useMemo(
    () => {
        const usersById = users.reduce(
            (obj, user) => {
                obj[user.id] = user;
                return obj;
            },
            {} as Record<UserModel['id'], UserModel>,
        );

        return participants.map((participant) => ({
            ...participant,
            user: usersById[participant.userId],
        })) as Array<ConferenceParticipantModel & { user?: UserModel }>;
    },
    [participants, users],
);

export const IkCallsParticipantStackList = ({
    channelId,
    location,
    participants: baseParticipants,
    rowHeight = 40,
    users,
}: {
    channelId: string;
    location: string;
    participants: ConferenceParticipantModel[];
    rowHeight: number;
    users: UserModel[];
}) => {
    const participants = useParticipantsLinkedToUser(baseParticipants, users);
    const openUserProfile = useOpenUserProfile(channelId, location);

    const renderItem = useCallback(({item}: ListRenderItemInfo<ConferenceParticipantWithUser>) => (
        <UserItem
            user={item.user}
            rightDecorator={
                <IkCallsParticipantStackStatusIcon
                    participant={item}
                    padding={6}
                    size={rowHeight - 12}
                />
            }
            onUserPress={openUserProfile}
        />
    ), [openUserProfile]);

    return (
        <BottomSheetFlatList
            data={participants}
            renderItem={renderItem}
            overScrollMode='always'
        />
    );
};
