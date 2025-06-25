"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_any_1 = require("../../../base/config/functions.any");
const functions_1 = require("../../../base/participants/functions");
const DisplayName_1 = __importDefault(require("../../../display-name/components/web/DisplayName"));
const StatusIndicators_1 = __importDefault(require("./StatusIndicators"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        nameContainer: {
            display: 'flex',
            overflow: 'hidden',
            '&>div': {
                display: 'flex',
                overflow: 'hidden'
            }
        }
    };
});
const ThumbnailBottomIndicators = ({ className, local, participantId, showStatusIndicators = true, thumbnailType }) => {
    const { classes: styles, cx } = useStyles();
    const _allowEditing = !(0, react_redux_1.useSelector)(functions_any_1.isNameReadOnly);
    const _defaultLocalDisplayName = interfaceConfig.DEFAULT_LOCAL_DISPLAY_NAME;
    const _showDisplayName = (0, react_redux_1.useSelector)(functions_any_1.isDisplayNameVisible);
    const isVirtualScreenshareParticipant = (0, react_redux_1.useSelector)((state) => (0, functions_1.isScreenShareParticipantById)(state, participantId));
    return (react_1.default.createElement("div", { className: cx(className, 'bottom-indicators') },
        showStatusIndicators && react_1.default.createElement(StatusIndicators_1.default, { audio: !isVirtualScreenshareParticipant, moderator: true, participantID: participantId, screenshare: isVirtualScreenshareParticipant, thumbnailType: thumbnailType }),
        _showDisplayName && (react_1.default.createElement("span", { className: styles.nameContainer },
            react_1.default.createElement(DisplayName_1.default, { allowEditing: local ? _allowEditing : false, displayNameSuffix: local ? _defaultLocalDisplayName : '', elementID: local ? 'localDisplayName' : `participant_${participantId}_name`, participantID: participantId, thumbnailType: thumbnailType })))));
};
exports.default = ThumbnailBottomIndicators;
