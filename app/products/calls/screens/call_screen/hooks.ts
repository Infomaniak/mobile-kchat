// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint max-lines: off */
/* eslint-disable max-nested-callbacks */

/**
 * HACK It seems <JitsiMeeting /> does not like rxjs
 * using withObservable causes a infinite loop error
 *   -> "Error: executing a cancelled action, js engine: hermes"
 */

import {useEffect, useState} from 'react';

import {useMountedRef, useTransientRef} from '@app/hooks/utils';
import {getChannelById} from '@app/queries/servers/channel';
import {getConferenceById, getConferenceHasAtLeastOneParticipantPresent, getConferenceParticipantCount} from '@app/queries/servers/conference';
import {getCurrentUserId} from '@app/queries/servers/system';
import {getGlobalCallsState} from '@calls/state';
import DatabaseManager from '@database/manager';
import {noop} from '@helpers/api/general';

import type ChannelModel from '@typings/database/models/servers/channel';
import type ConferenceModel from '@typings/database/models/servers/conference';

/**
 * Polling rate in milliseconds
 */
const POLLING_RATE_MS = 1000; // ms

/**
 * Hook to get a channel by id
 */
export const _useChannel = (serverUrl: string, channelId: string) => {
    const [channel, setChannel] = useState<ChannelModel | undefined>(undefined);
    useEffect(() => {
        const database = DatabaseManager.serverDatabases[serverUrl]?.database;
        getChannelById(database!, channelId).then(setChannel);
    }, [channelId]);

    return channel;
};

/**
 * Hook to get the current userId
 * only necessary for DMs
 */
export const _useCurrentUserId = (isDM: boolean, serverUrl: string) => {
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (isDM) {
            const database = DatabaseManager.serverDatabases[serverUrl]?.database;
            getCurrentUserId(database!).then(setCurrentUserId);
        }
    }, [isDM]);

    return currentUserId;
};

/**
 * Hook to watch the microphone permission status
 */
export const _useMicPermissionsGranted = (() => {
    const getIsMicPermissionGranted = () =>
        getGlobalCallsState().micPermissionsGranted;

    return () => {
        const [micPermissionGranted, setMicPermissionGranted] = useState(getIsMicPermissionGranted());
        const micPermissionGrantedRef = useTransientRef(micPermissionGranted);

        useEffect(() => {
            let interval: NodeJS.Timeout | null = null;

            // Clear the created interval
            const clean = () => {
                if (typeof interval === 'number') {
                    clearInterval(interval);
                    interval = null;
                }
            };

            // Polled config for mic permissions
            interval = setInterval(() => {
                const nextMicPermissionGranted = getIsMicPermissionGranted();
                if (nextMicPermissionGranted !== micPermissionGrantedRef.current) {
                    setMicPermissionGranted(nextMicPermissionGranted);
                }
            }, POLLING_RATE_MS);

            return clean;
        }, []);

        return micPermissionGranted;
    };
})();

/**
 * Hook to get a conference by id
 */
export const _useConference = (serverUrl: string, conferenceId: string) => {
    const [conference, setConference] = useState<ConferenceModel | undefined>(undefined);
    useEffect(() => {
        const database = DatabaseManager.serverDatabases[serverUrl]?.database;
        getConferenceById(database!, conferenceId).then(setConference);
    }, [conferenceId]);

    return conference;
};

/**
 * Hook that polls the number of participant in a conference
 */
export const _useParticipantCount = (serverUrl: string, conferenceId: string) => {
    const [participantCount, setParticipantCount] = useState<number | undefined>(undefined);
    const participantCountRef = useTransientRef(participantCount);
    const mountedRef = useMountedRef();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        const database = DatabaseManager.serverDatabases[serverUrl]?.database;

        // Clear the created interval
        const clean = () => {
            if (typeof interval === 'number') {
                clearInterval(interval);
                interval = null;
            }
        };

        // Perform an update
        const update = async () => {
            const nextParticipantCount = await getConferenceParticipantCount(database!, conferenceId);
            if (
                mountedRef.current &&
                nextParticipantCount !== participantCountRef.current
            ) {
                setParticipantCount(nextParticipantCount);
            }
        };

        // Immediate & Polled database for participant count
        update();
        interval = setInterval(update, POLLING_RATE_MS);

        return clean;
    }, [conferenceId]);

    return participantCount;
};

/**
 * Hook that tests if there is at least one participant present in the conference
 */
export const _useHasAtLeastOneParticipantPresent = (serverUrl: string, conferenceId: string, currentUserId?: string) => {
    const [hasAtLeastOneParticipantPresent, setHasAtLeastOneParticipantPresent] =
        useState<boolean | undefined>(typeof currentUserId === 'string' ? false : undefined);
    const mountedRef = useMountedRef();

    useEffect(() => {
        if (typeof currentUserId === 'string') {
            let interval: NodeJS.Timeout | null = null;
            const database = DatabaseManager.serverDatabases[serverUrl]?.database;

            // Clear the created interval
            const clean = () => {
                if (typeof interval === 'number') {
                    clearInterval(interval);
                    interval = null;
                }
            };

            // Perform an update
            const update = async () => {
                if (await getConferenceHasAtLeastOneParticipantPresent(database!, conferenceId, currentUserId)) {
                    if (mountedRef.current) {
                        setHasAtLeastOneParticipantPresent(true);
                    }
                    clean();
                }
            };

            // Immediate & Polled database until truthy
            update();
            interval = setInterval(update, POLLING_RATE_MS);

            return clean;
        }

        return noop;
    }, [conferenceId, currentUserId]);

    return hasAtLeastOneParticipantPresent;
};
