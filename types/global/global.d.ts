// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Entries} from 'type-fest';

declare global {
    interface ObjectConstructor {

    // Fixes Object.entries not returning "keyof T" and ValueOf<T>
    // Ref. https://stackoverflow.com/a/73913412
    entries<T extends object>(o: T): Entries<T>;
  }
}
