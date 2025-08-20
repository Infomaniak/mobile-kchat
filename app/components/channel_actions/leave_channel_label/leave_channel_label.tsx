// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {Alert} from 'react-native';

import {archiveChannel, leaveChannel} from '@actions/remote/channel';
import {setDirectChannelVisible} from '@actions/remote/preference';
import OptionItem from '@components/option_item';
import SlideUpPanelItem from '@components/slide_up_panel_item';
import {General, Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useIsTablet} from '@hooks/device';
import {t} from '@i18n';
import {dismissAllModalsAndPopToRoot, dismissBottomSheet, showModal} from '@screens/navigation';
import {alertErrorWithFallback} from '@utils/draft';

type Props = {
    isOptionItem?: boolean;
    canLeave: boolean;
    channelId: string;
    displayName?: string;
    type?: string;
    testID?: string;
    isLastAdminInChannel?: boolean;
    channelMembersLength: number;
}

const LeaveChannelLabel = (props: Props) => {
    const {canLeave, channelId, channelMembersLength, displayName, isOptionItem, type, isLastAdminInChannel, testID} = props;
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const isTablet = useIsTablet();

    const close = async () => {
        await dismissBottomSheet();
        if (!isTablet) {
            await dismissAllModalsAndPopToRoot();
        }
    };

    const closeDirectMessage = () => {
        Alert.alert(
            intl.formatMessage({id: 'channel_info.close_dm', defaultMessage: 'Close direct message'}),
            intl.formatMessage({
                id: 'channel_info.close_dm_channel',
                defaultMessage: 'Are you sure you want to close this direct message? This will remove it from your home screen, but you can always open it again.',
            }),
            [{
                text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                style: 'cancel',
            }, {
                text: intl.formatMessage({id: 'channel_info.close', defaultMessage: 'Close'}),
                style: 'destructive',
                onPress: () => {
                    setDirectChannelVisible(serverUrl, channelId, false);
                    close();
                },
            }], {cancelable: false},
        );
    };

    const closeGroupMessage = () => {
        Alert.alert(
            intl.formatMessage({id: 'channel_info.close_gm', defaultMessage: 'Close group message'}),
            intl.formatMessage({
                id: 'channel_info.close_gm_channel',
                defaultMessage: 'Are you sure you want to close this group message? This will remove it from your home screen, but you can always open it again.',
            }),
            [{
                text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                style: 'cancel',
            }, {
                text: intl.formatMessage({id: 'channel_info.close', defaultMessage: 'Close'}),
                style: 'destructive',
                onPress: () => {
                    setDirectChannelVisible(serverUrl, channelId, false);
                    close();
                },
            }], {cancelable: false},
        );
    };

    const leavePublicChannel = () => {
        Alert.alert(
            intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave Channel'}),
            intl.formatMessage({
                id: 'channel_info.leave_public_channel',
                defaultMessage: 'Are you sure you want to leave the public channel {displayName}? You can always rejoin.',
            }, {displayName}),
            [{
                text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                style: 'cancel',
            }, {
                text: intl.formatMessage({id: 'channel_info.leave', defaultMessage: 'Leave'}),
                style: 'destructive',
                onPress: () => {
                    leaveChannel(serverUrl, channelId);
                    close();
                },
            }], {cancelable: false},
        );
    };

    const onPressAction = async () => {
        const result = await archiveChannel(serverUrl, channelId);
        if (result.error) {
            alertErrorWithFallback(
                intl,
                result.error,
                {
                    id: t('channel_info.archive_failed'),
                    defaultMessage: 'An error occurred trying to archive the channel',
                },
            );
        }
    };

    const leavePrivateChannel = () => {
        const title = intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave channel'});
        if (isLastAdminInChannel && channelMembersLength === 1) {
            Alert.alert(
                intl.formatMessage({id: 'channel_info.archive_title', defaultMessage: 'Archive {term}'}, ({term: displayName})),
                intl.formatMessage({
                    id: 'channel_info.leave_private_channel_last_user',
                    defaultMessage: 'As the last user, you cannot leave this private channel but only archive it. You, or an administrator, can always unarchive it.',
                }, {displayName}),
                [{
                    text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                    style: 'cancel',
                }, {
                    text: intl.formatMessage({id: 'channel_info.archive', defaultMessage: 'Archive Channel'}),
                    style: 'destructive',
                    onPress: () => {
                        onPressAction();
                    },
                }], {cancelable: false},
            );
        } else if (isLastAdminInChannel && channelMembersLength > 1) {
            Alert.alert(
                intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave Channel'}),
                intl.formatMessage({
                    id: 'channel_info.leave_private_channel_last_admin',
                    defaultMessage: 'As the last administrator, you will need to assign administrative rights to another user to leave this channel.',
                }, {displayName}),
                [{
                    text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                    style: 'cancel',
                }, {
                    text: intl.formatMessage({id: 'mobile.components.select_server_view.proceed', defaultMessage: 'Continuer'}),
                    style: 'destructive',
                    onPress: () => {
                        showModal(Screens.LEAVE_CHANNEL_MEMBERS, title, {channelId});
                    },
                }], {cancelable: false},
            );
        } else {
            Alert.alert(
                intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave Channel'}),
                intl.formatMessage({
                    id: 'channel_info.leave_private_channel',
                    defaultMessage: "Are you sure you want to leave the private channel {displayName}? You cannot rejoin the channel unless you're invited again.",
                }, {displayName}),
                [{
                    text: intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                    style: 'cancel',
                }, {
                    text: intl.formatMessage({id: 'channel_info.leave', defaultMessage: 'Leave'}),
                    style: 'destructive',
                    onPress: () => {
                        leaveChannel(serverUrl, channelId);
                        close();
                    },
                }], {cancelable: false},
            );
        }
    };

    const onLeave = () => {
        switch (type) {
            case General.OPEN_CHANNEL:
                leavePublicChannel();
                break;
            case General.PRIVATE_CHANNEL:
                leavePrivateChannel();
                break;
            case General.DM_CHANNEL:
                closeDirectMessage();
                break;
            case General.GM_CHANNEL:
                closeGroupMessage();
                break;
        }
    };

    if (!displayName || !type || !canLeave) {
        return null;
    }

    let leaveText;
    let icon;
    switch (type) {
        case General.DM_CHANNEL:
            leaveText = intl.formatMessage({id: 'channel_info.close_dm', defaultMessage: 'Close direct message'});
            icon = 'close';
            break;
        case General.GM_CHANNEL:
            leaveText = intl.formatMessage({id: 'channel_info.close_gm', defaultMessage: 'Close group message'});
            icon = 'close';
            break;
        default:
            leaveText = intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave channel'});
            icon = 'exit-to-app';
            break;
    }

    if (isOptionItem) {
        return (
            <OptionItem
                action={onLeave}
                destructive={true}
                icon={icon}

                label={leaveText}
                testID={testID}
                type='default'
            />
        );
    }

    return (
        <SlideUpPanelItem
            destructive={true}
            leftIcon={icon}
            onPress={onLeave}
            text={leaveText}
            testID={testID}
        />
    );
};

export default LeaveChannelLabel;
