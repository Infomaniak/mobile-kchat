// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';

import {isHasManyAssociation, prepareDestroyPermanentlyChildrenAssociatedRecords} from './general';

import type {AssociationInfo} from '@nozbe/watermelondb/Model';

describe('isHasManyAssociation', () => {
    it('should return true for a valid has_many association', () => {
        const association: AssociationInfo = {
            type: 'has_many',
            foreignKey: 'user_id',
        };

        expect(isHasManyAssociation(association)).toBe(true);
    });

    it('should return false for an association without type "has_many"', () => {
        const association: AssociationInfo = {
            type: 'belongs_to',
            key: 'user_id',
        };

        expect(isHasManyAssociation(association)).toBe(false);
    });

    it('should return false for an association without a foreignKey', () => {
        // @ts-expect-error foreginKey is missing
        const association: AssociationInfo = {
            type: 'has_many',
        };

        expect(isHasManyAssociation(association)).toBe(false);
    });

    it('should return false for an invalid association object', () => {
        const association = {
            type: 'has_many',
        };

        expect(isHasManyAssociation(association as AssociationInfo)).toBe(false);
    });
});

describe('prepareDestroyPermanentlyChildrenAssociatedRecords', () => {

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase('test.server.com');
    });

    it('should handle empty records array', async () => {
        const result = await prepareDestroyPermanentlyChildrenAssociatedRecords([]);

        expect(result).toEqual([]);
    });
});
