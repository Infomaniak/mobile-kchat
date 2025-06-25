"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the gifs menu footer component.
 *
 * @returns { JSX.Element} - The gifs menu footer component.
 */
const GifsMenuFooter = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<react_native_1.View style={styles_1.default.credit}>
            <react_native_1.Text style={styles_1.default.creditText}>
                {t('poweredby')}
            </react_native_1.Text>
            <react_native_1.Image source={require('../../../../../images/GIPHY_logo.png')}/>
        </react_native_1.View>);
};
exports.default = GifsMenuFooter;
