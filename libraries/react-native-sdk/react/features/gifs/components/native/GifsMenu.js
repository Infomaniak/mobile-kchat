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
const react_native_sdk_1 = require("@giphy/react-native-sdk");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const actions_any_1 = require("../../../chat/actions.any");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const functions_native_1 = require("../../functions.native");
const GifsMenuFooter_1 = __importDefault(require("./GifsMenuFooter"));
const styles_1 = __importDefault(require("./styles"));
const GifsMenu = () => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const rating = (0, react_redux_1.useSelector)(functions_native_1.getGifRating);
    const proxyUrl = (0, react_redux_1.useSelector)(functions_native_1.getGiphyProxyUrl);
    const options = {
        mediaType: react_native_sdk_1.GiphyMediaType.Gif,
        limit: 20,
        rating
    };
    const content = searchQuery === ''
        ? react_native_sdk_1.GiphyContent.trending(options)
        : react_native_sdk_1.GiphyContent.search({
            ...options,
            searchQuery
        });
    const sendGif = (0, react_1.useCallback)(e => {
        const url = (0, functions_native_1.getGifUrl)(e.nativeEvent.media, proxyUrl);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createGifSentEvent)());
        dispatch((0, actions_any_1.sendMessage)((0, functions_native_1.formatGifUrlMessage)(url), true));
        (0, ConferenceNavigationContainerRef_1.goBack)();
    }, []);
    return (<JitsiScreen_1.default footerComponent={GifsMenuFooter_1.default} style={styles_1.default.container}>
            <Input_1.default clearable={true} customStyles={{ container: styles_1.default.customContainer }} onChange={setSearchQuery} placeholder={t('giphy.search')} value={searchQuery}/>
            <react_native_sdk_1.GiphyGridView cellPadding={5} content={content} onMediaSelect={sendGif} style={styles_1.default.grid}/>
        </JitsiScreen_1.default>);
};
exports.default = GifsMenu;
