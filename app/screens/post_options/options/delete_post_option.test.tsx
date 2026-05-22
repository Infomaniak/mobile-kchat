// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fireEvent, screen} from '@testing-library/react-native';
import {Alert} from 'react-native';

import {deletePost} from '@actions/remote/post';
import {dismissBottomSheet} from '@screens/navigation';
import {renderWithEverything} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import DeletePostOption from './delete_post_option';

import type {Database} from '@nozbe/watermelondb';
import type PostModel from '@typings/database/models/servers/post';

// Mock the dependencies
jest.mock('@actions/remote/post');
jest.mock('@screens/navigation');

const mockDeletePost = deletePost as jest.MockedFunction<typeof deletePost>;
const mockDismissBottomSheet = dismissBottomSheet as jest.MockedFunction<typeof dismissBottomSheet>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

describe('DeletePostOption', () => {
    let database: Database;
    let mockPost: PostModel;

    beforeAll(async () => {
        const server = await TestHelper.setupServerDatabase();
        database = server.database;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        mockPost = {
            id: 'post-id-1',
            userId: 'user-id-1',
        } as PostModel;

        mockDismissBottomSheet.mockResolvedValue();
        mockDeletePost.mockResolvedValue({post: {post: mockPost}});
    });

    const getDefaultProps = () => ({
        bottomSheetId: 'PostOptions' as const,
        post: mockPost,
    });

    it('should render delete option with correct text and icon', () => {
        renderWithEverything(
            <DeletePostOption {...getDefaultProps()}/>,
            {database},
        );

        expect(screen.getByText('Delete')).toBeVisible();
        expect(screen.getByTestId('post_options.delete_post.option')).toBeVisible();
    });

    describe('Regular Post Deletion', () => {
        it('should show confirmation alert when pressed for regular post', () => {
            renderWithEverything(
                <DeletePostOption {...getDefaultProps()}/>,
                {database},
            );

            const deleteOption = screen.getByTestId('post_options.delete_post.option');
            fireEvent.press(deleteOption);

            expect(mockAlert).toHaveBeenCalledWith(
                'Delete Post',
                'Are you sure you want to delete this post?',
                expect.arrayContaining([
                    expect.objectContaining({
                        text: 'Cancel',
                        style: 'cancel',
                    }),
                    expect.objectContaining({
                        text: 'Delete',
                        style: 'destructive',
                        onPress: expect.any(Function),
                    }),
                ]),
            );
        });

        it('should call deletePost when confirmed for regular post', async () => {
            renderWithEverything(
                <DeletePostOption {...getDefaultProps()}/>,
                {database},
            );

            const deleteOption = screen.getByTestId('post_options.delete_post.option');
            fireEvent.press(deleteOption);

            // Get the onPress function from the Delete button and call it
            const alertCalls = mockAlert.mock.calls;
            const deleteButtonConfig = alertCalls[0][2]?.find((button: any) => button.text === 'Delete');
            await deleteButtonConfig?.onPress!();

            expect(mockDismissBottomSheet).toHaveBeenCalledWith('PostOptions');
            expect(mockDeletePost).toHaveBeenCalledWith(expect.any(String), mockPost);
        });

        it('should use combinedPost when provided for regular post', async () => {
            const combinedPost = {id: 'combined-post-id'} as Post;

            renderWithEverything(
                <DeletePostOption
                    {...getDefaultProps()}
                    combinedPost={combinedPost}
                />,
                {database},
            );

            const deleteOption = screen.getByTestId('post_options.delete_post.option');
            fireEvent.press(deleteOption);

            const alertCalls = mockAlert.mock.calls;
            const deleteButtonConfig = alertCalls[0][2]?.find((button: any) => button.text === 'Delete');
            await deleteButtonConfig?.onPress!();

            expect(mockDeletePost).toHaveBeenCalledWith(expect.any(String), combinedPost);
        });

        it('should not call any delete functions when cancel is pressed', () => {
            renderWithEverything(
                <DeletePostOption {...getDefaultProps()}/>,
                {database},
            );

            const deleteOption = screen.getByTestId('post_options.delete_post.option');
            fireEvent.press(deleteOption);

            // Simulate pressing Cancel
            const alertCalls = mockAlert.mock.calls;
            const cancelButtonConfig = alertCalls[0][2]?.find((button: any) => button.text === 'Cancel');
            cancelButtonConfig?.onPress?.();

            expect(mockDeletePost).not.toHaveBeenCalled();
            expect(mockDismissBottomSheet).not.toHaveBeenCalled();
        });
    });
});
