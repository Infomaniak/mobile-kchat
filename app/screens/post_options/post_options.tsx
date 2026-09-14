// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';

import {CopyPermalinkOption, FollowThreadOption, ReplyOption, SaveOption, ShowTranslationOption} from '@components/common_post_options';
import CopyTextOption from '@components/copy_text_option';
import {ITEM_HEIGHT} from '@components/option_item';
import {Screens} from '@constants';
import {PostTypes} from '@constants/post';
import {REACTION_PICKER_HEIGHT, REACTION_PICKER_MARGIN} from '@constants/reaction_picker';
import {useBottomSheetListsFix} from '@hooks/bottom_sheet_lists_fix';
import {useIsTablet} from '@hooks/device';
import BottomSheet from '@screens/bottom_sheet';
import IKReminderOption from '@screens/post_options/options/ik_reminder_option';
import IKTranslateOption from '@screens/post_options/options/ik_translate_option';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {isSystemMessage} from '@utils/post';

import AppBindingsPostOptions from './options/app_bindings_post_option';
import AskAi from './options/ask_ai';
import DeletePostOption from './options/delete_post_option';
import EditOption from './options/edit_option';
import MarkAsUnreadOption from './options/mark_unread_option';
import PinChannelOption from './options/pin_channel_option';
import ReactionBar from './reaction_bar';

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type PostModel from '@typings/database/models/servers/post';
import type ThreadModel from '@typings/database/models/servers/thread';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const POST_OPTIONS_BUTTON = 'close-post-options';

type PostOptionsProps = {
    canAddReaction: boolean;
    canDelete: boolean;
    canEdit: boolean;
    canMarkAsUnread: boolean;
    canPin: boolean;
    canReply: boolean;
    canViewTranslation: boolean;
    isChannelMember?: boolean;
    combinedPost?: Post | PostModel;
    isSaved: boolean;
    sourceScreen: AvailableScreens;
    post: PostModel;
    thread?: ThreadModel;
    componentId?: AvailableScreens;
    bindings: AppBinding[];
    serverUrl: string;
    limits: LimitModel;
    usage: CloudUsageModel;
    currentUser?: UserModel;
};
const PostOptions = ({
    canAddReaction, canDelete, canEdit,
    canMarkAsUnread, canPin, canReply, canViewTranslation,
    combinedPost, isSaved,
    sourceScreen, post, thread, bindings, serverUrl,
    usage, limits,
    currentUser,
    isChannelMember = true,
}: PostOptionsProps) => {
    const isTablet = useIsTablet();
    const {enabled, panResponder} = useBottomSheetListsFix();
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);

    const isSystemPost = isSystemMessage(post);

    const canShowPermalink = !isSystemPost;
    const canCopyPermalink = canShowPermalink;
    const canCopyText = canShowPermalink && post.message;

    const canSavePost = !isSystemPost;

    const shouldRenderFollow = !(sourceScreen !== Screens.CHANNEL || !thread);
    const shouldShowBindings = bindings.length > 0 && !isSystemPost;
    const shouldRenderAi = !isSystemPost && !post.rootId;
    const canShowReminder = !isSystemPost;
    const canTranslate = !isSystemPost;

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const commonOptions = [canCopyPermalink];
        const memberOptions = [
            canReply, canCopyText, canDelete, canEdit,
            canMarkAsUnread, canPin, !isSystemPost, shouldRenderAi, shouldRenderFollow, canShowReminder, canTranslate, canViewTranslation,
        ];

        const allOptions = [...commonOptions, ...(isChannelMember ? memberOptions : [])];
        const optionsCount = allOptions.reduce((acc, v) => {
            return v ? acc + 1 : acc;
        }, 0) + (isChannelMember && shouldShowBindings ? 0.5 : 0);

        items.push(
            bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT) +
            (canAddReaction ? REACTION_PICKER_HEIGHT + REACTION_PICKER_MARGIN : 0),
        );
        let extraHeight = 0;
        if (isChannelMember) {
            if (canAddReaction) {
                extraHeight += REACTION_PICKER_HEIGHT + REACTION_PICKER_MARGIN;
            }
        }

        items.push(bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT) + extraHeight);

        if (isChannelMember && shouldShowBindings) {
            items.push('80%');
        }

        return items;
    }, [canCopyPermalink, isChannelMember, canReply, canCopyText, canDelete, canEdit, canMarkAsUnread, canPin, isSystemPost, shouldRenderAi, shouldRenderFollow, canShowReminder, canTranslate, canViewTranslation, shouldShowBindings, canAddReaction]);

    const renderContent = () => {
        return (
            <Scroll
                bounces={false}
                scrollEnabled={enabled}
                {...panResponder.panHandlers}
            >
                {isChannelMember && (
                    <>
                        {canAddReaction &&
                            <ReactionBar
                                postId={post.id}
                            />
                        }
                        {canReply &&
                            <ReplyOption
                                post={post}
                            />
                        }
                        {shouldRenderFollow &&
                            <FollowThreadOption
                                thread={thread}
                            />
                        }
                        {shouldRenderAi &&
                            <AskAi
                                post={post}
                            />
                        }
                        {canMarkAsUnread && !isSystemPost &&
                        <MarkAsUnreadOption
                            post={post}
                            sourceScreen={sourceScreen}
                        />
                        }
                        {canShowReminder &&
                            <IKReminderOption
                                post={post}
                                usage={usage}
                                limits={limits}
                            />
                        }
                        {canViewTranslation &&
                        <ShowTranslationOption
                            postId={post.id}
                        />
                        }
                        {canSavePost &&
                        <SaveOption
                            isSaved={isSaved}
                            postId={post.id}
                        />
                        }
                        {Boolean(canCopyText && post.message) &&
                        <CopyTextOption
                            postMessage={post.messageSource || post.message}
                            sourceScreen={sourceScreen}
                        />}
                        {canPin &&
                        <PinChannelOption
                            isPostPinned={post.isPinned}
                            postId={post.id}
                        />
                        }
                        {canTranslate &&
                            <IKTranslateOption
                                post={post}
                            />
                        }
                        {canEdit && post.type !== PostTypes.VOICE_MESSAGE &&
                        <EditOption
                            post={post}
                            canDelete={canDelete}
                        />
                        }
                        {shouldShowBindings &&
                        <AppBindingsPostOptions
                            post={post}
                            serverUrl={serverUrl}
                            bindings={bindings}
                        />
                        }
                    </>
                )}

                {canCopyPermalink &&
                <CopyPermalinkOption
                    post={post}
                    sourceScreen={sourceScreen}
                />
                }
                {isChannelMember && (
                    <>
                        {canDelete &&
                        <DeletePostOption
                            combinedPost={combinedPost}
                            post={post}
                            currentUser={currentUser}
                        />}
                    </>
                )}
            </Scroll>
        );
    };

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={POST_OPTIONS_BUTTON}
            componentId={Screens.POST_OPTIONS}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            scrollable={true}
            testID='post_options'
        />
    );
};

export default React.memo(PostOptions);
