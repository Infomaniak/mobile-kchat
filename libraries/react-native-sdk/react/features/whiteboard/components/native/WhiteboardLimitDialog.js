"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const Link_1 = __importDefault(require("../../../base/react/components/native/Link"));
const functions_1 = require("../../functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders the whiteboard user limit dialog.
 *
 * @returns {JSX.Element}
 */
const WhiteboardLimitDialog = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { limitUrl } = (0, react_redux_1.useSelector)(functions_1.getWhiteboardConfig);
    return (<ConfirmDialog_1.default cancelLabel={'dialog.Ok'} descriptionKey={'dialog.whiteboardLimitContent'} isConfirmHidden={true} title={'dialog.whiteboardLimitTitle'}>
            {limitUrl && (<react_native_1.Text style={styles_1.default.limitUrlText}>
                    {` ${t('dialog.whiteboardLimitReference')}
`}
                    <Link_1.default style={styles_1.default.limitUrl} url={limitUrl}>
                        {t('dialog.whiteboardLimitReferenceUrl')}
                    </Link_1.default>
                    .
                </react_native_1.Text>)}
        </ConfirmDialog_1.default>);
};
exports.default = WhiteboardLimitDialog;
