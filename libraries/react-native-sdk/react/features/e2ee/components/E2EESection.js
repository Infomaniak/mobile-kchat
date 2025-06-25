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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const Switch_1 = __importDefault(require("../../base/ui/components/web/Switch"));
const actions_1 = require("../actions");
const constants_1 = require("../constants");
const functions_2 = require("../functions");
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        e2eeSection: {
            display: 'flex',
            flexDirection: 'column'
        },
        description: {
            fontSize: '13px',
            margin: '15px 0'
        },
        controlRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            '& label': {
                fontSize: '14px',
                fontWeight: 'bold'
            }
        }
    };
});
/**
 * Implements a React {@code Component} for displaying a security dialog section with a field
 * for setting the E2EE key.
 *
 * @param {IProps} props - Component's props.
 * @returns  {JSX}
 */
const E2EESection = ({ _descriptionResource, _enabled, _e2eeLabels, _everyoneSupportE2EE, _toggled, dispatch }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [toggled, setToggled] = (0, react_1.useState)(_toggled ?? false);
    (0, react_1.useEffect)(() => {
        setToggled(_toggled);
    }, [_toggled]);
    /**
     * Callback to be invoked when the user toggles E2EE on or off.
     *
     * @private
     * @returns {void}
     */
    const _onToggle = (0, react_1.useCallback)(() => {
        const newValue = !toggled;
        setToggled(newValue);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createE2EEEvent)(`enabled.${String(newValue)}`));
        dispatch((0, actions_1.toggleE2EE)(newValue));
    }, [toggled]);
    const description = _e2eeLabels?.description || t(_descriptionResource ?? '');
    const label = _e2eeLabels?.label || t('dialog.e2eeLabel');
    const warning = _e2eeLabels?.warning || t('dialog.e2eeWarning');
    return (react_1.default.createElement("div", { className: classes.e2eeSection, id: 'e2ee-section' },
        react_1.default.createElement("p", { "aria-live": 'polite', className: classes.description, id: 'e2ee-section-description' },
            description,
            !_everyoneSupportE2EE && react_1.default.createElement("br", null),
            !_everyoneSupportE2EE && warning),
        react_1.default.createElement("div", { className: classes.controlRow },
            react_1.default.createElement("label", { htmlFor: 'e2ee-section-switch' }, label),
            react_1.default.createElement(Switch_1.default, { checked: toggled, disabled: !_enabled, id: 'e2ee-section-switch', onChange: _onToggle }))));
};
/**
 * Maps (parts of) the Redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { enabled: e2eeEnabled, maxMode } = state['features/e2ee'];
    const { e2ee = {} } = state['features/base/config'];
    let descriptionResource = '';
    if (e2ee.labels) {
        // When e2eeLabels are present, the description resource is ignored.
        descriptionResource = undefined;
    }
    else if (maxMode === constants_1.MAX_MODE.THRESHOLD_EXCEEDED) {
        descriptionResource = 'dialog.e2eeDisabledDueToMaxModeDescription';
    }
    else if (maxMode === constants_1.MAX_MODE.ENABLED) {
        descriptionResource = e2eeEnabled
            ? 'dialog.e2eeWillDisableDueToMaxModeDescription' : 'dialog.e2eeDisabledDueToMaxModeDescription';
    }
    else {
        descriptionResource = 'dialog.e2eeDescription';
    }
    return {
        _descriptionResource: descriptionResource,
        _e2eeLabels: e2ee.labels,
        _enabled: maxMode === constants_1.MAX_MODE.DISABLED || e2eeEnabled,
        _toggled: e2eeEnabled,
        _everyoneSupportE2EE: Boolean((0, functions_2.doesEveryoneSupportE2EE)(state))
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps)(E2EESection);
