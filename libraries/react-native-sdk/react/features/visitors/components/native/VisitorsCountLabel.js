"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/native/Label"));
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const functions_1 = require("../../functions");
const styles = {
    raisedHandsCountLabel: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.warning02,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        flexDirection: 'row',
        marginLeft: BaseTheme_native_1.default.spacing[0],
        marginBottom: BaseTheme_native_1.default.spacing[0]
    },
    raisedHandsCountLabelText: {
        color: BaseTheme_native_1.default.palette.uiBackground,
        paddingLeft: BaseTheme_native_1.default.spacing[2]
    }
};
const VisitorsCountLabel = () => {
    const visitorsMode = (0, react_redux_1.useSelector)((state) => (0, functions_1.iAmVisitor)(state));
    const visitorsCount = (0, react_redux_1.useSelector)((state) => state['features/visitors'].count || 0);
    return !visitorsMode && visitorsCount > 0 ? (<Label_1.default icon={svg_1.IconUsers} iconColor={BaseTheme_native_1.default.palette.uiBackground} style={styles.raisedHandsCountLabel} text={`${(0, functions_1.getVisitorsShortText)(visitorsCount)}`} textStyle={styles.raisedHandsCountLabelText}/>) : null;
};
exports.default = VisitorsCountLabel;
