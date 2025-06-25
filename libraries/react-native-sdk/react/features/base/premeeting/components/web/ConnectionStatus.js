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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../i18n/functions");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const svg_1 = require("../../../icons/svg");
const functions_web_1 = require("../../../styles/functions.web");
const variables_1 = require("../../../ui/components/variables");
const constants_1 = require("../../constants");
const functions_2 = require("../../functions");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        connectionStatus: {
            color: '#fff',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            position: 'absolute',
            width: '100%',
            [theme.breakpoints.down(400)]: {
                margin: 0,
                width: '100%'
            },
            '@media (max-width: 720px)': {
                margin: `${theme.spacing(4)} auto`,
                position: 'fixed',
                top: 0,
                width: variables_1.PREJOIN_DEFAULT_CONTENT_WIDTH
            },
            // mobile phone landscape
            '@media (max-height: 420px)': {
                display: 'none'
            },
            '& .con-status-header': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                alignItems: 'center',
                display: 'flex',
                padding: '12px 16px',
                borderRadius: theme.shape.borderRadius
            },
            '& .con-status-circle': {
                borderRadius: '50%',
                display: 'inline-block',
                padding: theme.spacing(1),
                marginRight: theme.spacing(2)
            },
            '& .con-status--good': {
                background: '#31B76A'
            },
            '& .con-status--poor': {
                background: '#E12D2D'
            },
            '& .con-status--non-optimal': {
                background: '#E39623'
            },
            '& .con-status-arrow': {
                marginLeft: 'auto',
                transition: 'background-color 0.16s ease-out'
            },
            '& .con-status-arrow--up': {
                transform: 'rotate(180deg)'
            },
            '& .con-status-arrow > svg': {
                cursor: 'pointer'
            },
            '& .con-status-arrow:hover': {
                backgroundColor: 'rgba(1, 1, 1, 0.1)'
            },
            '& .con-status-text': {
                textAlign: 'center'
            },
            '& .con-status-details': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderTop: '1px solid #5E6D7A',
                padding: theme.spacing(3),
                transition: 'opacity 0.16s ease-out'
            },
            '& .con-status-details-visible': {
                opacity: 1
            },
            '& .con-status-details-hidden': {
                opacity: 0
            }
        }
    };
});
const CONNECTION_TYPE_MAP = {
    [constants_1.CONNECTION_TYPE.POOR]: {
        connectionClass: 'con-status--poor',
        icon: svg_1.IconWifi1Bar,
        connectionText: 'prejoin.connection.poor'
    },
    [constants_1.CONNECTION_TYPE.NON_OPTIMAL]: {
        connectionClass: 'con-status--non-optimal',
        icon: svg_1.IconWifi2Bars,
        connectionText: 'prejoin.connection.nonOptimal'
    },
    [constants_1.CONNECTION_TYPE.GOOD]: {
        connectionClass: 'con-status--good',
        icon: svg_1.IconWifi3Bars,
        connectionText: 'prejoin.connection.good'
    }
};
/**
 * Component displaying information related to the connection & audio/video quality.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function ConnectionStatus({ connectionDetails, t, connectionType }) {
    const { classes } = useStyles();
    const [showDetails, toggleDetails] = (0, react_1.useState)(false);
    const arrowClassName = showDetails
        ? 'con-status-arrow con-status-arrow--up'
        : 'con-status-arrow';
    const detailsText = connectionDetails?.map(d => t(d)).join(' ');
    const detailsClassName = showDetails
        ? 'con-status-details-visible'
        : 'con-status-details-hidden';
    const onToggleDetails = (0, react_1.useCallback)(e => {
        e.preventDefault();
        toggleDetails(!showDetails);
    }, [showDetails, toggleDetails]);
    const onKeyPressToggleDetails = (0, react_1.useCallback)(e => {
        if (toggleDetails && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            toggleDetails(!showDetails);
        }
    }, [showDetails, toggleDetails]);
    if (connectionType === constants_1.CONNECTION_TYPE.NONE) {
        return null;
    }
    const { connectionClass, icon, connectionText } = CONNECTION_TYPE_MAP[connectionType ?? ''];
    return (react_1.default.createElement("div", { className: classes.connectionStatus },
        react_1.default.createElement("div", { "aria-level": 1, className: 'con-status-header', role: 'heading' },
            react_1.default.createElement("div", { className: `con-status-circle ${connectionClass}` },
                react_1.default.createElement(Icon_1.default, { size: 16, src: icon })),
            react_1.default.createElement("span", { "aria-hidden": !showDetails, className: 'con-status-text', id: 'connection-status-description' }, t(connectionText)),
            react_1.default.createElement(Icon_1.default, { ariaDescribedBy: 'connection-status-description', ariaPressed: showDetails, className: arrowClassName, onClick: onToggleDetails, onKeyPress: onKeyPressToggleDetails, role: 'button', size: 24, src: svg_1.IconArrowDown, tabIndex: 0 })),
        react_1.default.createElement("div", { "aria-level": 2, className: `con-status-details ${detailsClassName}`, role: 'heading' }, detailsText)));
}
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function mapStateToProps() {
    const { connectionDetails, connectionType } = (0, functions_2.getConnectionData)();
    return {
        connectionDetails,
        connectionType
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(ConnectionStatus));
