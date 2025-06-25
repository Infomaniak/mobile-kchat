"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const styles_1 = require("./styles");
const ConnectingPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<JitsiScreen_1.default style={styles_1.navigationStyles.connectingScreenContainer}>
            <react_native_1.View style={styles_1.navigationStyles.connectingScreenContent}>
                <react_native_1.SafeAreaView>
                    <LoadingIndicator_1.default color={styles_1.TEXT_COLOR} size='large'/>
                    <react_native_1.Text style={styles_1.navigationStyles.connectingScreenText}>
                        {t('connectingOverlay.joiningRoom')}
                    </react_native_1.Text>
                </react_native_1.SafeAreaView>
            </react_native_1.View>
        </JitsiScreen_1.default>);
};
exports.default = ConnectingPage;
