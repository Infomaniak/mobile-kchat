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
const actions_1 = require("../../../base/settings/actions");
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const FormRow_1 = __importDefault(require("./FormRow"));
const FormSection_1 = __importDefault(require("./FormSection"));
const styles_1 = __importDefault(require("./styles"));
const { AppInfo } = react_native_1.NativeModules;
const AdvancedSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { disableCrashReporting, disableCallIntegration, disableP2P } = (0, react_redux_1.useSelector)((state) => state['features/base/settings']);
    const onSwitchToggled = (0, react_1.useCallback)((name) => (enabled) => {
        if (name === 'disableCrashReporting' && enabled === true) {
            react_native_1.Alert.alert(t('settingsView.alertTitle'), t('settingsView.disableCrashReportingWarning'), [
                {
                    onPress: () => dispatch((0, actions_1.updateSettings)({ disableCrashReporting: true })),
                    text: t('settingsView.alertOk')
                },
                {
                    text: t('settingsView.alertCancel')
                }
            ]);
        }
        else {
            dispatch((0, actions_1.updateSettings)({ [name]: enabled }));
        }
    }, [dispatch, actions_1.updateSettings]);
    const switches = (0, react_1.useMemo)(() => {
        const partialSwitches = [
            {
                label: 'settingsView.disableCallIntegration',
                state: disableCallIntegration,
                name: 'disableCallIntegration'
            },
            {
                label: 'settingsView.disableP2P',
                state: disableP2P,
                name: 'disableP2P'
            },
            {
                label: 'settingsView.disableCrashReporting',
                state: disableCrashReporting,
                name: 'disableCrashReporting'
            }
        ];
        if (react_native_1.Platform.OS !== 'android') {
            partialSwitches.shift();
        }
        if (!AppInfo.GOOGLE_SERVICES_ENABLED) {
            partialSwitches.pop();
        }
        return partialSwitches;
    }, [disableCallIntegration, disableP2P, disableCrashReporting]);
    return (<>
            <FormSection_1.default label='settingsView.advanced'>
                {switches.map(({ label, state, name }) => (<FormRow_1.default key={label} label={label}>
                            <Switch_1.default checked={Boolean(state)} onChange={onSwitchToggled(name)}/>
                        </FormRow_1.default>))}
            </FormSection_1.default>
            {/* @ts-ignore */}
            <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
            <FormSection_1.default label='settingsView.buildInfoSection'>
                <FormRow_1.default label='settingsView.version'>
                    <react_native_1.Text style={styles_1.default.text}>
                        {`${AppInfo.version} build ${AppInfo.buildNumber}`}
                    </react_native_1.Text>
                </FormRow_1.default>
                <FormRow_1.default label='settingsView.sdkVersion'>
                    <react_native_1.Text style={styles_1.default.text}>
                        {AppInfo.sdkVersion}
                    </react_native_1.Text>
                </FormRow_1.default>
            </FormSection_1.default>
        </>);
};
exports.default = AdvancedSection;
