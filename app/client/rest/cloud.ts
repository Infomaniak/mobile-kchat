// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export interface CloudLimitMix {
    getCloudLimits: () => Promise<any>;
    getUsage: () => Promise<any>;
}

const CloudLimitMix = (superclass: any) => class extends superclass {
    getCloudLimits = async () => {
        const url = `${this.getCloudRoute()}/limits`;
        console.log('Fetching limits from:', url);
        return this.doFetch(url, {method: 'get'});
    };
    getUsage = async () => {
        const url = `${this.getUsageRoute()}`;
        console.log('Fetching limits from:', url);
        return this.doFetch(url, {method: 'get'});
    };
};

export default CloudLimitMix;
