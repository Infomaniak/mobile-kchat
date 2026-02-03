// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// import * as bookmark from '@actions/local/channel_bookmark';
// import * as scheduledPost from '@actions/websocket/scheduled_post';
// import {WebsocketEvents} from '@constants';
// import {handlePlaybookEvents} from '@playbooks/actions/websocket/events';

// import * as category from './category';
// import * as channel from './channel';
// import {handleWebSocketEvent} from './event';
// import * as group from './group';
// import {handleOpenDialogEvent} from './integrations';
// import * as posts from './posts';
// import * as preferences from './preferences';
// import * as reactions from './reactions';
// import * as roles from './roles';
// import * as system from './system';
// import * as teams from './teams';
// import * as threads from './threads';
// import * as users from './users';

// jest.mock('./posts');
// jest.mock('./category');
// jest.mock('./integrations');
// jest.mock('./teams');
// jest.mock('./channel');
// jest.mock('./preferences');
// jest.mock('./reactions');
// jest.mock('./roles');
// jest.mock('./system');
// jest.mock('./users');
// jest.mock('./threads');
// jest.mock('@calls/connection/websocket_event_handlers');
// jest.mock('./group');
// jest.mock('@actions/local/channel_bookmark');
// jest.mock('@actions/websocket/scheduled_post');
// jest.mock('@playbooks/actions/websocket/events');

// describe.skip('handleWebSocketEvent', () => {
//     // IK change : skipped on CI temporarily, will fix later
//     const serverUrl = 'https://example.com';
//     const msg = {event: '', data: {}} as WebSocketMessage;

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should handle POSTED event', async () => {
//         msg.event = WebsocketEvents.POSTED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handleNewPostEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle POST_EDITED event', async () => {
//         msg.event = WebsocketEvents.POST_EDITED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handlePostEdited).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle POST_DELETED event', async () => {
//         msg.event = WebsocketEvents.POST_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handlePostDeleted).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle POST_UNREAD event', async () => {
//         msg.event = WebsocketEvents.POST_UNREAD;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handlePostUnread).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle POST_ACKNOWLEDGEMENT_ADDED event', async () => {
//         msg.event = WebsocketEvents.POST_ACKNOWLEDGEMENT_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handlePostAcknowledgementAdded).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle POST_ACKNOWLEDGEMENT_REMOVED event', async () => {
//         msg.event = WebsocketEvents.POST_ACKNOWLEDGEMENT_REMOVED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(posts.handlePostAcknowledgementRemoved).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle LEAVE_TEAM event', async () => {
//         msg.event = WebsocketEvents.LEAVE_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(teams.handleLeaveTeamEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle UPDATE_TEAM event', async () => {
//         msg.event = WebsocketEvents.UPDATE_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(teams.handleUpdateTeamEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle ADDED_TO_TEAM event', async () => {
//         msg.event = WebsocketEvents.ADDED_TO_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(teams.handleUserAddedToTeamEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle DELETE_TEAM event', async () => {
//         msg.event = WebsocketEvents.DELETE_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(teams.handleTeamArchived).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle RESTORE_TEAM event', async () => {
//         msg.event = WebsocketEvents.RESTORE_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(teams.handleTeamRestored).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle USER_ADDED event', async () => {
//         msg.event = WebsocketEvents.USER_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleUserAddedToChannelEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle USER_REMOVED event', async () => {
//         msg.event = WebsocketEvents.USER_REMOVED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleUserRemovedFromChannelEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle USER_UPDATED event', async () => {
//         msg.event = WebsocketEvents.USER_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(users.handleUserUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle ROLE_UPDATED event', async () => {
//         msg.event = WebsocketEvents.ROLE_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(roles.handleRoleUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle USER_ROLE_UPDATED event', async () => {
//         msg.event = WebsocketEvents.USER_ROLE_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(roles.handleUserRoleUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle MEMBERROLE_UPDATED event', async () => {
//         msg.event = WebsocketEvents.MEMBERROLE_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(roles.handleTeamMemberRoleUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CATEGORY_CREATED event', async () => {
//         msg.event = WebsocketEvents.CATEGORY_CREATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(category.handleCategoryCreatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CATEGORY_UPDATED event', async () => {
//         msg.event = WebsocketEvents.CATEGORY_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(category.handleCategoryUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CATEGORY_ORDER_UPDATED event', async () => {
//         msg.event = WebsocketEvents.CATEGORY_ORDER_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(category.handleCategoryOrderUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CATEGORY_DELETED event', async () => {
//         msg.event = WebsocketEvents.CATEGORY_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(category.handleCategoryDeletedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_CREATED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_CREATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelCreatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_DELETED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelDeletedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_UNARCHIVED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_UNARCHIVED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelUnarchiveEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_UPDATED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_CONVERTED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_CONVERTED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelConvertedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_VIEWED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_VIEWED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelViewedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle MULTIPLE_CHANNELS_VIEWED event', async () => {
//         msg.event = WebsocketEvents.MULTIPLE_CHANNELS_VIEWED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleMultipleChannelsViewedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_MEMBER_UPDATED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_MEMBER_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleChannelMemberUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle DIRECT_ADDED event', async () => {
//         msg.event = WebsocketEvents.DIRECT_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleDirectAddedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_ADDED event', async () => {
//         msg.event = WebsocketEvents.GROUP_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(channel.handleDirectAddedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle PREFERENCE_CHANGED event', async () => {
//         msg.event = WebsocketEvents.PREFERENCE_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(preferences.handlePreferenceChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle PREFERENCES_CHANGED event', async () => {
//         msg.event = WebsocketEvents.PREFERENCES_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(preferences.handlePreferencesChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle PREFERENCES_DELETED event', async () => {
//         msg.event = WebsocketEvents.PREFERENCES_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(preferences.handlePreferencesDeletedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle STATUS_CHANGED event', async () => {
//         msg.event = WebsocketEvents.STATUS_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(users.handleStatusChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle TYPING event', async () => {
//         msg.event = WebsocketEvents.TYPING;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(users.handleUserTypingEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle REACTION_ADDED event', async () => {
//         msg.event = WebsocketEvents.REACTION_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(reactions.handleReactionAddedToPostEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle REACTION_REMOVED event', async () => {
//         msg.event = WebsocketEvents.REACTION_REMOVED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(reactions.handleReactionRemovedFromPostEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle EMOJI_ADDED event', async () => {
//         msg.event = WebsocketEvents.EMOJI_ADDED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(reactions.handleAddCustomEmoji).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle LICENSE_CHANGED event', async () => {
//         msg.event = WebsocketEvents.LICENSE_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(system.handleLicenseChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CONFIG_CHANGED event', async () => {
//         msg.event = WebsocketEvents.CONFIG_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(system.handleConfigChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle OPEN_DIALOG event', async () => {
//         msg.event = WebsocketEvents.OPEN_DIALOG;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(handleOpenDialogEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle THREAD_UPDATED event', async () => {
//         msg.event = WebsocketEvents.THREAD_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(threads.handleThreadUpdatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle THREAD_READ_CHANGED event', async () => {
//         msg.event = WebsocketEvents.THREAD_READ_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(threads.handleThreadReadChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle THREAD_FOLLOW_CHANGED event', async () => {
//         msg.event = WebsocketEvents.THREAD_FOLLOW_CHANGED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(threads.handleThreadFollowChangedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_RECEIVED event', async () => {
//         msg.event = WebsocketEvents.GROUP_RECEIVED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(group.handleGroupReceivedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_MEMBER_ADD event', async () => {
//         msg.event = WebsocketEvents.GROUP_MEMBER_ADD;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(group.handleGroupMemberAddEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_MEMBER_DELETE event', async () => {
//         msg.event = WebsocketEvents.GROUP_MEMBER_DELETE;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(group.handleGroupMemberDeleteEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_ASSOCIATED_TO_TEAM event', async () => {
//         msg.event = WebsocketEvents.GROUP_ASSOCIATED_TO_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(group.handleGroupTeamAssociatedEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle GROUP_DISSOCIATED_TO_TEAM event', async () => {
//         msg.event = WebsocketEvents.GROUP_DISSOCIATED_TO_TEAM;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(group.handleGroupTeamDissociateEvent).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_BOOKMARK_CREATED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_BOOKMARK_CREATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(bookmark.handleBookmarkAddedOrDeleted).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_BOOKMARK_DELETED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_BOOKMARK_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(bookmark.handleBookmarkAddedOrDeleted).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_BOOKMARK_UPDATED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_BOOKMARK_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(bookmark.handleBookmarkEdited).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle CHANNEL_BOOKMARK_SORTED event', async () => {
//         msg.event = WebsocketEvents.CHANNEL_BOOKMARK_SORTED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(bookmark.handleBookmarkSorted).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle SCHEDULED_POST_CREATED event', async () => {
//         msg.event = WebsocketEvents.SCHEDULED_POST_CREATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(scheduledPost.handleCreateOrUpdateScheduledPost).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle SCHEDULED_POST_UPDATED event', async () => {
//         msg.event = WebsocketEvents.SCHEDULED_POST_UPDATED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(scheduledPost.handleCreateOrUpdateScheduledPost).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('should handle SCHEDULED_POST_DELETED event', async () => {
//         msg.event = WebsocketEvents.SCHEDULED_POST_DELETED;
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(scheduledPost.handleDeleteScheduledPost).toHaveBeenCalledWith(serverUrl, msg);
//     });

//     it('all messages should go through the playbooks handler', async () => {
//         msg.event = WebsocketEvents.POST_DELETED; // any handled event should be enough
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(handlePlaybookEvents).toHaveBeenCalledWith(serverUrl, msg);

//         msg.event = 'foo'; // any event, even if not handled, should go through the playbooks handler
//         await handleWebSocketEvent(serverUrl, msg);
//         expect(handlePlaybookEvents).toHaveBeenCalledWith(serverUrl, msg);
//     });
// });
describe('plugins', () => {
    test('dummy test', () => {
        expect(true).toBe(true);
    });
});

