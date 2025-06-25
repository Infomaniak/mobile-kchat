"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordItem = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const constants_1 = require("../../constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component to render Record data.
 *
 * @param {IProps} props - The props of the component.
 * @returns {React$Element<any>}
 */
const RecordItem = ({ id, name, type, 
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
onClick = () => { } }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const IconRecord = constants_1.RECORD_TYPE[type ?? ''].icon;
    return (<react_native_1.TouchableHighlight onPress={onClick}>
            <react_native_1.View key={`record-${id}`} style={styles_1.default.recordItem} 
    // @ts-ignore
    title={name}>
                <react_native_1.View style={styles_1.default.recordTypeIcon}>
                    {IconRecord && (<Icon_1.default src={IconRecord} style={styles_1.default.recordIcon}/>)}
                </react_native_1.View>
                <react_native_1.View style={styles_1.default.recordDetails}>
                    <react_native_1.Text key={name} numberOfLines={1} style={styles_1.default.recordName}>
                        {name}
                    </react_native_1.Text>
                    <react_native_1.Text key={type} style={styles_1.default.recordType}>
                        {t(constants_1.RECORD_TYPE[type ?? ''].label)}
                    </react_native_1.Text>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.TouchableHighlight>);
};
exports.RecordItem = RecordItem;
