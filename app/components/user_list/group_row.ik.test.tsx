// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import GroupRow from './group_row';

import type GroupModel from '@typings/database/models/servers/group';

describe('components/user_list/GroupRow', () => {
    const mockGroup: GroupModel = {
        id: 'group-123',
        name: 'engineering-team',
        displayName: 'Engineering Team',
        memberCount: 42,
    } as GroupModel;

    const mockOpenAsBottomSheet = jest.fn();
    jest.mock('@screens/navigation', () => ({
        openAsBottomSheet: mockOpenAsBottomSheet,
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render group display name and member count', () => {
        const {getByText} = renderWithIntlAndTheme(
            <GroupRow
                group={mockGroup}
                channelId='channel-123'
            />,
        );

        expect(getByText('Engineering Team')).toBeTruthy();
        expect(getByText('42')).toBeTruthy();
    });

    it('should render group username when name exists', () => {
        const {getByText} = renderWithIntlAndTheme(
            <GroupRow
                group={mockGroup}
                channelId='channel-123'
            />,
        );

        expect(getByText('@engineering-team')).toBeTruthy();
    });

    it('should not render username when group name is empty', () => {
        const groupWithoutName: GroupModel = {
            ...mockGroup,
            name: '',
        } as GroupModel;

        const {queryByText} = renderWithIntlAndTheme(
            <GroupRow
                group={groupWithoutName}
                channelId='channel-123'
            />,
        );

        expect(queryByText('@')).toBeNull();
    });

    it('should have correct accessibility label with member count', () => {
        const {getByLabelText} = renderWithIntlAndTheme(
            <GroupRow
                group={mockGroup}
                channelId='channel-123'
            />,
        );

        expect(getByLabelText('42 members')).toBeTruthy();
    });

    it('should be pressable', () => {
        const {getByLabelText} = renderWithIntlAndTheme(
            <GroupRow
                group={mockGroup}
                channelId='channel-123'
            />,
        );

        const row = getByLabelText('42 members');
        expect(row).toBeTruthy();
    });
});
