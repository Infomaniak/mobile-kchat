"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const index_1 = require("../../base/media/components/index");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            position: 'relative',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: theme.spacing(4),
            backgroundColor: theme.palette.uiBackground
        },
        video: {
            height: 'auto',
            width: '100%',
            overflow: 'hidden'
        },
        errorText: {
            color: theme.palette.text01,
            left: 0,
            position: 'absolute',
            right: 0,
            textAlign: 'center',
            top: '50%'
        }
    };
});
const VideoInputPreview = ({ error, localFlipX, track }) => {
    const { classes, cx } = useStyles();
    return (react_1.default.createElement("div", { className: classes.container },
        react_1.default.createElement(index_1.Video, { className: cx(classes.video, localFlipX && 'flipVideoX'), playsinline: true, videoTrack: { jitsiTrack: track } }),
        error && (react_1.default.createElement("div", { className: classes.errorText }, error))));
};
exports.default = VideoInputPreview;
