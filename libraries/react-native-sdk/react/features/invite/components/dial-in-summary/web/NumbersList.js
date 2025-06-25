"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_iso_countries_1 = __importDefault(require("i18n-iso-countries"));
const en_json_1 = __importDefault(require("i18n-iso-countries/langs/en.json"));
const react_1 = __importStar(require("react"));
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
i18n_iso_countries_1.default.registerLocale(en_json_1.default);
const NumbersList = ({ t, conferenceID, clickableNumbers, numbers: numbersMapping }) => {
    const renderFlag = (0, react_1.useCallback)((countryCode) => {
        if (countryCode) {
            return (react_1.default.createElement("td", { className: 'flag-cell' }, countryCode === 'SIP' || countryCode === 'SIP_AUDIO_ONLY'
                ? react_1.default.createElement(Icon_1.default, { src: svg_1.IconSip })
                : react_1.default.createElement("i", { className: `flag iti-flag ${countryCode}` })));
        }
        return null;
    }, []);
    const renderNumberLink = (0, react_1.useCallback)((number) => {
        if (clickableNumbers) {
            // Url encode # to %23, Android phone was cutting the # after
            // clicking it.
            // Seems that using ',' and '%23' works on iOS and Android.
            return (react_1.default.createElement("a", { href: `tel:${number},${conferenceID}%23`, key: number }, number));
        }
        return number;
    }, [conferenceID, clickableNumbers]);
    const renderNumbersList = (0, react_1.useCallback)((numbers) => {
        const numbersListItems = numbers.map(number => (react_1.default.createElement("li", { className: 'dial-in-number', key: number.formattedNumber }, renderNumberLink(number.formattedNumber))));
        return (react_1.default.createElement("ul", { className: 'numbers-list' }, numbersListItems));
    }, []);
    const renderNumbersTollFreeList = (0, react_1.useCallback)((numbers) => {
        const tollNumbersListItems = numbers.map(number => (react_1.default.createElement("li", { className: 'toll-free', key: number.formattedNumber }, number.tollFree ? t('info.dialInTollFree') : '')));
        return (react_1.default.createElement("ul", { className: 'toll-free-list' }, tollNumbersListItems));
    }, []);
    const renderNumbers = (0, react_1.useMemo)(() => {
        let numbers;
        if (!numbersMapping) {
            return;
        }
        if (Array.isArray(numbersMapping)) {
            numbers = numbersMapping.reduce((resultNumbers, number) => {
                // The i18n-iso-countries package insists on upper case.
                const countryCode = number.countryCode.toUpperCase();
                let countryName;
                if (countryCode === 'SIP') {
                    countryName = t('info.sip');
                }
                else if (countryCode === 'SIP_AUDIO_ONLY') {
                    countryName = t('info.sipAudioOnly');
                }
                else {
                    countryName = t(`countries:countries.${countryCode}`);
                    // Some countries have multiple names as US ['United States of America', 'USA']
                    // choose the first one if that is the case
                    if (!countryName) {
                        countryName = t(`countries:countries.${countryCode}.0`);
                    }
                }
                if (resultNumbers[countryName]) {
                    resultNumbers[countryName].push(number);
                }
                else {
                    resultNumbers[countryName] = [number];
                }
                return resultNumbers;
            }, {});
        }
        else {
            numbers = {};
            for (const [country, numbersArray] of Object.entries(numbersMapping.numbers)) {
                if (Array.isArray(numbersArray)) {
                    /* eslint-disable arrow-body-style */
                    const formattedNumbers = numbersArray.map(number => ({
                        formattedNumber: number
                    }));
                    /* eslint-enable arrow-body-style */
                    numbers[country] = formattedNumbers;
                }
            }
        }
        const rows = [];
        Object.keys(numbers).forEach((countryName) => {
            const numbersArray = numbers[countryName];
            const countryCode = numbersArray[0].countryCode
                || i18n_iso_countries_1.default.getAlpha2Code(countryName, 'en')?.toUpperCase()
                || countryName;
            rows.push(react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("tr", { key: countryName },
                    renderFlag(countryCode),
                    react_1.default.createElement("td", { className: 'country' }, countryName)),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", { className: 'numbers-list-column' }, renderNumbersList(numbersArray)),
                    react_1.default.createElement("td", { className: 'toll-free-list-column' }, renderNumbersTollFreeList(numbersArray)))));
        });
        return rows;
    }, [numbersMapping]);
    return (react_1.default.createElement("table", { className: 'dial-in-numbers-list' },
        react_1.default.createElement("tbody", { className: 'dial-in-numbers-body' }, renderNumbers)));
};
exports.default = (0, functions_1.translate)(NumbersList);
