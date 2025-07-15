// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type LegacyThemeKey = 'default' | 'organization' | 'mattermostDark' | 'windows10';

type LegacyThemeType = 'Mattermost' | 'Organization' | 'Mattermost Dark' | 'Windows Dark';

type ThemeKey = 'infomaniak' | 'denim' | 'sapphire' | 'quartz' | 'indigo' | 'onyx' | 'custom';

type ThemeType = 'Infomaniak' | 'Denim' | 'Sapphire' | 'Quartz' | 'Indigo' | 'Onyx' | 'custom';

type KsuiteThemeKey = 'dark' | 'light' | 'auto'

type Theme = {
    ikName?: string;
    type?: ThemeType | LegacyThemeType;
    ksuiteTheme?: KsuiteThemeKey;
    sidebarBg: string;
    sidebarText: string;
    sidebarUnreadText: string;
    sidebarTextHoverBg: string;
    sidebarTextActiveBorder: string;
    sidebarTextActiveColor: string;
    sidebarHeaderBg: string;
    sidebarHeaderTextColor: string;
    sidebarTeamBarBg: string;
    onlineIndicator: string;
    awayIndicator: string;
    dndIndicator: string;
    mentionBg: string;
    mentionColor: string;
    centerChannelBg: string;
    centerChannelColor: string;
    newMessageSeparator: string;
    linkColor: string;
    buttonBg: string;
    buttonColor: string;
    errorTextColor: string;
    mentionHighlightBg: string;
    mentionHighlightLink: string;
    codeTheme: string;
    guestBannerBackground: string;
    bgSecondary: string;
    transcriptText?: string;
    transcriptBackground?: string;
    textDescription: string;
};

type ExtendedTheme = Theme & {[key: string]: string | undefined};

type ThemeTypeMap = Record<ThemeType | LegacyThemeType, ThemeKey>;
