// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment';
import {getLocales} from 'react-native-localize';
import 'moment/min/locales';

import en from '@assets/i18n/en.json';
import {logError} from '@utils/log';

import availableLanguages from './languages';

const PRIMARY_LOCALE = 'en';
const deviceLocale = getLocales()[0]?.languageTag || PRIMARY_LOCALE;
export const DEFAULT_LOCALE = getLocaleFromLanguage(deviceLocale);

function loadTranslation(locale?: string): {[x: string]: string} {
    try {
        let translations: {[x: string]: string};

        switch (locale) {
            case 'de':
                require('@formatjs/intl-pluralrules/locale-data/de');
                require('@formatjs/intl-numberformat/locale-data/de');
                require('@formatjs/intl-datetimeformat/locale-data/de');

                translations = require('@assets/i18n/de.json');
                break;
            case 'es':
                require('@formatjs/intl-pluralrules/locale-data/es');
                require('@formatjs/intl-numberformat/locale-data/es');
                require('@formatjs/intl-datetimeformat/locale-data/es');

                translations = require('@assets/i18n/es.json');
                break;
            case 'fr':
                require('@formatjs/intl-pluralrules/locale-data/fr');
                require('@formatjs/intl-numberformat/locale-data/fr');
                require('@formatjs/intl-datetimeformat/locale-data/fr');

                translations = require('@assets/i18n/fr.json');
                break;
            case 'it':
                require('@formatjs/intl-pluralrules/locale-data/it');
                require('@formatjs/intl-numberformat/locale-data/it');
                require('@formatjs/intl-datetimeformat/locale-data/it');

                translations = require('@assets/i18n/it.json');
                break;
            default:
                require('@formatjs/intl-pluralrules/locale-data/en');
                require('@formatjs/intl-numberformat/locale-data/en');
                require('@formatjs/intl-datetimeformat/locale-data/en');

                translations = en;
                break;
        }

        return translations;
    } catch (e) {
        logError('NO Translation found', e);
        return en;
    }
}

export function getLocaleFromLanguage(lang: string) {
    const languageCode = lang.split('-')[0];
    const locale = availableLanguages[lang] || availableLanguages[languageCode] || PRIMARY_LOCALE;
    return locale;
}

export function resetMomentLocale(locale?: string) {
    moment.locale(locale?.split('-')[0] || DEFAULT_LOCALE.split('-')[0]);
}

export function getTranslations(lang: string) {
    const locale = getLocaleFromLanguage(lang);
    return loadTranslation(locale);
}

export function getLocalizedMessage(lang: string, id: string, defaultMessage?: string) {
    const locale = getLocaleFromLanguage(lang);
    const translations = getTranslations(locale);

    return translations[id] || defaultMessage || '';
}

export function t(v: string): string {
    return v;
}
