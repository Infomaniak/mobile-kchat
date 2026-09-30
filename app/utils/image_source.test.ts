// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {buildAuthorizedImageSource} from './image_source';

describe('buildAuthorizedImageSource', () => {
    const serverUrl = 'https://kchat.example.com';
    const token = 'Bearer test-token';

    describe('uri undefined/empty', () => {
        it('should return empty object when uri is undefined', () => {
            const result = buildAuthorizedImageSource(serverUrl, undefined, token);
            expect(result).toEqual({});
        });

        it('should return empty object when uri is empty string', () => {
            const result = buildAuthorizedImageSource(serverUrl, '', token);
            expect(result).toEqual({});
        });
    });

    describe('relative path (starts with /)', () => {
        it('should prepend serverUrl and attach auth headers when token is present', () => {
            const result = buildAuthorizedImageSource(serverUrl, '/api/v4/users/x/image', token);
            expect(result).toEqual({
                uri: 'https://kchat.example.com/api/v4/users/x/image',
                headers: {Authorization: token},
            });
        });
    });

    describe('same-origin absolute URI', () => {
        it('should keep uri as-is and attach auth headers when same origin', () => {
            const result = buildAuthorizedImageSource(serverUrl, 'https://kchat.example.com/api/v4/files/x', token);
            expect(result).toEqual({
                uri: 'https://kchat.example.com/api/v4/files/x',
                headers: {Authorization: token},
            });
        });
    });

    describe('external URI', () => {
        it('should return uri WITHOUT auth headers for external https', () => {
            const result = buildAuthorizedImageSource(serverUrl, 'https://evil.example.com/canary.png', token);
            expect(result.uri).toBe('https://evil.example.com/canary.png');
            expect(result.headers).toBeUndefined();
        });

        it('should return uri WITHOUT auth headers for external http', () => {
            const result = buildAuthorizedImageSource(serverUrl, 'http://evil.example.com/canary.png', token);
            expect(result.uri).toBe('http://evil.example.com/canary.png');
            expect(result.headers).toBeUndefined();
        });
    });

    describe('unparseable URI', () => {
        it('should return uri WITHOUT auth headers when new URL() throws', () => {
            const result = buildAuthorizedImageSource(serverUrl, 'http://', token);
            expect(result.uri).toBe('http://');
            expect(result.headers).toBeUndefined();
        });
    });

    describe('token undefined', () => {
        it('should return uri and serverUrl-prefixed path WITHOUT auth headers when token is undefined', () => {
            const result = buildAuthorizedImageSource(serverUrl, '/api/v4/users/x/image');
            expect(result).toEqual({
                uri: 'https://kchat.example.com/api/v4/users/x/image',
            });
            expect(result.headers).toBeUndefined();
        });
    });
});
