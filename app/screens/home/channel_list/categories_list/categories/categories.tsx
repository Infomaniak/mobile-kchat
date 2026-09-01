// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {DeviceEventEmitter, FlatList, StyleSheet, View} from 'react-native';

import {switchToChannelById} from '@actions/remote/channel';
import Loading from '@components/loading';
import {Events} from '@constants';
import {CHANNEL} from '@constants/screens';
import {useServerUrl} from '@context/server';
import {useIsTablet} from '@hooks/device';
import {useTeamSwitch} from '@hooks/team_switch';
import {usePreventDoubleTap} from '@hooks/utils';
import PerformanceMetricsManager from '@managers/performance_metrics_manager';

import CategoryBody from './body';
import LoadCategoriesError from './error';
import CategoryHeader from './header';
import UnreadCategories from './unreads';

import type CategoryModel from '@typings/database/models/servers/category';
import type ChannelModel from '@typings/database/models/servers/channel';
import type PreferenceModel from '@typings/database/models/servers/preference';
import type {Observable} from 'rxjs';

type Props = {
    categories: CategoryModel[];
    onlyUnreads: boolean;
    unreadsOnTop: boolean;
    manuallyClosedPrefs$: Observable<PreferenceModel[]>;
    autoclosePrefs$: Observable<PreferenceModel[]>;
    currentChannelId$: Observable<string>;
    notifyPropsByChannelId$: Observable<Record<string, Partial<ChannelNotifyProps>>>;
}

const styles = StyleSheet.create({
    mainList: {
        flex: 1,
    },
    loadingView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});

const extractKey = (item: CategoryModel | 'UNREADS') => (item === 'UNREADS' ? 'UNREADS' : item.id);

const Categories = ({
    categories,
    onlyUnreads,
    unreadsOnTop,
    manuallyClosedPrefs$,
    autoclosePrefs$,
    currentChannelId$,
    notifyPropsByChannelId$,
}: Props) => {
    const intl = useIntl();
    const listRef = useRef<FlatList>(null);
    const serverUrl = useServerUrl();
    const isTablet = useIsTablet();
    const switchingTeam = useTeamSwitch();
    const teamId = categories[0]?.teamId;
    const showOnlyUnreadsCategory = onlyUnreads && !unreadsOnTop;

    const categoriesToShow = useMemo(() => {
        if (showOnlyUnreadsCategory) {
            return ['UNREADS' as const];
        }

        const orderedCategories = [...categories];
        orderedCategories.sort((a, b) => a.sortOrder - b.sortOrder);

        if (unreadsOnTop) {
            return ['UNREADS' as const, ...orderedCategories];
        }
        return orderedCategories;
    }, [categories, unreadsOnTop, showOnlyUnreadsCategory]);

    const [initiaLoad, setInitialLoad] = useState(!categoriesToShow.length);

    const onChannelSwitch = usePreventDoubleTap(useCallback((c: Channel | ChannelModel) => {
        DeviceEventEmitter.emit(Events.ACTIVE_SCREEN, CHANNEL);
        PerformanceMetricsManager.startMetric('mobile_channel_switch');
        switchToChannelById(serverUrl, c.id);
    }, [serverUrl]));

    const renderCategory = useCallback((data: {item: CategoryModel | 'UNREADS'}) => {
        if (data.item === 'UNREADS') {
            return (
                <UnreadCategories
                    currentTeamId={teamId}
                    isTablet={isTablet}
                    onChannelSwitch={onChannelSwitch}
                    onlyUnreads={showOnlyUnreadsCategory}
                    unreadsOnTop={unreadsOnTop}
                    notifyPropsByChannelId$={notifyPropsByChannelId$}
                />
            );
        }
        return (
            <>
                <CategoryHeader
                    category={data.item}
                    currentChannelId$={currentChannelId$}
                />
                <CategoryBody
                    category={data.item}
                    isTablet={isTablet}
                    locale={intl.locale}
                    onChannelSwitch={onChannelSwitch}
                    unreadsOnTop={unreadsOnTop}
                    manuallyClosedPrefs$={manuallyClosedPrefs$}
                    autoclosePrefs$={autoclosePrefs$}
                    currentChannelId$={currentChannelId$}
                    notifyPropsByChannelId$={notifyPropsByChannelId$}
                />
            </>
        );
    }, [teamId, intl.locale, isTablet, onChannelSwitch, showOnlyUnreadsCategory, unreadsOnTop, manuallyClosedPrefs$, autoclosePrefs$, currentChannelId$, notifyPropsByChannelId$]);

    useEffect(() => {
        const t = setTimeout(() => {
            setInitialLoad(false);
        }, 0);

        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (switchingTeam) {
            return;
        }

        PerformanceMetricsManager.endMetric('mobile_team_switch', serverUrl);
    }, [serverUrl, switchingTeam]);

    if (!categories.length) {
        return <LoadCategoriesError/>;
    }

    return (
        <>
            {!switchingTeam && !initiaLoad && showOnlyUnreadsCategory &&
            <View style={styles.mainList}>
                <UnreadCategories
                    currentTeamId={teamId}
                    isTablet={isTablet}
                    onChannelSwitch={onChannelSwitch}
                    onlyUnreads={showOnlyUnreadsCategory}
                    unreadsOnTop={unreadsOnTop}
                    notifyPropsByChannelId$={notifyPropsByChannelId$}
                />
            </View>
            }
            {!switchingTeam && !initiaLoad && !showOnlyUnreadsCategory && (
                <FlatList
                    data={categoriesToShow}
                    ref={listRef}
                    renderItem={renderCategory}
                    style={styles.mainList}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={extractKey}
                    initialNumToRender={categoriesToShow.length}

                    // @ts-expect-error strictMode not included in the types
                    strictMode={true}
                />
            )}
            {(switchingTeam || initiaLoad) && (
                <View style={styles.loadingView}>
                    <Loading
                        size='large'
                        themeColor='sidebarText'
                        testID='categories.loading'
                    />
                </View>
            )}
        </>
    );
};

export default Categories;
