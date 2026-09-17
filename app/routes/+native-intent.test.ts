// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Linking} from 'react-native';

import {alertInvalidDeepLink, parseAndHandleDeepLink} from '@utils/deep_link';

import {addEventListener, redirectSystemPath} from './+native-intent';

jest.mock('@utils/deep_link');

describe('native-intent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (parseAndHandleDeepLink as jest.Mock).mockResolvedValue({error: false});
    });

    describe('addEventListener', () => {
        it('should subscribe to Linking url events and return an unsubscribe function', () => {
            const remove = jest.fn();
            (Linking.addEventListener as jest.Mock).mockReturnValue({remove});

            const unsubscribe = addEventListener();

            expect(Linking.addEventListener).toHaveBeenCalledWith('url', expect.any(Function));

            unsubscribe();

            expect(remove).toHaveBeenCalled();
        });
    });

    describe('redirectSystemPath', () => {
        it('should return the path unchanged for a custom scheme url with no host, regardless of initial', async () => {
            const path = 'kchat:///';

            expect(await redirectSystemPath({path, initial: true})).toBe(path);
            expect(await redirectSystemPath({path, initial: false})).toBe(path);

            expect(parseAndHandleDeepLink).not.toHaveBeenCalled();
            expect(alertInvalidDeepLink).not.toHaveBeenCalled();
        });

        it('should return null for library-owned schemes consumed natively, regardless of initial', async () => {
            const path = 'com.infomaniak.chat://oauth2redirect';

            expect(await redirectSystemPath({path, initial: true})).toBeNull();
            expect(await redirectSystemPath({path, initial: false})).toBeNull();

            expect(parseAndHandleDeepLink).not.toHaveBeenCalled();
        });

        it('should return null and not alert when the deep link is handled successfully, regardless of initial', async () => {
            const path = 'https://server.example.com/team/channels/town-square';

            expect(await redirectSystemPath({path, initial: true})).toBeNull();
            expect(await redirectSystemPath({path, initial: false})).toBeNull();

            expect(parseAndHandleDeepLink).toHaveBeenCalledWith(path, undefined, undefined, true);
            expect(alertInvalidDeepLink).not.toHaveBeenCalled();
        });

        it('should return the path and alert when the deep link handling errors, regardless of initial', async () => {
            (parseAndHandleDeepLink as jest.Mock).mockResolvedValue({error: true});

            const path = 'https://server.example.com/team/channels/town-square';

            expect(await redirectSystemPath({path, initial: true})).toBe(path);
            expect(await redirectSystemPath({path, initial: false})).toBe(path);

            expect(alertInvalidDeepLink).toHaveBeenCalledTimes(2);
        });
    });

    describe('handleUrl (via addEventListener subscription callback)', () => {
        const getHandler = (): (event: {url: string}) => Promise<boolean> => {
            addEventListener();
            const call = (Linking.addEventListener as jest.Mock).mock.calls[0];
            return call[1];
        };

        it('should return false for a custom scheme url with no host without parsing it', async () => {
            const handleUrl = getHandler();

            const result = await handleUrl({url: 'kchat:///'});

            expect(result).toBe(false);
            expect(parseAndHandleDeepLink).not.toHaveBeenCalled();
            expect(alertInvalidDeepLink).not.toHaveBeenCalled();
        });

        it('should return false for a library-owned scheme without parsing it', async () => {
            const handleUrl = getHandler();

            const result = await handleUrl({url: 'mmauth://callback'});

            expect(result).toBe(false);
            expect(parseAndHandleDeepLink).not.toHaveBeenCalled();
        });

        it('should return true when the deep link is handled successfully', async () => {
            const handleUrl = getHandler();

            const result = await handleUrl({url: 'kchat://server.example.com/team/channels/town-square'});

            expect(result).toBe(true);
            expect(alertInvalidDeepLink).not.toHaveBeenCalled();
        });

        it('should alert and return false when the deep link errors', async () => {
            (parseAndHandleDeepLink as jest.Mock).mockResolvedValue({error: true});
            const handleUrl = getHandler();

            const result = await handleUrl({url: 'kchat://server.example.com/team/channels/town-square'});

            expect(result).toBe(false);
            expect(alertInvalidDeepLink).toHaveBeenCalled();
        });

        it('should return false when the url is empty', async () => {
            const handleUrl = getHandler();

            const result = await handleUrl({url: ''});

            expect(result).toBe(false);
            expect(parseAndHandleDeepLink).not.toHaveBeenCalled();
        });
    });
});
