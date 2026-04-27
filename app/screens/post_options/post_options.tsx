// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useManagedConfig} from '@mattermost/react-native-emm';
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
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet} from '@screens/navigation';
import BORReadReceipts, {BOR_READ_RECEIPTS_HEIGHT} from '@screens/post_options/bor_read_receipts';
import IKReminderOption from '@screens/post_options/options/ik_reminder_option';
import IKTranslateOption from '@screens/post_options/options/ik_translate_option';
import {isOwnBoRPost, isUnrevealedBoRPost} from '@utils/bor';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {isSystemMessage} from '@utils/post';

import AppBindingsPostOptions from './options/app_bindings_post_option';
import AskAi from './options/ask_ai';
import DeletePostOption from './options/delete_post_option';
import EditOption from './options/edit_option';
import JumpToPostOption from './options/jump_to_post_option';
import MarkAsUnreadOption from './options/mark_unread_option';
import PinChannelOption from './options/pin_channel_option';
import ReactionBar from './reaction_bar';

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type {BurnOnReadRecipientData} from '@typings/components/post_options';
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
    componentId: AvailableScreens;
    bindings: AppBinding[];
    serverUrl: string;
    limits: LimitModel;
    usage: CloudUsageModel;
    isBoRPost?: boolean;
    showBoRReadReceipts?: boolean;
    borReceiptData?: BurnOnReadRecipientData;
    currentUser?: UserModel;
};
const PostOptions = ({
    canAddReaction, canDelete, canEdit,
    canMarkAsUnread, canPin, canReply, canViewTranslation,
    combinedPost, componentId, isSaved,
    sourceScreen, post, thread, bindings, serverUrl,
    usage, limits,
    isBoRPost, showBoRReadReceipts, borReceiptData, currentUser,
    isChannelMember = true,
}: PostOptionsProps) => {
    const managedConfig = useManagedConfig<ManagedConfig>();
    const isTablet = useIsTablet();
    const {enabled, panResponder} = useBottomSheetListsFix();
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);

    const close = () => {
        return dismissBottomSheet(Screens.POST_OPTIONS);
    };

    useNavButtonPressed(POST_OPTIONS_BUTTON, componentId, close, []);

    const isSystemPost = isSystemMessage(post);

    const canCopyBoRPostPermalink = isBoRPost ? post.userId === currentUser?.id : true;
    const canCopyPermalink = !isSystemPost && managedConfig?.copyAndPasteProtection !== 'true' && canCopyBoRPostPermalink;
    const canCopyText = canCopyPermalink && post.message && !isBoRPost;

    const canSavePost = !isSystemPost && (!isUnrevealedBoRPost(post) || isOwnBoRPost(post, currentUser?.id));

    const shouldRenderFollow = !(sourceScreen !== Screens.CHANNEL || !thread);
    const shouldShowBindings = bindings.length > 0 && !isSystemPost;
    const shouldRenderAi = !isSystemPost && !post.rootId;
    const canShowReminder = !isSystemPost;
    const canTranslate = !isSystemPost;

    const shouldShowBORReadReceipts = showBoRReadReceipts && borReceiptData;

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const optionsCount = [
            isChannelMember,
            canCopyPermalink, canReply, canCopyText, canDelete, canEdit,
            canMarkAsUnread, canPin, !isSystemPost, shouldRenderAi, shouldRenderFollow, canShowReminder, canTranslate, canViewTranslation,
        ].reduce((acc, v) => {
            return v ? acc + 1 : acc;
        }, 0) + (shouldShowBindings ? 0.5 : 0);

        items.push(
            bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT) +
            (canAddReaction ? REACTION_PICKER_HEIGHT + REACTION_PICKER_MARGIN : 0) +
            (shouldShowBORReadReceipts ? BOR_READ_RECEIPTS_HEIGHT : 0),
        );

        if (shouldShowBindings) {
            items.push('80%');
        }

        return items;
    }, [isChannelMember, canCopyPermalink, canReply, canCopyText, canDelete, canEdit, canMarkAsUnread, canPin, isSystemPost, shouldRenderAi, shouldRenderFollow, canShowReminder, canTranslate, canViewTranslation, shouldShowBindings, canAddReaction, shouldShowBORReadReceipts]);

    const renderContent = () => {
        return (
            <Scroll
                bounces={false}
                scrollEnabled={enabled}
                {...panResponder.panHandlers}
            >
                {!isChannelMember &&
                    <JumpToPostOption
                        bottomSheetId={Screens.POST_OPTIONS}
                        post={post}
                    />
                }
                {isChannelMember && shouldShowBORReadReceipts &&
                    <BORReadReceipts
                        totalReceipts={borReceiptData.totalRecipients}
                        readReceipts={borReceiptData.revealedCount}
                    />
                }
                {isChannelMember && canAddReaction &&
                    <ReactionBar
                        bottomSheetId={Screens.POST_OPTIONS}
                        postId={post.id}
                    />
                }
                {isChannelMember && canReply &&
                    <ReplyOption
                        bottomSheetId={Screens.POST_OPTIONS}
                        post={post}
                    />
                }
                {isChannelMember && shouldRenderFollow &&
                    <FollowThreadOption
                        bottomSheetId={Screens.POST_OPTIONS}
                        thread={thread}
                    />
                }
                {isChannelMember && shouldRenderAi &&
                    <AskAi
                        bottomSheetId={Screens.POST_OPTIONS}
                        post={post}
                    />
                }
                {isChannelMember && canMarkAsUnread && !isSystemPost &&
                <MarkAsUnreadOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    post={post}
                    sourceScreen={sourceScreen}
                />
                }
                {isChannelMember && canShowReminder &&
                    <IKReminderOption
                        bottomSheetId={Screens.POST_OPTIONS}
                        post={post}
                        usage={usage}
                        limits={limits}
                    />
                }
                {isChannelMember && canCopyPermalink &&
                <CopyPermalinkOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    post={post}
                    sourceScreen={sourceScreen}
                />
                }
                {isChannelMember && canViewTranslation &&
                <ShowTranslationOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    postId={post.id}
                />
                }
                {isChannelMember && canSavePost &&
                <SaveOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    isSaved={isSaved}
                    postId={post.id}
                />
                }
                {isChannelMember && Boolean(canCopyText && post.message) &&
                <CopyTextOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    postMessage={post.messageSource || post.message}
                    sourceScreen={sourceScreen}
                />}
                {isChannelMember && canPin &&
                <PinChannelOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    isPostPinned={post.isPinned}
                    postId={post.id}
                />
                }
                {isChannelMember && canTranslate &&
                    <IKTranslateOption
                        bottomSheetId={Screens.POST_OPTIONS}
                        post={post}
                    />
                }
                {isChannelMember && canEdit && post.type !== PostTypes.VOICE_MESSAGE &&
                <EditOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    post={post}
                    canDelete={canDelete}
                />
                }
                {isChannelMember && canDelete &&
                <DeletePostOption
                    bottomSheetId={Screens.POST_OPTIONS}
                    combinedPost={combinedPost}
                    post={post}
                    currentUser={currentUser}
                />}
                {isChannelMember && shouldShowBindings &&
                <AppBindingsPostOptions
                    bottomSheetId={Screens.POST_OPTIONS}
                    post={post}
                    serverUrl={serverUrl}
                    bindings={bindings}
                />
                }
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
            testID='post_options'
        />
    );
};

export default React.memo(PostOptions);
