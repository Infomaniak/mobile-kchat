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
const actions_1 = require("../../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../../base/dialog/components/native/BottomSheet"));
const Button_1 = __importDefault(require("../../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../../base/ui/constants.native");
const actions_any_1 = require("../../../actions.any");
const styles_native_1 = __importDefault(require("../styles.native"));
const HighlightDialog = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const closeDialog = (0, react_1.useCallback)(() => dispatch((0, actions_1.hideSheet)()), [dispatch]);
    const highlightMoment = (0, react_1.useCallback)(() => {
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_any_1.highlightMeetingMoment)());
            dispatch((0, actions_1.hideSheet)());
        });
    }, [dispatch]);
    return (<BottomSheet_1.default>
            <react_native_1.View style={styles_native_1.default.highlightDialog}>
                <react_native_1.Text style={styles_native_1.default.highlightDialogHeading}>
                    {`${t('recording.highlightMoment')}?`}
                </react_native_1.Text>
                <react_native_1.Text style={styles_native_1.default.highlightDialogText}>
                    {t('recording.highlightMomentSucessDescription')}
                </react_native_1.Text>
                <react_native_1.View style={styles_native_1.default.highlightDialogButtonsContainer}>
                    <Button_1.default accessibilityLabel='dialog.Cancel' labelKey='dialog.Cancel' onClick={closeDialog} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>
                    <react_native_1.View style={styles_native_1.default.highlightDialogButtonsSpace}/>
                    <Button_1.default accessibilityLabel='recording.highlight' labelKey='recording.highlight' onClick={highlightMoment} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
                </react_native_1.View>
            </react_native_1.View>
        </BottomSheet_1.default>);
};
exports.default = HighlightDialog;
