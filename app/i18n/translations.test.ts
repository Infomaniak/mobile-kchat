// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import da from '@assets/i18n/da.json';
import de from '@assets/i18n/de.json';
import el from '@assets/i18n/el.json';
import en from '@assets/i18n/en.json';
import es from '@assets/i18n/es.json';
import fi from '@assets/i18n/fi.json';
import fr from '@assets/i18n/fr.json';
import itJson from '@assets/i18n/it.json';
import nb from '@assets/i18n/nb.json';
import nl from '@assets/i18n/nl.json';
import pl from '@assets/i18n/pl.json';
import pt from '@assets/i18n/pt.json';
import sv from '@assets/i18n/sv.json';

// Regression guard for RM-636845: an i18n sync silently dropped the
// infomaniak.post_info.post_reminder.* keys from fr.json, leaving the
// reminder picker title in French while its options fell back to the
// English defaultMessage. Every kChat string must exist in every locale.
const translationsByLocale = {da, de, el, es, fi, fr, itJson, nb, nl, pl, pt, sv};

const kchatKeys = Object.keys(en).filter((key) => key.startsWith('infomaniak.'));
const locales = Object.keys(translationsByLocale);

describe('translations', () => {
    it('should define kChat strings in en.json', () => {
        expect(kchatKeys.length).toBeGreaterThan(0);
    });

    it.each(locales)('should provide every kChat string in %s.json', (locale) => {
        const translations = translationsByLocale[locale as keyof typeof translationsByLocale] as Record<string, string>;
        const missing = kchatKeys.filter((key) => !translations[key]?.trim());

        expect(missing).toEqual([]);
    });
});
