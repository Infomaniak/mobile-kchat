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
const mui_1 = require("tss-react/mui");
const uuid_1 = require("uuid");
const functions_1 = require("../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const functions_web_1 = require("../../base/styles/functions.web");
const constants_1 = require("../constants");
const functions_2 = require("../functions");
const logger_1 = __importDefault(require("../logger"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        label: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            color: theme.palette.link01,
            marginBottom: theme.spacing(3),
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
        },
        addBackground: {
            marginRight: theme.spacing(3),
            '& svg': {
                fill: `${theme.palette.link01} !important`
            }
        },
        input: {
            display: 'none'
        }
    };
});
/**
 * Component used to upload an image.
 *
 * @param {Object} Props - The props of the component.
 * @returns {React$Node}
 */
function UploadImageButton({ setLoading, setOptions, setStoredImages, showLabel, storedImages, t }) {
    const { classes } = useStyles();
    const uploadImageButton = (0, react_1.useRef)(null);
    const uploadImageKeyPress = (0, react_1.useCallback)(e => {
        if (uploadImageButton.current && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            uploadImageButton.current.click();
        }
    }, [uploadImageButton.current]);
    const uploadImage = (0, react_1.useCallback)(async (e) => {
        const reader = new FileReader();
        const imageFile = e.target.files;
        reader.readAsDataURL(imageFile[0]);
        reader.onload = async () => {
            const url = await (0, functions_2.resizeImage)(reader.result);
            const uuId = (0, uuid_1.v4)();
            setStoredImages([
                ...storedImages,
                {
                    id: uuId,
                    src: url
                }
            ]);
            setOptions({
                backgroundEffectEnabled: true,
                backgroundType: constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE,
                selectedThumbnail: uuId,
                virtualSource: url
            });
        };
        logger_1.default.info('New virtual background image uploaded!');
        reader.onerror = () => {
            setLoading(false);
            logger_1.default.error('Failed to upload virtual image!');
        };
    }, [storedImages]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        showLabel && react_1.default.createElement("label", { className: classes.label, htmlFor: 'file-upload', onKeyPress: uploadImageKeyPress, tabIndex: 0 },
            react_1.default.createElement(Icon_1.default, { className: classes.addBackground, size: 24, src: svg_1.IconPlus }),
            t('virtualBackground.addBackground')),
        react_1.default.createElement("input", { accept: 'image/*', className: classes.input, id: 'file-upload', onChange: uploadImage, ref: uploadImageButton, type: 'file' })));
}
exports.default = (0, functions_1.translate)(UploadImageButton);
