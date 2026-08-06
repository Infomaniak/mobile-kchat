// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ComponentProps} from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import ThreadsList from './threads_list';

jest.mock('@actions/remote/thread', () => ({
    syncTeamThreads: jest.fn().mockResolvedValue({}),
    loadEarlierThreads: jest.fn().mockResolvedValue({}),
}));

jest.mock('./thread', () => {
    const MockReact = require('react');
    const {Text} = require('react-native');
    return {
        __esModule: true,
        default: MockReact.memo(({thread}: {thread: {id: string}}) => (
            MockReact.createElement(Text, {testID: `thread-${thread.id}`}, thread.id)
        )),
    };
});

jest.mock('@utils/log', () => ({
    logInfo: jest.fn(),
    logDebug: jest.fn(),
}));

jest.mock('@context/server', () => ({
    useServerUrl: () => 'https://test.server',
}));

describe('ThreadsList', () => {
    const baseProps: ComponentProps<typeof ThreadsList> = {
        tab: 'all',
        teamId: 'team1',
        teammateNameDisplay: 'full_name',
        testID: 'global_threads.threads_list',
        threads: [],
        flatListRef: {current: null} as ComponentProps<typeof ThreadsList>['flatListRef'],
    };

    const generateThreads = (count: number) => {
        return Array.from({length: count}, (_, i) => TestHelper.fakeThreadModel({
            id: `thread_${i}`,
            replyCount: i + 1,
            isFollowing: true,
            lastReplyAt: 1000 + i,
        }));
    };

    const getFlatListProps = (tree: ReturnType<typeof renderWithIntlAndTheme>) => {
        const flatList = tree.getByTestId('global_threads.threads_list.flat_list');
        return flatList.props as {data: unknown[]; initialNumToRender?: number; windowSize?: number; maxToRenderPerBatch?: number; removeClippedSubviews?: boolean};
    };

    it('should set initialNumToRender to 10', () => {
        const threads = generateThreads(500);
        const props = {...baseProps, threads};
        const tree = renderWithIntlAndTheme(<ThreadsList {...props}/>);
        const flatListProps = getFlatListProps(tree);

        expect(flatListProps.initialNumToRender).toBe(10);
    });

    it('should set windowSize to 7 to limit offscreen rendering', () => {
        const threads = generateThreads(500);
        const props = {...baseProps, threads};
        const tree = renderWithIntlAndTheme(<ThreadsList {...props}/>);
        const flatListProps = getFlatListProps(tree);

        expect(flatListProps.windowSize).toBe(7);
    });

    it('should not use removeClippedSubviews (causes full render on iOS)', () => {
        const threads = generateThreads(500);
        const props = {...baseProps, threads};
        const tree = renderWithIntlAndTheme(<ThreadsList {...props}/>);
        const flatListProps = getFlatListProps(tree);

        expect(flatListProps.removeClippedSubviews).toBeFalsy();
    });

    it('should accept 500 threads without crashing', () => {
        const threads = generateThreads(500);
        const props = {...baseProps, threads};
        const tree = renderWithIntlAndTheme(<ThreadsList {...props}/>);
        const flatListProps = getFlatListProps(tree);

        expect(flatListProps.data).toHaveLength(500);
    });
});
