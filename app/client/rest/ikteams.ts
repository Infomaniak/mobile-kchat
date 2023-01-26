// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type TeamServer = {
    id: string;
    display_name: string;
    name: string;
    url: string;
}

export interface IKClientMultiTeamMix {
    getMultiTeams: () => Promise<[TeamServer]>;
}

const IKClientMultiTeam = (superclass: any) => class extends superclass {
    getMultiTeamRoute(): string {
        return `${this.getUserRoute('me')}/servers`;
    }

    getMultiTeams = async () => {
        return this.doFetch(
            `${this.getMultiTeamRoute()}`,
            {method: 'get'},
        );
    };
};

export default IKClientMultiTeam;
