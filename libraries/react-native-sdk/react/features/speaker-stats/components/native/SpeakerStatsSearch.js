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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const helpers_1 = require("../../../base/util/helpers");
const actions_native_1 = require("../../actions.native");
const functions_1 = require("../../functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * React component for display an individual user's speaker stats.
 *
 * @returns {React$Element<any>}
 */
const SpeakerStatsSearch = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const onSearch = (0, react_1.useCallback)((criteria = '') => {
        dispatch((0, actions_native_1.initSearch)((0, helpers_1.escapeRegexp)(criteria)));
        setSearchQuery((0, helpers_1.escapeRegexp)(criteria));
    }, [dispatch]);
    const disableSpeakerStatsSearch = (0, react_redux_1.useSelector)(functions_1.isSpeakerStatsSearchDisabled);
    if (disableSpeakerStatsSearch) {
        return null;
    }
    return (<Input_1.default accessibilityLabel={t('speakerStats.searchHint')} clearable={true} customStyles={{ container: styles_1.default.customContainer }} icon={svg_1.IconSearch} onChange={onSearch} placeholder={t('speakerStats.search')} value={searchQuery}/>);
};
exports.default = (0, react_native_paper_1.withTheme)(SpeakerStatsSearch);
