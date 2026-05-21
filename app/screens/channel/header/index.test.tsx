// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ComponentProps} from 'react';

import {SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {renderWithEverything} from '@test/intl-test-helper';

import ChannelHeaderComponent from './header';

import ChannelHeader from './';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';

jest.mock('./header');
jest.mocked(ChannelHeaderComponent).mockImplementation(
    (props) => React.createElement('ChannelHeader', {testID: 'channel-header', ...props}),
);

const serverUrl = 'server-url';

describe('ChannelHeader Index', () => {
    const channelId = 'channel-id';

    let database: Database;
    let operator: ServerDataOperator;

    beforeEach(async () => {
        await DatabaseManager.init([serverUrl]);
        const serverDatabaseAndOperator = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        database = serverDatabaseAndOperator.database;
        operator = serverDatabaseAndOperator.operator;
    });

    afterEach(() => {
        DatabaseManager.destroyServerDatabase(serverUrl);
    });

    describe('playbooks functionality', () => {
        function getBaseProps(): ComponentProps<typeof ChannelHeader> {
            return {
                channelId,
                componentId: 'Channel' as const,
                callsEnabledInChannel: false,
                shouldRenderBookmarks: false,
                shouldRenderChannelBanner: false,
                isTabletView: false,
            };
        }

        it('should render correctly without data', async () => {
            const props = getBaseProps();
            const {getByTestId} = renderWithEverything(<ChannelHeader {...props}/>, {database});

            const channelHeader = getByTestId('channel-header');
            expect(channelHeader.props.isPlaybooksEnabled).toBe(false);
            expect(channelHeader.props.playbooksActiveRuns).toBe(0);
            expect(channelHeader.props.hasPlaybookRuns).toBe(false);
            expect(channelHeader.props.activeRunId).toBeUndefined();
        });

        it('should render correctly with playbooks enabled and no runs', async () => {
            await operator.handleSystem({
                systems: [
                    {
                        id: SYSTEM_IDENTIFIERS.PLAYBOOKS_VERSION,
                        value: '3.0.0',
                    },
                ],
                prepareRecordsOnly: false,
            });

            const props = getBaseProps();
            const {getByTestId} = renderWithEverything(<ChannelHeader {...props}/>, {database});

            const channelHeader = getByTestId('channel-header');
            expect(channelHeader.props.isPlaybooksEnabled).toBe(true);
            expect(channelHeader.props.playbooksActiveRuns).toBe(0);
            expect(channelHeader.props.hasPlaybookRuns).toBe(false);
            expect(channelHeader.props.activeRunId).toBeUndefined();
        });
    });
});
