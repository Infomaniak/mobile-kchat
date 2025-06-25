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
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const helpers_1 = require("../../../base/util/helpers");
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
const FaceExpressionsSwitch_1 = __importDefault(require("./FaceExpressionsSwitch"));
const SpeakerStatsLabels_1 = __importDefault(require("./SpeakerStatsLabels"));
const SpeakerStatsList_1 = __importDefault(require("./SpeakerStatsList"));
const SpeakerStatsSearch_1 = __importDefault(require("./SpeakerStatsSearch"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        speakerStats: {
            '& .header': {
                position: 'fixed',
                backgroundColor: theme.palette.ui01,
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
                marginLeft: `-${theme.spacing(4)}`,
                '&.large': {
                    width: '616px'
                },
                '&.medium': {
                    width: '352px'
                },
                '@media (max-width: 448px)': {
                    width: 'calc(100% - 48px) !important'
                },
                '& .upper-header': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    '& .search-switch-container': {
                        display: 'flex',
                        width: '100%',
                        '& .search-container': {
                            width: 175,
                            marginRight: theme.spacing(3)
                        },
                        '& .search-container-full-width': {
                            width: '100%'
                        }
                    },
                    '& .emotions-icons': {
                        display: 'flex',
                        '& svg': {
                            fill: '#000'
                        },
                        '&>div': {
                            marginRight: theme.spacing(3)
                        },
                        '&>div:last-child': {
                            marginRight: 0
                        }
                    }
                }
            },
            '& .row': {
                display: 'flex',
                alignItems: 'center',
                '& .name-time': {
                    width: 'calc(100% - 48px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&.expressions-on': {
                        width: 'calc(47% - 48px)',
                        marginRight: theme.spacing(4)
                    }
                },
                '& .timeline-container': {
                    height: '100%',
                    width: `calc(53% - ${theme.spacing(4)})`,
                    display: 'flex',
                    alignItems: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: theme.palette.ui02,
                    borderLeftStyle: 'solid',
                    '& .timeline': {
                        height: theme.spacing(2),
                        display: 'flex',
                        width: '100%',
                        '&>div': {
                            marginRight: theme.spacing(1),
                            borderRadius: 5
                        },
                        '&>div:first-child': {
                            borderRadius: '0 5px 5px 0'
                        },
                        '&>div:last-child': {
                            marginRight: 0,
                            borderRadius: '5px 0 0 5px'
                        }
                    }
                },
                '& .axis-container': {
                    height: '100%',
                    width: `calc(53% - ${theme.spacing(6)})`,
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: theme.spacing(3),
                    '& div': {
                        borderRadius: 5
                    },
                    '& .axis': {
                        height: theme.spacing(1),
                        display: 'flex',
                        width: '100%',
                        backgroundColor: theme.palette.ui03,
                        position: 'relative',
                        '& .left-bound': {
                            position: 'absolute',
                            bottom: 10,
                            left: 0
                        },
                        '& .right-bound': {
                            position: 'absolute',
                            bottom: 10,
                            right: 0
                        },
                        '& .handler': {
                            position: 'absolute',
                            backgroundColor: theme.palette.ui09,
                            height: 12,
                            marginTop: -4,
                            display: 'flex',
                            justifyContent: 'space-between',
                            '& .resize': {
                                height: '100%',
                                width: 5,
                                cursor: 'col-resize'
                            }
                        }
                    }
                }
            },
            '& .separator': {
                width: 'calc(100% + 48px)',
                height: 1,
                marginLeft: -24,
                backgroundColor: theme.palette.ui02
            }
        }
    };
});
const EMOTIONS_LEGEND = [
    {
        translationKey: 'speakerStats.neutral',
        icon: svg_1.IconEmotionsNeutral
    },
    {
        translationKey: 'speakerStats.happy',
        icon: svg_1.IconEmotionsHappy
    },
    {
        translationKey: 'speakerStats.surprised',
        icon: svg_1.IconEmotionsSurprised
    },
    {
        translationKey: 'speakerStats.sad',
        icon: svg_1.IconEmotionsSad
    },
    {
        translationKey: 'speakerStats.fearful',
        icon: svg_1.IconEmotionsFearful
    },
    {
        translationKey: 'speakerStats.angry',
        icon: svg_1.IconEmotionsAngry
    },
    {
        translationKey: 'speakerStats.disgusted',
        icon: svg_1.IconEmotionsDisgusted
    }
];
const SpeakerStats = () => {
    const { faceLandmarks } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const { showFaceExpressions } = (0, react_redux_1.useSelector)((state) => state['features/speaker-stats']);
    const { clientWidth } = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']);
    const displaySwitch = faceLandmarks?.enableDisplayFaceExpressions && clientWidth > constants_1.DISPLAY_SWITCH_BREAKPOINT;
    const displayLabels = clientWidth > constants_1.MOBILE_BREAKPOINT;
    const dispatch = (0, react_redux_1.useDispatch)();
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const onToggleFaceExpressions = (0, react_1.useCallback)(() => dispatch((0, actions_any_1.toggleFaceExpressions)()), [dispatch]);
    const onSearch = (0, react_1.useCallback)((criteria = '') => {
        dispatch((0, actions_any_1.initSearch)((0, helpers_1.escapeRegexp)(criteria)));
    }, [dispatch]);
    (0, react_1.useEffect)(() => {
        showFaceExpressions && !displaySwitch && dispatch((0, actions_any_1.toggleFaceExpressions)());
    }, [clientWidth]);
    (0, react_1.useEffect)(() => () => {
        dispatch((0, actions_any_1.resetSearchCriteria)());
    }, []);
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { hidden: true }, size: showFaceExpressions ? 'large' : 'medium', titleKey: 'speakerStats.speakerStats' },
        react_1.default.createElement("div", { className: classes.speakerStats },
            react_1.default.createElement("div", { className: `header ${showFaceExpressions ? 'large' : 'medium'}` },
                react_1.default.createElement("div", { className: 'upper-header' },
                    react_1.default.createElement("div", { className: `search-switch-container
                        ${showFaceExpressions ? 'expressions-on' : ''}` },
                        react_1.default.createElement("div", { className: displaySwitch
                                ? 'search-container'
                                : 'search-container-full-width' },
                            react_1.default.createElement(SpeakerStatsSearch_1.default, { onSearch: onSearch })),
                        displaySwitch
                            && react_1.default.createElement(FaceExpressionsSwitch_1.default, { onChange: onToggleFaceExpressions, showFaceExpressions: showFaceExpressions })),
                    showFaceExpressions && react_1.default.createElement("div", { className: 'emotions-icons' }, EMOTIONS_LEGEND.map(emotion => (react_1.default.createElement(Tooltip_1.default, { content: t(emotion.translationKey), key: emotion.translationKey, position: 'top' },
                        react_1.default.createElement(Icon_1.default, { size: 20, src: emotion.icon })))))),
                displayLabels && (react_1.default.createElement(SpeakerStatsLabels_1.default, { showFaceExpressions: showFaceExpressions ?? false }))),
            react_1.default.createElement(SpeakerStatsList_1.default, null))));
};
exports.default = SpeakerStats;
