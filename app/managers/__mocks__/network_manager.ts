// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const NetworkManager = {
    getClient: jest.fn(),
    init: jest.fn(),
    invalidateClient: jest.fn(),
    getRunningRequests: jest.fn(),
};

export default NetworkManager;
