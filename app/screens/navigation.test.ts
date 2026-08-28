// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {DeviceEventEmitter, type EmitterSubscription} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {Events, Preferences, Screens} from '@constants';
import NavigationStore from '@store/navigation_store';
import {isTablet} from '@utils/helpers';

import {dismissAllModalsAndPopToScreen, goToScreen, openAsBottomSheet, openAttachmentOptions} from './navigation';

import type {FirstArgument} from '@typings/utils/utils';
import type {IntlShape} from 'react-intl';

jest.mock('@utils/helpers', () => ({
    ...jest.requireActual('@utils/helpers'),
    isTablet: jest.fn(),
}));

const mockDismissKeyboard = jest.fn();
jest.mock('@utils/keyboard', () => ({
    dismissKeyboard: (...args: unknown[]) => mockDismissKeyboard(...args),
}));

jest.mock('@components/compass_icon', () => {
    function CompassIcon() {
        return null;
    }
    CompassIcon.getImageSourceSync = jest.fn().mockReturnValue({});
    return {
        __esModule: true,
        default: CompassIcon,
    };
});

function expectShowModalCalledWith(screen: string, title: string, props?: Record<string, unknown>) {
    expect(Navigation.showModal).toHaveBeenCalledWith({
        stack: {
            children: [{
                component: {
                    id: screen,
                    name: screen,
                    passProps: {
                        ...props,
                        isModal: true,
                    },
                    options: expect.any(Object),
                },
            }],
        },
    });
}

function expectShowModalOverCurrentContext(screen: string, props?: Record<string, unknown>) {
    expectShowModalCalledWith(screen, '', props);
}

function expectOpenAsBottomSheetCalledWith(props: FirstArgument<typeof openAsBottomSheet>, isTabletDevice: boolean) {
    if (isTabletDevice) {
        expectShowModalCalledWith(props.screen, props.title, {closeButtonId: props.closeButtonId, ...props.props});
    } else {
        expectShowModalOverCurrentContext(props.screen, props.props);
    }
}

function expectDismissBottomSheetCalledWith(screenToDismiss: string, listenerCallback: jest.Mock) {
    expect(listenerCallback).toHaveBeenCalled();
    expect(NavigationStore.waitUntilScreensIsRemoved).toHaveBeenCalledWith(screenToDismiss);
}

function expectNotDismissBottomSheetCalledWith(listenerCallback: jest.Mock) {
    expect(listenerCallback).not.toHaveBeenCalled();
    expect(NavigationStore.waitUntilScreensIsRemoved).not.toHaveBeenCalled();
}

describe('openUserProfileModal', () => {
    const intl = {
        formatMessage: jest.fn(({defaultMessage}) => defaultMessage),
    } as unknown as IntlShape;
    const theme = Preferences.THEMES.denim;
    const props = {
        userId: 'user123',
    };

    let eventSubscription: EmitterSubscription;
    const listenerCallback = jest.fn();

    const openUserProfileModal = jest.requireActual('./navigation').openUserProfileModal;

    beforeAll(() => {
        eventSubscription = DeviceEventEmitter.addListener(Events.CLOSE_BOTTOM_SHEET, listenerCallback);
        jest.spyOn(NavigationStore, 'waitUntilScreensIsRemoved').mockImplementation();
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        eventSubscription.remove();
    });

    it('should dismiss the keyboard', () => {
        openUserProfileModal(intl, theme, props);
        expect(mockDismissKeyboard).toHaveBeenCalled();
    });

    it('should dismiss the bottom sheet if screenToDismiss is provided', async () => {
        const screenToDismiss = Screens.BOTTOM_SHEET;
        await openUserProfileModal(intl, theme, props, screenToDismiss);
        expectDismissBottomSheetCalledWith(screenToDismiss, listenerCallback);
        expectOpenAsBottomSheetCalledWith({
            screen: Screens.USER_PROFILE,
            title: 'Profile',
            closeButtonId: 'close-user-profile',
            theme,
            props,
        }, false);
    });

    it('should not call dismiss if no screenToDismiss is provided', async () => {
        await openUserProfileModal(intl, theme, props);
        expectNotDismissBottomSheetCalledWith(listenerCallback);
        expectOpenAsBottomSheetCalledWith({
            screen: Screens.USER_PROFILE,
            title: 'Profile',
            closeButtonId: 'close-user-profile',
            theme,
            props,
        }, false);
    });
});

describe('openAttachmentOptions', () => {
    const intl = {
        formatMessage: jest.fn(({defaultMessage}) => defaultMessage),
    } as unknown as IntlShape;
    const theme = Preferences.THEMES.denim;
    const mockOnUploadFiles = jest.fn();
    const props = {
        onUploadFiles: mockOnUploadFiles,
        maxFilesReached: false,
        canUploadFiles: true,
        testID: 'test-attachment',
        fileCount: 0,
        maxFileCount: 5,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(isTablet).mockReturnValue(false);
    });

    it('should call openAsBottomSheet with correct parameters on non-tablet', () => {
        openAttachmentOptions(intl, theme, props);

        expectOpenAsBottomSheetCalledWith({
            screen: Screens.ATTACHMENT_OPTIONS,
            title: 'Files and media',
            closeButtonId: 'attachment-close-id',
            theme,
            props,
        }, false);
    });

    it('should call openAsBottomSheet with correct parameters on tablet', () => {
        jest.mocked(isTablet).mockReturnValue(true);

        openAttachmentOptions(intl, theme, props);

        expectOpenAsBottomSheetCalledWith({
            screen: Screens.ATTACHMENT_OPTIONS,
            title: 'Files and media',
            closeButtonId: 'attachment-close-id',
            theme,
            props,
        }, true);
    });

    it('should handle optional props correctly', () => {
        const minimalProps = {
            onUploadFiles: mockOnUploadFiles,
            maxFilesReached: true,
            canUploadFiles: false,
        };

        openAttachmentOptions(intl, theme, minimalProps);

        expectOpenAsBottomSheetCalledWith({
            screen: Screens.ATTACHMENT_OPTIONS,
            title: 'Files and media',
            closeButtonId: 'attachment-close-id',
            theme,
            props: minimalProps,
        }, false);
    });
});

describe('dismissAllModalsAndPopToScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        NavigationStore.reset();
        (Navigation as unknown as {popTo: jest.Mock}).popTo = jest.fn();
    });

    afterEach(() => {
        NavigationStore.reset();
    });

    it('does not issue a pop command when the target screen is already visible', async () => {
        NavigationStore.addScreenToStack(Screens.CHANNEL);

        await dismissAllModalsAndPopToScreen(Screens.CHANNEL, '');

        expect(Navigation.popTo).not.toHaveBeenCalled();
    });
});

describe('goToScreen', () => {
    const goToScreenFn = jest.requireActual('./navigation').goToScreen as typeof goToScreen;
    const mockPush = Navigation.push as unknown as jest.Mock;
    const mockUpdateProps = Navigation.updateProps as unknown as jest.Mock;
    let mockPopTo: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        NavigationStore.reset();
        mockPopTo = jest.fn();
        mockPush.mockResolvedValue({});
        (Navigation as unknown as {popTo: jest.Mock}).popTo = mockPopTo;
    });

    afterEach(() => {
        NavigationStore.reset();
    });

    it('should push a fresh screen when popTo rejects because the navigation store is stale', async () => {
        NavigationStore.addScreenToStack(Screens.HOME);
        NavigationStore.addScreenToStack(Screens.THREAD);
        NavigationStore.addScreenToStack(Screens.CHANNEL);
        mockPopTo.mockRejectedValue(new Error('ComponentId does not exist'));

        await goToScreenFn(Screens.THREAD, '', {rootId: 'root-post-id'});

        expect(mockPush).toHaveBeenCalledWith(
            Screens.CHANNEL,
            expect.objectContaining({
                component: expect.objectContaining({
                    id: Screens.THREAD,
                    name: Screens.THREAD,
                    passProps: {rootId: 'root-post-id'},
                }),
            }),
        );
    });

    it('should not throw when both popTo and the fallback push reject', async () => {
        NavigationStore.addScreenToStack(Screens.HOME);
        NavigationStore.addScreenToStack(Screens.THREAD);
        NavigationStore.addScreenToStack(Screens.CHANNEL);
        mockPopTo.mockRejectedValue(new Error('ComponentId does not exist'));
        mockPush.mockRejectedValue(new Error('ComponentId does not exist'));

        await expect(goToScreenFn(Screens.THREAD, '', {rootId: 'root-post-id'})).resolves.toBeUndefined();
        expect(mockPush).toHaveBeenCalled();
    });

    it('should not push or pop when the target screen is already visible', async () => {
        NavigationStore.addScreenToStack(Screens.HOME);
        NavigationStore.addScreenToStack(Screens.CHANNEL);
        NavigationStore.addScreenToStack(Screens.THREAD);

        await goToScreenFn(Screens.THREAD, '', {rootId: 'root-post-id'});

        expect(mockUpdateProps).toHaveBeenCalledWith(Screens.THREAD, {rootId: 'root-post-id'});
        expect(mockPopTo).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('should push normally when the screen is not in the stack', async () => {
        NavigationStore.addScreenToStack(Screens.HOME);
        NavigationStore.addScreenToStack(Screens.CHANNEL);

        await goToScreenFn(Screens.THREAD, '', {rootId: 'root-post-id'});

        expect(mockPush).toHaveBeenCalledWith(Screens.CHANNEL, expect.anything());
        expect(mockPopTo).not.toHaveBeenCalled();
    });
});
