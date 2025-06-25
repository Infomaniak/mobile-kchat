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
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const PollItem_1 = __importDefault(require("./PollItem"));
const styles_1 = require("./styles");
const PollsList = ({ setCreateMode }) => {
    const polls = (0, react_redux_1.useSelector)((state) => state['features/polls'].polls);
    const { t } = (0, react_i18next_1.useTranslation)();
    const listPolls = Object.keys(polls);
    const renderItem = (0, react_1.useCallback)(({ item }) => (<PollItem_1.default key={item} pollId={item} setCreateMode={setCreateMode}/>), []);
    const flatlistRef = (0, react_1.useRef)(null);
    const scrollToBottom = () => {
        flatlistRef.current?.scrollToEnd({ animated: true });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [polls]);
    return (<>
            {listPolls.length === 0
            && <react_native_1.View style={styles_1.chatStyles.noPollContent}>
                    <Icon_1.default color={BaseTheme_native_1.default.palette.icon03} size={160} src={svg_1.IconMessage}/>
                    <react_native_paper_1.Text style={styles_1.chatStyles.noPollText}>
                        {t('polls.results.empty')}
                    </react_native_paper_1.Text>
                </react_native_1.View>}
            <react_native_1.FlatList data={listPolls} extraData={listPolls} 
    // eslint-disable-next-line react/jsx-no-bind
    keyExtractor={(item, index) => index.toString()} ref={flatlistRef} renderItem={renderItem}/>
        </>);
};
exports.default = PollsList;
