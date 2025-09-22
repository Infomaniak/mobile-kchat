// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// import * as calls from '@calls/connection/websocket_event_handlers';
// import * as group from './group';
import * as bookmark from '@actions/local/channel_bookmark';
import * as scheduledPost from '@actions/websocket/scheduled_post';
import {WebsocketEvents} from '@constants';
import {handlePlaybookEvents} from '@playbooks/actions/websocket/events';

import * as category from './category';
import * as channel from './channel';
import {handleConferenceAdded, handleConferenceDeleted, handleConferenceUserConnected, handleConferenceUserDenied, handleConferenceUserDisconnected} from './conference';
import {handleGroupMemberAddEvent, handleGroupMemberDeleteEvent, handleGroupReceivedEvent, handleGroupTeamAssociatedEvent, handleGroupTeamDissociateEvent} from './group';
import {handleTeamSyncEvent} from './ikTeams';
import {handleOpenDialogEvent} from './integrations';
import * as posts from './posts';
import * as preferences from './preferences';
import {handleAddCustomEmoji, handleReactionRemovedFromPostEvent, handleReactionAddedToPostEvent} from './reactions';
import {handleUserRoleUpdatedEvent, handleTeamMemberRoleUpdatedEvent, handleRoleUpdatedEvent} from './roles';
import {handleLicenseChangedEvent, handleConfigChangedEvent} from './system';
import * as teams from './teams';
import {handleThreadUpdatedEvent, handleThreadReadChangedEvent, handleThreadFollowChangedEvent} from './threads';
import {handleLimitationChanged} from './usage';
import {handleUserUpdatedEvent, handleUserTypingEvent, handleStatusChangedEvent, handleCustomProfileAttributesValuesUpdatedEvent, handleCustomProfileAttributesFieldUpdatedEvent, handleCustomProfileAttributesFieldDeletedEvent} from './users';

export async function handleWebSocketEvent(serverUrl: string, msg: WebSocketMessage) {
    switch (msg.event) {
        case WebsocketEvents.POSTED:
        case WebsocketEvents.EPHEMERAL_MESSAGE:
            posts.handleNewPostEvent(serverUrl, msg);
            break;
        case WebsocketEvents.POST_EDITED:
            posts.handlePostEdited(serverUrl, msg);
            break;
        case WebsocketEvents.POST_DELETED:
            posts.handlePostDeleted(serverUrl, msg);
            break;
        case WebsocketEvents.POST_UNREAD:
            posts.handlePostUnread(serverUrl, msg);
            break;
        case WebsocketEvents.POST_ACKNOWLEDGEMENT_ADDED:
            posts.handlePostAcknowledgementAdded(serverUrl, msg);
            break;
        case WebsocketEvents.POST_ACKNOWLEDGEMENT_REMOVED:
            posts.handlePostAcknowledgementRemoved(serverUrl, msg);
            break;

        case WebsocketEvents.LEAVE_TEAM:
            teams.handleLeaveTeamEvent(serverUrl, msg);
            break;
        case WebsocketEvents.UPDATE_TEAM:
            teams.handleUpdateTeamEvent(serverUrl, msg);
            break;
        case WebsocketEvents.ADDED_TO_TEAM:
            teams.handleUserAddedToTeamEvent(serverUrl, msg);
            break;
        case WebsocketEvents.DELETE_TEAM:
            teams.handleTeamArchived(serverUrl, msg);
            break;
        case WebsocketEvents.RESTORE_TEAM:
            teams.handleTeamRestored(serverUrl, msg);
            break;

        case WebsocketEvents.USER_ADDED:
            channel.handleUserAddedToChannelEvent(serverUrl, msg);
            break;
        case WebsocketEvents.USER_REMOVED:
            channel.handleUserRemovedFromChannelEvent(serverUrl, msg);
            break;
        case WebsocketEvents.USER_UPDATED:
            handleUserUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.ROLE_UPDATED:
            handleRoleUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.USER_ROLE_UPDATED:
            handleUserRoleUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.MEMBERROLE_UPDATED:
            handleTeamMemberRoleUpdatedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.CATEGORY_CREATED:
            category.handleCategoryCreatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CATEGORY_UPDATED:
            category.handleCategoryUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CATEGORY_ORDER_UPDATED:
            category.handleCategoryOrderUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CATEGORY_DELETED:
            category.handleCategoryDeletedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.CHANNEL_CREATED:
            channel.handleChannelCreatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_DELETED:
            channel.handleChannelDeletedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_UNARCHIVED:
            channel.handleChannelUnarchiveEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_UPDATED:
            channel.handleChannelUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_CONVERTED:
            channel.handleChannelConvertedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_VIEWED:
            channel.handleChannelViewedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.MULTIPLE_CHANNELS_VIEWED:
            channel.handleMultipleChannelsViewedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_MEMBER_UPDATED:
            channel.handleChannelMemberUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_SCHEME_UPDATED:
            // Do nothing, handled by CHANNEL_UPDATED due to changes in the channel scheme.
            break;
        case WebsocketEvents.DIRECT_ADDED:
        case WebsocketEvents.GROUP_ADDED:
            channel.handleDirectAddedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.PREFERENCE_CHANGED:
            preferences.handlePreferenceChangedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.PREFERENCES_CHANGED:
            preferences.handlePreferencesChangedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.PREFERENCES_DELETED:
            preferences.handlePreferencesDeletedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.STATUS_CHANGED:
            handleStatusChangedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.TYPING:
            handleUserTypingEvent(serverUrl, msg);
            break;

        case WebsocketEvents.REACTION_ADDED:
            handleReactionAddedToPostEvent(serverUrl, msg);
            break;
        case WebsocketEvents.REACTION_REMOVED:
            handleReactionRemovedFromPostEvent(serverUrl, msg);
            break;
        case WebsocketEvents.EMOJI_ADDED:
            handleAddCustomEmoji(serverUrl, msg);
            break;

        case WebsocketEvents.LICENSE_CHANGED:
            handleLicenseChangedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.CONFIG_CHANGED:
            handleConfigChangedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.OPEN_DIALOG:
            handleOpenDialogEvent(serverUrl, msg);
            break;
        case WebsocketEvents.APPS_FRAMEWORK_REFRESH_BINDINGS:
            break;

        case WebsocketEvents.THREAD_UPDATED:
            handleThreadUpdatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.THREAD_READ_CHANGED:
            handleThreadReadChangedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.THREAD_FOLLOW_CHANGED:
            handleThreadFollowChangedEvent(serverUrl, msg);
            break;

        // kMeet
        case WebsocketEvents.CONFERENCE_ADDED:
            handleConferenceAdded(serverUrl, msg);
            break;
        case WebsocketEvents.CONFERENCE_DELETED:
            handleConferenceDeleted(serverUrl, msg);
            break;
        case WebsocketEvents.CONFERENCE_USER_CONNECTED:
            handleConferenceUserConnected(serverUrl, msg);
            break;
        case WebsocketEvents.CONFERENCE_USER_DENIED:
            handleConferenceUserDenied(serverUrl, msg);
            break;
        case WebsocketEvents.CONFERENCE_USER_DISCONNECTED:
            handleConferenceUserDisconnected(serverUrl, msg);
            break;

        // Plugins
        case WebsocketEvents.PLUGIN_STATUSES_CHANGED:
        case WebsocketEvents.PLUGIN_ENABLED:
        case WebsocketEvents.PLUGIN_DISABLED:
            // Do nothing, this event doesn't need logic in the mobile app
            break;

        // bookmarks
        case WebsocketEvents.CHANNEL_BOOKMARK_CREATED:
        case WebsocketEvents.CHANNEL_BOOKMARK_DELETED:
            bookmark.handleBookmarkAddedOrDeleted(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_BOOKMARK_UPDATED:
            bookmark.handleBookmarkEdited(serverUrl, msg);
            break;
        case WebsocketEvents.CHANNEL_BOOKMARK_SORTED:
            bookmark.handleBookmarkSorted(serverUrl, msg);
            break;

        // scheduled posts
        case WebsocketEvents.SCHEDULED_POST_CREATED:
        case WebsocketEvents.SCHEDULED_POST_UPDATED:
            scheduledPost.handleCreateOrUpdateScheduledPost(serverUrl, msg);
            break;
        case WebsocketEvents.SCHEDULED_POST_DELETED:
            scheduledPost.handleDeleteScheduledPost(serverUrl, msg);
            break;
        case WebsocketEvents.CUSTOM_PROFILE_ATTRIBUTES_VALUES_UPDATED:
            handleCustomProfileAttributesValuesUpdatedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.CUSTOM_PROFILE_ATTRIBUTES_FIELD_UPDATED:
        case WebsocketEvents.CUSTOM_PROFILE_ATTRIBUTES_FIELD_CREATED:
            handleCustomProfileAttributesFieldUpdatedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.CUSTOM_PROFILE_ATTRIBUTES_FIELD_DELETED:
            handleCustomProfileAttributesFieldDeletedEvent(serverUrl, msg);
            break;

        case WebsocketEvents.GROUP_RECEIVED:
            handleGroupReceivedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.GROUP_MEMBER_ADD:
            handleGroupMemberAddEvent(serverUrl, msg);
            break;
        case WebsocketEvents.GROUP_MEMBER_DELETE:
            handleGroupMemberDeleteEvent(serverUrl, msg);
            break;
        case WebsocketEvents.GROUP_ASSOCIATED_TO_TEAM:
            handleGroupTeamAssociatedEvent(serverUrl, msg);
            break;
        case WebsocketEvents.GROUP_DISSOCIATED_TO_TEAM:
            handleGroupTeamDissociateEvent(serverUrl, msg);
            break;
        case WebsocketEvents.GROUP_ASSOCIATED_TO_CHANNEL:
            break;
        case WebsocketEvents.GROUP_DISSOCIATED_TO_CHANNEL:
            break;
        case WebsocketEvents.KSUITE_ADDED:
            handleTeamSyncEvent(serverUrl);
            break;
        case WebsocketEvents.KSUITE_DELETED:
            handleTeamSyncEvent(serverUrl);
            break;
        case WebsocketEvents.QUOTA_CHANGED:
            handleLimitationChanged(serverUrl);
            break;

    }
    handlePlaybookEvents(serverUrl, msg);
}
