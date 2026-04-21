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
            case 'nb':
                require('@formatjs/intl-pluralrules/locale-data/nb');
                require('@formatjs/intl-numberformat/locale-data/nb');
                require('@formatjs/intl-datetimeformat/locale-data/nb');

                translations = require('@assets/i18n/nb.json');
                break;
            case 'sv':
                require('@formatjs/intl-pluralrules/locale-data/sv');
                require('@formatjs/intl-numberformat/locale-data/sv');
                require('@formatjs/intl-datetimeformat/locale-data/sv');

                translations = require('@assets/i18n/sv.json');
                break;
            case 'el':
                require('@formatjs/intl-pluralrules/locale-data/el');
                require('@formatjs/intl-numberformat/locale-data/el');
                require('@formatjs/intl-datetimeformat/locale-data/el');

                translations = require('@assets/i18n/el.json');
                break;
            case 'da':
                require('@formatjs/intl-pluralrules/locale-data/da');
                require('@formatjs/intl-numberformat/locale-data/da');
                require('@formatjs/intl-datetimeformat/locale-data/da');

                translations = require('@assets/i18n/da.json');
                break;
            case 'fi':
                require('@formatjs/intl-pluralrules/locale-data/fi');
                require('@formatjs/intl-numberformat/locale-data/fi');
                require('@formatjs/intl-datetimeformat/locale-data/fi');

                translations = require('@assets/i18n/fi.json');
                break;
            case 'pt':
                require('@formatjs/intl-pluralrules/locale-data/pt');
                require('@formatjs/intl-numberformat/locale-data/pt');
                require('@formatjs/intl-datetimeformat/locale-data/pt');

                translations = require('@assets/i18n/pt.json');
                break;
            case 'nl':
                require('@formatjs/intl-pluralrules/locale-data/nl');
                require('@formatjs/intl-numberformat/locale-data/nl');
                require('@formatjs/intl-datetimeformat/locale-data/nl');

                translations = require('@assets/i18n/nl.json');
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
