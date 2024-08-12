// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {SelectedTrackType, TextTrackType, type ISO639_1, type SelectedTrack, type TextTracks} from 'react-native-video';

import {buildFileUrl} from '@actions/remote/file';
import {Post} from '@constants';

import type {Caption} from '@mattermost/calls/lib/types';
import type PostModel from '@typings/database/models/servers/post';

export function isCallsCustomMessage(post: PostModel | Post): boolean {
    return Boolean(post.type && post.type === Post.POST_TYPES.CUSTOM_CALLS);
}

export const hasCaptions = (postProps?: Record<string, any> & { captions?: Caption[] }): boolean => {
    return !(!postProps || !postProps.captions?.[0]);
};

export const getTranscriptionUri = (serverUrl: string, postProps?: Record<string, any> & { captions?: Caption[] }): {
    tracks?: TextTracks;
    selected: SelectedTrack;
} => {
    // Note: We're not using hasCaptions above because this tells typescript that the caption exists later.
    // We could use some fancy typescript to do the same, but it's not worth the complexity.
    if (!postProps || !postProps.captions?.[0]) {
        return {
            tracks: undefined,
            selected: {type: SelectedTrackType.DISABLED, value: ''},
        };
    }

    const tracks: TextTracks = postProps.captions.map((t) => ({
        title: t.title,
        language: t.language as ISO639_1,
        type: TextTrackType.VTT,
        uri: buildFileUrl(serverUrl, t.file_id),
    }));

    return {
        tracks,
        selected: {type: SelectedTrackType.INDEX, value: 0},
    };
};
