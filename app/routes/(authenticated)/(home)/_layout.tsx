// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Tabs, router} from 'expo-router';
import {NativeTabs} from 'expo-router/unstable-native-tabs';
import React from 'react';
import {DeviceEventEmitter, Platform} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {Navigation as NavigationConstants, Screens} from '@constants';
import {useTheme} from '@context/theme';
import useDidMount from '@hooks/did_mount';
import {useTotalUnreadAndMentions} from '@hooks/use_total_unread_mentions';
import TabBar from '@screens/home/tab_bar';
import {getExpoRouterPath} from '@screens/navigation';
import {changeOpacity, isDarkTheme, makeStyleSheetFromTheme} from '@utils/theme';

import type {AvailableScreens} from '@typings/screens/navigation';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    card: {
        backgroundColor: theme.centerChannelBg,
    },
}));

const supportsNativeTabs = Platform.OS === 'ios';

function NativeTabLayout() {
    const theme = useTheme();
    const {mentions, unread} = useTotalUnreadAndMentions();

    useDidMount(() => {
        const homeListener = DeviceEventEmitter.addListener(NavigationConstants.NAVIGATION_HOME, () => {
            router.navigate(getExpoRouterPath(Screens.CHANNEL_LIST)!);
        });

        const navigateToTabListener = DeviceEventEmitter.addListener(NavigationConstants.NAVIGATE_TO_TAB, ({screen, params = {}}: {screen: string; params?: Record<string, string | number | undefined | null | Array<string | number>>}) => {
            const pathname = getExpoRouterPath(screen as AvailableScreens);
            if (pathname) {
                router.navigate({pathname, params});
            }
        });

        return () => {
            homeListener.remove();
            navigateToTabListener.remove();
        };
    });

    return (
        <NativeTabs
            blurEffect={isDarkTheme(theme) ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
            iconColor={{
                default: changeOpacity(theme.centerChannelColor, 0.48),
                selected: theme.buttonBg,
            }}
            screenListeners={{
                tabPress: () => DeviceEventEmitter.emit(NavigationConstants.TAB_PRESSED),
            }}
        >
            <NativeTabs.Trigger
                name={Screens.CHANNEL_LIST}
                contentStyle={{backgroundColor: theme.sidebarBg}}
                unstable_nativeProps={{freezeContents: false}}
            >
                <NativeTabs.Trigger.Icon
                    src={(
                        <NativeTabs.Trigger.VectorIcon
                            family={CompassIcon}
                            name='home-variant-outline'
                        />
                    )}
                />
                <NativeTabs.Trigger.Label hidden={true}/>
                {mentions > 0 && (
                    <NativeTabs.Trigger.Badge>{String(mentions)}</NativeTabs.Trigger.Badge>
                )}
                {mentions === 0 && unread && <NativeTabs.Trigger.Badge/>}
            </NativeTabs.Trigger>
            <NativeTabs.Trigger
                name={Screens.SEARCH}
                contentStyle={{backgroundColor: theme.centerChannelBg}}
                unstable_nativeProps={{freezeContents: true}}
            >
                <NativeTabs.Trigger.Icon
                    src={(
                        <NativeTabs.Trigger.VectorIcon
                            family={CompassIcon}
                            name='magnify'
                        />
                    )}
                />
                <NativeTabs.Trigger.Label hidden={true}/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger
                name={Screens.MENTIONS}
                contentStyle={{backgroundColor: theme.centerChannelBg}}
                unstable_nativeProps={{freezeContents: true}}
            >
                <NativeTabs.Trigger.Icon
                    src={(
                        <NativeTabs.Trigger.VectorIcon
                            family={CompassIcon}
                            name='at'
                        />
                    )}
                />
                <NativeTabs.Trigger.Label hidden={true}/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger
                name={Screens.SAVED_MESSAGES}
                contentStyle={{backgroundColor: theme.centerChannelBg}}
                unstable_nativeProps={{freezeContents: true}}
            >
                <NativeTabs.Trigger.Icon
                    src={(
                        <NativeTabs.Trigger.VectorIcon
                            family={CompassIcon}
                            name='bookmark-outline'
                        />
                    )}
                />
                <NativeTabs.Trigger.Label hidden={true}/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger
                name={Screens.ACCOUNT}
                contentStyle={{backgroundColor: theme.centerChannelBg}}
                unstable_nativeProps={{freezeContents: true}}
            >
                <NativeTabs.Trigger.Icon sf='person.crop.circle'/>
                <NativeTabs.Trigger.Label hidden={true}/>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default function TabLayout() {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    if (supportsNativeTabs) {
        return <NativeTabLayout/>;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                lazy: true,
                sceneStyle: styles.card,
            }}
            backBehavior='none'
            tabBar={(props) => (
                <TabBar
                    {...props}
                    theme={theme}
                />
            )}
        >
            <Tabs.Screen
                name={Screens.CHANNEL_LIST}
                options={{
                    title: 'Home',
                    href: '/(authenticated)/(home)',
                    tabBarButtonTestID: 'tab_bar.home.tab',
                    freezeOnBlur: false,
                    animation: 'none',
                }}
            />
            <Tabs.Screen
                name={Screens.SEARCH}
                options={{
                    title: 'Search',
                    href: null,
                    tabBarButtonTestID: 'tab_bar.search.tab',
                    freezeOnBlur: true,
                }}
            />
            <Tabs.Screen
                name={Screens.MENTIONS}
                options={{
                    title: 'Mentions',
                    href: null,
                    tabBarButtonTestID: 'tab_bar.mentions.tab',
                    freezeOnBlur: true,
                }}
            />
            <Tabs.Screen
                name={Screens.SAVED_MESSAGES}
                options={{
                    title: 'Saved',
                    href: null,
                    tabBarButtonTestID: 'tab_bar.saved_messages.tab',
                    freezeOnBlur: true,
                }}
            />
            <Tabs.Screen
                name={Screens.ACCOUNT}
                options={{
                    title: 'Account',
                    href: null,
                    tabBarButtonTestID: 'tab_bar.account.tab',
                    freezeOnBlur: true,
                }}
            />
        </Tabs>
    );
}
