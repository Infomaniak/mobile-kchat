// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import fs from 'fs';
import path from 'path';

describe('Theme Reactivity Regression', () => {
    it('should keep Appearance.addChangeListener for reactive theme switching', () => {
        const sourcePath = path.join(__dirname, 'index.tsx');
        const source = fs.readFileSync(sourcePath, 'utf8');

        // Regression: these must NEVER be removed or the theme will stop
        // reacting to system appearance changes.
        expect(source).toContain('Appearance.addChangeListener');
        expect(source).toContain('useEffect(() => {');
        expect(source).toContain('Appearance');
    });
});
