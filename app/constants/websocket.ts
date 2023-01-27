// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Calls from '@constants/calls';

const WebsocketEvents = {
    POSTED: 'posted',
    POST_EDITED: 'post_edited',
    POST_DELETED: 'post_deleted',
    POST_UNREAD: 'post_unread',
    CATEGORY_CREATED: 'sidebar_category_created',
    CATEGORY_UPDATED: 'sidebar_category_updated',
    CATEGORY_DELETED: 'sidebar_category_deleted',
    CATEGORY_ORDER_UPDATED: 'sidebar_category_order_updated',
    CHANNEL_CONVERTED: 'channel_converted',
    CHANNEL_CREATED: 'channel_created',
    CHANNEL_DELETED: 'channel_deleted',
    CHANNEL_UNARCHIVED: 'channel_restored',
    CHANNEL_UPDATED: 'channel_updated',
    CHANNEL_VIEWED: 'channel_viewed',
    CHANNEL_MEMBER_UPDATED: 'channel_member_updated',
    CHANNEL_SCHEME_UPDATED: 'channel_scheme_updated',
    DIRECT_ADDED: 'direct_added',
    GROUP_ADDED: 'group_added', // Added to a group channel
    ADDED_TO_TEAM: 'added_to_team',
    LEAVE_TEAM: 'leave_team',
    UPDATE_TEAM: 'update_team',
    USER_ADDED: 'user_added',
    USER_REMOVED: 'user_removed',
    USER_UPDATED: 'user_updated',
    USER_ROLE_UPDATED: 'user_role_updated',
    ROLE_UPDATED: 'role_updated',
    TYPING: 'client-user_typing',
    STOP_TYPING: 'stop_typing',
    PREFERENCE_CHANGED: 'preference_changed',
    PREFERENCES_CHANGED: 'preferences_changed',
    PREFERENCES_DELETED: 'preferences_deleted',
    EPHEMERAL_MESSAGE: 'ephemeral_message',
    STATUS_CHANGED: 'status_change',
    HELLO: 'hello',
    WEBRTC: 'webrtc',
    REACTION_ADDED: 'reaction_added',
    REACTION_REMOVED: 'reaction_removed',
    EMOJI_ADDED: 'emoji_added',
    LICENSE_CHANGED: 'license_changed',
    CONFIG_CHANGED: 'config_changed',
    PLUGIN_STATUSES_CHANGED: 'plugin_statuses_changed',
    OPEN_DIALOG: 'open_dialog',
    INCREASE_POST_VISIBILITY_BY_ONE: 'increase_post_visibility_by_one',
    MEMBERROLE_UPDATED: 'memberrole_updated',
    THREAD_UPDATED: 'thread_updated',
    THREAD_FOLLOW_CHANGED: 'thread_follow_changed',
    THREAD_READ_CHANGED: 'thread_read_changed',
    DELETE_TEAM: 'delete_team',
    RESTORE_TEAM: 'restore_team',
    APPS_FRAMEWORK_REFRESH_BINDINGS: 'custom_com.mattermost.apps_refresh_bindings',
    CALLS_CHANNEL_ENABLED: `custom_${Calls.PluginId}_channel_enable_voice`,
    CALLS_CHANNEL_DISABLED: `custom_${Calls.PluginId}_channel_disable_voice`,
    CALLS_USER_CONNECTED: `custom_${Calls.PluginId}_user_connected`,
    CALLS_USER_DISCONNECTED: `custom_${Calls.PluginId}_user_disconnected`,
    CALLS_USER_MUTED: `custom_${Calls.PluginId}_user_muted`,
    CALLS_USER_UNMUTED: `custom_${Calls.PluginId}_user_unmuted`,
    CALLS_USER_VOICE_ON: `custom_${Calls.PluginId}_user_voice_on`,
    CALLS_USER_VOICE_OFF: `custom_${Calls.PluginId}_user_voice_off`,
    CALLS_CALL_START: `custom_${Calls.PluginId}_call_start`,
    CALLS_CALL_END: `custom_${Calls.PluginId}_call_end`,
    CALLS_SCREEN_ON: `custom_${Calls.PluginId}_user_screen_on`,
    CALLS_SCREEN_OFF: `custom_${Calls.PluginId}_user_screen_off`,
    CALLS_USER_RAISE_HAND: `custom_${Calls.PluginId}_user_raise_hand`,
    CALLS_USER_UNRAISE_HAND: `custom_${Calls.PluginId}_user_unraise_hand`,
    CALLS_USER_REACTED: `custom_${Calls.PluginId}_user_reacted`,
    CALLS_RECORDING_STATE: `custom_${Calls.PluginId}_call_recording_state`,
    CALLS_HOST_CHANGED: `custom_${Calls.PluginId}_call_host_changed`,
    GROUP_RECEIVED: 'received_group',
    GROUP_MEMBER_ADD: 'group_member_add',
    GROUP_MEMBER_DELETE: 'group_member_delete',
    GROUP_ASSOCIATED_TO_TEAM: 'received_group_associated_to_team',
    GROUP_DISSOCIATED_TO_TEAM: 'received_group_not_associated_to_team',
    GROUP_ASSOCIATED_TO_CHANNEL: 'received_group_associated_to_channel',
    GROUP_DISSOCIATED_TO_CHANNEL: 'received_group_not_associated_to_channel',
    KSUITE_ADDED: 'ksuite_added',
    KSUITE_DELETED: 'ksuite_deleted',
};
export default WebsocketEvents;
