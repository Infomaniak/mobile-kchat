// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AGENTS_REWRITE_OPTIONS} from '@agents/constants/screens';

const ABOUT = 'about';
const ACCOUNT = 'account';
const AI_OPTIONS = 'ai_options';
const APPS_FORM = 'apps_form';
const ATTACHMENT_OPTIONS = 'attachment_options';
const BOTTOM_SHEET = '(bottom_sheet)';
const GENERIC_BOTTOM_SHEET = 'generic_bottom_sheet';
const BROWSE_CHANNELS = 'browse_channels';
const CALL = 'call';
const CALL_PARTICIPANTS = 'call_participants';
const CALL_HOST_CONTROLS = 'call_host_controls';
const CHANNEL = 'channel';
const CHANNEL_ADD_MEMBERS = 'channel_add_members';
const CHANNEL_FILES = 'channel_files';
const CHANNEL_INFO = '(channel_info)';
const CHANNEL_LIST = 'channel_list';
const CHANNEL_NOTIFICATION_PREFERENCES = 'channel_notification_preferences';
const CHANNEL_SETTINGS = 'channel_settings';
const CODE = 'code';
const CONVERT_GM_TO_CHANNEL = 'convert_gm_to_channel';
const CREATE_DIRECT_MESSAGE = 'create_direct_message';
const CREATE_OR_EDIT_CHANNEL = 'create_or_edit_channel';
const COMPONENT_LIBRARY = 'component_library';
const CUSTOM_STATUS = '(custom_status)';
const CUSTOM_STATUS_CLEAR_AFTER = 'custom_status_clear_after';
const DIALOG_ROUTER = 'dialog_router';
const DRAFT = 'draft';
const DRAFT_SCHEDULED_POST_OPTIONS = 'draft_scheduled_post_options';
const EDIT_POST = 'edit_post';
const EDIT_PROFILE = 'edit_profile';
const EDIT_SERVER = 'edit_server';
const EMOJI_PICKER = 'emoji_picker';
const FEEDBACK_OPTIONS = 'feedback_options';
const FIND_CHANNELS = 'find_channels';
const FORGOT_PASSWORD = 'forgot_password';
const GALLERY = 'gallery';
const GLOBAL_DRAFTS = 'global_drafts';
const GLOBAL_THREADS = 'global_threads';
const GROUP_MEMBERS = 'group_members';
const HOME = '(home)';
const IK_EVOLVE = 'ik_evolve';
const IK_LOGIN = 'ik_login';
const IK_NO_TEAMS = 'ik_no_teams';
const IK_QUOTA_EXCEEDED = 'ik_quota_exceeded';
const IK_REMINDER = 'ik_reminder';
const INTEGRATION_SELECTOR = 'integration_selector';
const INTERACTIVE_DIALOG = 'interactive_dialog';
const INVITE = 'invite';
const IN_APP_NOTIFICATION = 'in_app_notification';
const JOIN_TEAM = 'join_team';
const LATEX = 'latex';
const LEAVE_CHANNEL_MEMBERS = 'leave_channel_members';
const LOGIN = 'login';
const MANAGE_CHANNEL_MEMBERS = 'manage_channel_members';
const MENTIONS = 'mentions';
const MFA = 'mfa';
const ONBOARDING = 'onboarding';
const PDF_VIEWER = 'pdf_viewer';
const PERMALINK = 'permalink';
const PINNED_MESSAGES = 'pinned_messages';
const POST_OPTIONS = 'post_options';
const POST_PRIORITY_PICKER = 'post_priority_picker';
const REACTIONS = 'reactions';
const REPORT_PROBLEM = 'report_problem';
const RESCHEDULE_DRAFT = 'reschedule_draft';
const REVIEW_APP = 'review_app';
const SAVED_MESSAGES = 'saved_messages';
const SCHEDULED_POST_OPTIONS = 'scheduled_post_options';
const SEARCH = 'search';
const SELECT_TEAM = 'select_team';
const SEND_FEEDBACK = 'send_feedback';
const SERVER = 'server';
const SETTINGS = '(settings)';
const SETTINGS_ADVANCED = 'settings_advanced';
const SETTINGS_DISPLAY = 'settings_display';
const SETTINGS_DISPLAY_CLOCK = 'settings_display_clock';
const SETTINGS_DISPLAY_CRT = 'settings_display_crt';
const SETTINGS_DISPLAY_THEME = 'settings_display_theme';
const SETTINGS_DISPLAY_TIMEZONE = 'settings_display_timezone';
const SETTINGS_DISPLAY_TIMEZONE_SELECT = 'settings_display_timezone_select';
const SETTINGS_NOTIFICATION = 'settings_notification';
const SETTINGS_NOTIFICATION_AUTO_RESPONDER = 'settings_notification_auto_responder';
const SETTINGS_NOTIFICATION_EMAIL = 'settings_notification_email';
const SETTINGS_NOTIFICATION_MENTION = 'settings_notification_mention';
const SETTINGS_NOTIFICATION_PUSH = 'settings_notification_push';
const SETTINGS_NOTIFICATION_CALL = 'settings_notification_call';
const SHARE_FEEDBACK = 'share_feedback';
const SNACK_BAR = 'snack_bar';
const TABLE = 'table';
const TEAM_SELECTOR_LIST = 'team_selector_list';
const TERMS_OF_SERVICE = 'terms_of_service';
const THREAD = 'thread';
const THREAD_FOLLOW_BUTTON = 'thread_follow_button';
const THREAD_OPTIONS = 'thread_options';
const USER_PROFILE = 'user_profile';
const DEBUG_PERFORMANCE = 'debug_performance';
const SHOW_TRANSLATION = 'show_translation';

export default {
    ABOUT,
    ACCOUNT,
    AI_OPTIONS,
    APPS_FORM,
    ATTACHMENT_OPTIONS,
    BOTTOM_SHEET,
    GENERIC_BOTTOM_SHEET,
    BROWSE_CHANNELS,
    CALL,
    CALL_PARTICIPANTS,
    CALL_HOST_CONTROLS,
    CHANNEL,
    CHANNEL_ADD_MEMBERS,
    CHANNEL_FILES,
    CHANNEL_INFO,
    CHANNEL_LIST,
    CHANNEL_NOTIFICATION_PREFERENCES,
    CHANNEL_SETTINGS,
    CODE,
    CONVERT_GM_TO_CHANNEL,
    COMPONENT_LIBRARY,
    CREATE_DIRECT_MESSAGE,
    CREATE_OR_EDIT_CHANNEL,
    CUSTOM_STATUS,
    CUSTOM_STATUS_CLEAR_AFTER,
    DIALOG_ROUTER,
    DRAFT,
    DRAFT_SCHEDULED_POST_OPTIONS,
    EDIT_POST,
    EDIT_PROFILE,
    EDIT_SERVER,
    EMOJI_PICKER,
    FEEDBACK_OPTIONS,
    FIND_CHANNELS,
    FORGOT_PASSWORD,
    GALLERY,
    GLOBAL_DRAFTS,
    GLOBAL_THREADS,
    GROUP_MEMBERS,
    HOME,
    IK_EVOLVE,
    IK_LOGIN,
    IK_NO_TEAMS,
    IK_QUOTA_EXCEEDED,
    IK_REMINDER,
    INTEGRATION_SELECTOR,
    INTERACTIVE_DIALOG,
    INVITE,
    IN_APP_NOTIFICATION,
    JOIN_TEAM,
    LATEX,
    LEAVE_CHANNEL_MEMBERS,
    LOGIN,
    MANAGE_CHANNEL_MEMBERS,
    MENTIONS,
    MFA,
    ONBOARDING,
    PDF_VIEWER,
    PERMALINK,
    PINNED_MESSAGES,
    POST_OPTIONS,
    POST_PRIORITY_PICKER,
    REACTIONS,
    REPORT_PROBLEM,
    RESCHEDULE_DRAFT,
    REVIEW_APP,
    SAVED_MESSAGES,
    SCHEDULED_POST_OPTIONS,
    SEARCH,
    SELECT_TEAM,
    SEND_FEEDBACK,
    SERVER,
    SETTINGS,
    SETTINGS_ADVANCED,
    SETTINGS_DISPLAY,
    SETTINGS_DISPLAY_CLOCK,
    SETTINGS_DISPLAY_CRT,
    SETTINGS_DISPLAY_THEME,
    SETTINGS_DISPLAY_TIMEZONE,
    SETTINGS_DISPLAY_TIMEZONE_SELECT,
    SETTINGS_NOTIFICATION,
    SETTINGS_NOTIFICATION_AUTO_RESPONDER,
    SETTINGS_NOTIFICATION_EMAIL,
    SETTINGS_NOTIFICATION_MENTION,
    SETTINGS_NOTIFICATION_PUSH,
    SETTINGS_NOTIFICATION_CALL,
    SHARE_FEEDBACK,
    SNACK_BAR,
    TABLE,
    TEAM_SELECTOR_LIST,
    TERMS_OF_SERVICE,
    THREAD,
    THREAD_FOLLOW_BUTTON,
    THREAD_OPTIONS,
    USER_PROFILE,
    DEBUG_PERFORMANCE,
    SHOW_TRANSLATION,
    AGENTS_REWRITE_OPTIONS,
} as const;

export const MODAL_SCREENS = new Set<string>([
    BROWSE_CHANNELS,
    CHANNEL_INFO,
    CHANNEL_ADD_MEMBERS,
    CREATE_OR_EDIT_CHANNEL,
    CREATE_DIRECT_MESSAGE,
    CUSTOM_STATUS,
    DIALOG_ROUTER,
    EDIT_POST,
    EDIT_PROFILE,
    EDIT_SERVER,
    FIND_CHANNELS,
    FEEDBACK_OPTIONS,
    GALLERY,
    INTEGRATION_SELECTOR,
    INVITE,
    JOIN_TEAM,
    MANAGE_CHANNEL_MEMBERS,
    PDF_VIEWER,
    REPORT_PROBLEM,
    RESCHEDULE_DRAFT,
    SEND_FEEDBACK,
    SETTINGS,
]);

export const SCREENS_AS_BOTTOM_SHEET = new Set<string>([
    GENERIC_BOTTOM_SHEET,
    ATTACHMENT_OPTIONS,
    CALL_PARTICIPANTS,
    CALL_HOST_CONTROLS,
    DRAFT_SCHEDULED_POST_OPTIONS,
    EMOJI_PICKER,
    POST_OPTIONS,
    POST_PRIORITY_PICKER,
    REACTIONS,
    SCHEDULED_POST_OPTIONS,
    TERMS_OF_SERVICE,
    THREAD_OPTIONS,
    USER_PROFILE,
    GROUP_MEMBERS,
    IK_QUOTA_EXCEEDED,
    IK_EVOLVE,
    IK_REMINDER,
    AGENTS_REWRITE_OPTIONS,
    AI_OPTIONS,
]);

export const UNAUTHENTICATED_SCREENS = new Set<string>([
    ONBOARDING,
    SERVER,
    LOGIN,
    MFA,
    FORGOT_PASSWORD,
    IK_LOGIN,
    IK_NO_TEAMS,
]);

export const HOME_TAB_SCREENS = new Set<string>([
    CHANNEL_LIST,
    SEARCH,
    MENTIONS,
    SAVED_MESSAGES,
    ACCOUNT,
]);

export const SCREENS_WITH_TRANSPARENT_BACKGROUND = new Set<string>([
    PERMALINK,
    REVIEW_APP,
    SNACK_BAR,
]);

export const SCREENS_WITH_EXTRA_KEYBOARD = new Set<string>([CHANNEL, THREAD]);

export const NOT_READY: string[] = [];

export const MODAL_SCREENS_WITHOUT_BACK = new Set<string>([
    BROWSE_CHANNELS,
    CHANNEL_INFO,
    CHANNEL_ADD_MEMBERS,
    CREATE_DIRECT_MESSAGE,
    CUSTOM_STATUS,
    EDIT_POST,
    EDIT_PROFILE,
    EDIT_SERVER,
    FIND_CHANNELS,
    GALLERY,
    INVITE,
    MANAGE_CHANNEL_MEMBERS,
    PDF_VIEWER,
    PERMALINK,
    RESCHEDULE_DRAFT,
]);

export {
    ABOUT,
    ACCOUNT,
    AI_OPTIONS,
    APPS_FORM,
    ATTACHMENT_OPTIONS,
    BOTTOM_SHEET,
    GENERIC_BOTTOM_SHEET,
    BROWSE_CHANNELS,
    CALL,
    CALL_PARTICIPANTS,
    CALL_HOST_CONTROLS,
    CHANNEL,
    CHANNEL_ADD_MEMBERS,
    CHANNEL_FILES,
    CHANNEL_INFO,
    CHANNEL_LIST,
    CHANNEL_NOTIFICATION_PREFERENCES,
    CHANNEL_SETTINGS,
    CODE,
    CONVERT_GM_TO_CHANNEL,
    COMPONENT_LIBRARY,
    CREATE_DIRECT_MESSAGE,
    CREATE_OR_EDIT_CHANNEL,
    CUSTOM_STATUS,
    CUSTOM_STATUS_CLEAR_AFTER,
    DIALOG_ROUTER,
    DRAFT,
    DRAFT_SCHEDULED_POST_OPTIONS,
    EDIT_POST,
    EDIT_PROFILE,
    EDIT_SERVER,
    EMOJI_PICKER,
    FEEDBACK_OPTIONS,
    FIND_CHANNELS,
    FORGOT_PASSWORD,
    GALLERY,
    GLOBAL_DRAFTS,
    GLOBAL_THREADS,
    GROUP_MEMBERS,
    HOME,
    IK_EVOLVE,
    IK_LOGIN,
    IK_NO_TEAMS,
    IK_QUOTA_EXCEEDED,
    IK_REMINDER,
    INTEGRATION_SELECTOR,
    INTERACTIVE_DIALOG,
    INVITE,
    IN_APP_NOTIFICATION,
    JOIN_TEAM,
    LATEX,
    LEAVE_CHANNEL_MEMBERS,
    LOGIN,
    MANAGE_CHANNEL_MEMBERS,
    MENTIONS,
    MFA,
    ONBOARDING,
    PDF_VIEWER,
    PERMALINK,
    PINNED_MESSAGES,
    POST_OPTIONS,
    POST_PRIORITY_PICKER,
    REACTIONS,
    REPORT_PROBLEM,
    RESCHEDULE_DRAFT,
    REVIEW_APP,
    SAVED_MESSAGES,
    SCHEDULED_POST_OPTIONS,
    SEARCH,
    SELECT_TEAM,
    SEND_FEEDBACK,
    SERVER,
    SETTINGS,
    SETTINGS_ADVANCED,
    SETTINGS_DISPLAY,
    SETTINGS_DISPLAY_CLOCK,
    SETTINGS_DISPLAY_CRT,
    SETTINGS_DISPLAY_THEME,
    SETTINGS_DISPLAY_TIMEZONE,
    SETTINGS_DISPLAY_TIMEZONE_SELECT,
    SETTINGS_NOTIFICATION,
    SETTINGS_NOTIFICATION_AUTO_RESPONDER,
    SETTINGS_NOTIFICATION_EMAIL,
    SETTINGS_NOTIFICATION_MENTION,
    SETTINGS_NOTIFICATION_PUSH,
    SETTINGS_NOTIFICATION_CALL,
    SHARE_FEEDBACK,
    SNACK_BAR,
    TABLE,
    TEAM_SELECTOR_LIST,
    TERMS_OF_SERVICE,
    THREAD,
    THREAD_FOLLOW_BUTTON,
    THREAD_OPTIONS,
    USER_PROFILE,
    DEBUG_PERFORMANCE,
    SHOW_TRANSLATION,
};
