// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {inspect} from 'util';

import {logDebug} from '@app/utils/log';
import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';

import {prepareCategoriesAndCategoriesChannels} from './categories';
import {prepareDeleteChannel, prepareMyChannelsForTeam} from './channel';
import {prepareMyPreferences} from './preference';
import {resetLastFullSync} from './system';
import {prepareDeleteTeam, prepareMyTeams} from './team';
import {prepareUsers} from './user';

import type {MyChannelsRequest} from '@actions/remote/channel';
import type {MyPreferencesRequest} from '@actions/remote/preference';
import type {MyTeamsRequest} from '@actions/remote/team';
import type {MyUserRequest} from '@actions/remote/user';
import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Model} from '@nozbe/watermelondb';
import type ChannelModel from '@typings/database/models/servers/channel';
import type TeamModel from '@typings/database/models/servers/team';

type PrepareModelsArgs = {
    operator: ServerDataOperator;
    initialTeamId?: string;
    removeTeams?: TeamModel[];
    removeChannels?: ChannelModel[];
    teamData?: MyTeamsRequest;
    chData?: MyChannelsRequest;
    prefData?: MyPreferencesRequest;
    meData?: MyUserRequest;
    isCRTEnabled?: boolean;
}

const {
    POST,
    POSTS_IN_CHANNEL,
    POSTS_IN_THREAD,
    THREAD,
    THREADS_IN_TEAM,
    THREAD_PARTICIPANT,
    TEAM_THREADS_SYNC,
    MY_CHANNEL,
} = MM_TABLES.SERVER;

export async function prepareModels({operator, initialTeamId, removeTeams, removeChannels, teamData, chData, prefData, meData, isCRTEnabled}: PrepareModelsArgs): Promise<Array<Promise<Model[]>>> {
    logDebug('app/queries/servers/entry.ts - prepareModels', JSON.stringify(inspect({operator, initialTeamId, removeTeams, removeChannels, teamData, chData, prefData, meData, isCRTEnabled})));
    const modelPromises: Array<Promise<Model[]>> = [];

    if (removeTeams?.length) {
        removeTeams.forEach((team) => {
            modelPromises.push(prepareDeleteTeam(team).then((model) => {
                logDebug('#prepareModels prepareDeleteTeam!', {model});
                return model;
            }));
        });
    }

    if (removeChannels?.length) {
        removeChannels.forEach((channel) => {
            modelPromises.push(prepareDeleteChannel(channel).then((model) => {
                logDebug('#prepareModels prepareDeleteChannel!', {model});
                return model;
            }));
        });
    }

    if (teamData?.teams?.length && teamData.memberships?.length) {
        modelPromises.push(...prepareMyTeams(operator, teamData.teams, teamData.memberships).map((promise) => promise.then((model) => {
            logDebug('#prepareModels prepareMyTeams!', {model});
            return model;
        })));
    }

    if (chData?.categories?.length) {
        modelPromises.push(prepareCategoriesAndCategoriesChannels(operator, chData.categories, true).then((model) => {
            logDebug('#prepareModels prepareCategoriesAndCategoriesChannels!', {model});
            return model;
        }));
    }

    if (chData?.channels?.length && chData.memberships?.length) {
        if (initialTeamId) {
            modelPromises.push(...await prepareMyChannelsForTeam(operator, initialTeamId, chData.channels, chData.memberships, isCRTEnabled).then((model) => {
                logDebug('#prepareModels prepareMyChannelsForTeam!', {model});
                return model;
            }));
        }
    }

    if (prefData?.preferences?.length) {
        modelPromises.push(prepareMyPreferences(operator, prefData.preferences, true).then((model) => {
            logDebug('#prepareModels prepareMyPreferences!', {model});
            return model;
        }));
    }

    if (meData?.user) {
        modelPromises.push(prepareUsers(operator, [meData.user]).then((model) => {
            logDebug('#prepareModels prepareUsers!', {model});
            return model;
        }));
    }

    return modelPromises;
}

export async function truncateCrtRelatedTables(serverUrl: string): Promise<{error: any}> {
    const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

    try {
        await database.write(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return database.adapter.unsafeExecute({
                sqls: [
                    [`DELETE FROM ${POST}`, []],
                    [`DELETE FROM ${POSTS_IN_CHANNEL}`, []],
                    [`DELETE FROM ${POSTS_IN_THREAD}`, []],
                    [`DELETE FROM ${THREAD}`, []],
                    [`DELETE FROM ${THREADS_IN_TEAM}`, []],
                    [`DELETE FROM ${THREAD_PARTICIPANT}`, []],
                    [`DELETE FROM ${TEAM_THREADS_SYNC}`, []],
                    [`DELETE FROM ${MY_CHANNEL}`, []],
                ],
            });
        });
        await resetLastFullSync(operator);
    } catch (error) {
        if (__DEV__) {
            throw error;
        }
        return {error};
    }

    return {error: false};
}
