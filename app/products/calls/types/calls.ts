// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type GlobalCallsState = {
    micPermissionsGranted: boolean;
    joiningChannelId: string | null;
}

export const DefaultGlobalCallsState: GlobalCallsState = {
    micPermissionsGranted: false,
    joiningChannelId: null,
};
