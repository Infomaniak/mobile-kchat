// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type ClientBase from './base';
import type {CloudUsage, Limits} from '@typings/components/cloud';

export interface CloudLimitMix {
    getCloudLimits: () => Promise<Limits>;
    getUsage: () => Promise<CloudUsage>;
}

const ClientCloudLimitMix = <TBase extends Constructor<ClientBase>>(superclass: TBase) => class extends superclass {
    getCloudLimits = async () => {
        const url = `${this.getCloudRoute()}/limits`;
        return this.doFetch(url, {method: 'get'});
    };
    getUsage = async () => {
        const url = `${this.getUsageRoute()}`;
        return this.doFetch(url, {method: 'get'});
    };
};

export default ClientCloudLimitMix;
