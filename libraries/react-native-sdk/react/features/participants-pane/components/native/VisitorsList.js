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
const react_redux_1 = require("react-redux");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const actions_1 = require("../../../visitors/actions");
const functions_1 = require("../../../visitors/functions");
const VisitorsItem_1 = require("./VisitorsItem");
const styles_1 = __importDefault(require("./styles"));
const VisitorsList = () => {
    const visitorsCount = (0, react_redux_1.useSelector)((state) => state['features/visitors'].count || 0);
    const dispatch = (0, react_redux_1.useDispatch)();
    const requests = (0, react_redux_1.useSelector)(functions_1.getPromotionRequests);
    const admitAll = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.admitMultiple)(requests));
    }, [dispatch, requests]);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (visitorsCount <= 0) {
        return null;
    }
    let title = t('participantsPane.headings.visitors', { count: visitorsCount });
    if (requests.length > 0) {
        title += t('participantsPane.headings.visitorRequests', { count: requests.length });
    }
    return (<>
            <react_native_1.View style={styles_1.default.listDetails}>
                <react_native_1.Text style={styles_1.default.visitorsLabel}>
                    {title}
                </react_native_1.Text>
                {requests.length > 1 && (<Button_1.default accessibilityLabel='participantsPane.actions.admitAll' labelKey='participantsPane.actions.admitAll' mode={constants_native_1.BUTTON_MODES.TEXT} onClick={admitAll} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>)}
            </react_native_1.View>
            {requests.map(r => (<VisitorsItem_1.VisitorsItem key={r.from} request={r}/>))}
        </>);
};
exports.default = VisitorsList;
