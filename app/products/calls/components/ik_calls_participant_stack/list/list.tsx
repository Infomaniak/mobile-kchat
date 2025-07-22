// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {withObservables} from '@nozbe/watermelondb/react';
import React, {useCallback, useEffect, useState, type ComponentProps} from 'react';
import {StyleSheet, type ListRenderItemInfo} from 'react-native';
import {of as of$} from 'rxjs';

import {fetchUsersByIds} from '@actions/remote/user';
import {useOpenUserProfile} from '@components/user_avatars_stack/users_list';
import GestureResponsiveFlatList from '@components/user_avatars_stack/users_list/gesture_responsive_flat_list';
import {useServerUrl} from '@context/server';
import {useMountedRef} from '@hooks/utils';
import IkCallsParticipantStackStatusIcon from '@calls/components/ik_calls_participant_stack/status_icon';
import Loading from '@components/loading';
import BaseUserItem from '@components/user_item';

import type ConferenceParticipantModel from '@database/models/server/conference_participant';

/**
 * Enhance <UserItem /> with the user relation from Participant
 */
const enhance = withObservables(['participant'], ({participant}: {
    participant: ConferenceParticipantModel;
}) => ({
    participant,
    user: participant.user || of$(undefined),
}));
const UserItem = enhance(({participant, user, ...props}: { participant: ConferenceParticipantModel} & ComponentProps<typeof BaseUserItem>) => (
    <BaseUserItem
        user={user}
        grayscale={!participant.present}
        {...props}
    />
));

/**
 * Get a list of users corresponding to a list of participants
 * return the loading state
 */
export const useFetchParticipantUsers = (participants: ConferenceParticipantModel[]) => {
    const serverUrl = useServerUrl();
    const mountedRef = useMountedRef();

    // Asynchronous call should not set state on an unmounted component
    const [participantUsersVersion, setParticipantUsersVersion] = useState(0);
    useEffect(() => {
        const userIds = participants.map((p) => p.userId);

        (async () => {
            await fetchUsersByIds(serverUrl, userIds);
            if (mountedRef.current) {
                setParticipantUsersVersion((v) => v + 1); // eslint-disable-line max-nested-callbacks
            }
        })();
    }, [participants]);

    return participantUsersVersion === 0;
};

const style = StyleSheet.create({
    loadingContainer: {
        marginTop: 24,
    },
});

export const IkCallsParticipantStackList = ({
    channelId,
    location,
    participants,
    rowHeight = 40,
    type = 'FlatList',
}: {
    channelId: string;
    location: string;
    participants: ConferenceParticipantModel[];
    rowHeight: number;
    type?: BottomSheetList;
}) => {
    const openUserProfile = useOpenUserProfile(channelId, location);

    const renderItem = useCallback(({item}: ListRenderItemInfo<ConferenceParticipantModel>) => (
        <UserItem
            participant={item}
            rightDecorator={
                <IkCallsParticipantStackStatusIcon
                    status={item.status}
                    padding={6}
                    size={rowHeight - 12}
                />
            }
            onUserPress={openUserProfile}
        />
    ), [openUserProfile]);

    // EFFECTS
    const loading = useFetchParticipantUsers(participants);

    if (loading) {
        return (
            <Loading
                size='large'
                containerStyle={style.loadingContainer}
            />
        );
    }

    if (type === 'BottomSheetFlatList') {
        return (
            <BottomSheetFlatList
                data={participants}
                renderItem={renderItem}
                overScrollMode='always'
            />
        );
    }

    return (
        <GestureResponsiveFlatList
            data={participants}
            renderItem={renderItem}
        />
    );
};
