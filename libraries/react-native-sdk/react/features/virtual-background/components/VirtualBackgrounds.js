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
// @ts-ignore
const jitsi_local_storage_1 = require("@jitsi/js-utils/jitsi-local-storage");
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const json_1 = require("@jitsi/js-utils/json");
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const functions_web_1 = require("../../base/styles/functions.web");
const Tooltip_1 = __importDefault(require("../../base/tooltip/components/Tooltip"));
const Spinner_1 = __importDefault(require("../../base/ui/components/web/Spinner"));
const constants_1 = require("../constants");
const functions_2 = require("../functions");
const logger_1 = __importDefault(require("../logger"));
const UploadImageButton_1 = __importDefault(require("./UploadImageButton"));
const VirtualBackgroundPreview_1 = __importDefault(require("./VirtualBackgroundPreview"));
const onError = (event) => {
    event.target.style.display = 'none';
};
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        virtualBackgroundLoading: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50px'
        },
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        thumbnailContainer: {
            width: '100%',
            display: 'inline-grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            gap: theme.spacing(1),
            '@media (min-width: 608px) and (max-width: 712px)': {
                gridTemplateColumns: '1fr 1fr 1fr 1fr'
            },
            '@media (max-width: 607px)': {
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: theme.spacing(2)
            }
        },
        thumbnail: {
            height: '54px',
            width: '100%',
            borderRadius: '4px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.text01,
            objectFit: 'cover',
            [['&:hover', '&:focus']]: {
                opacity: 0.5,
                cursor: 'pointer',
                '& ~ .delete-image-icon': {
                    display: 'block'
                }
            },
            '@media (max-width: 607px)': {
                height: '70px'
            }
        },
        selectedThumbnail: {
            border: `2px solid ${theme.palette.action01Hover}`
        },
        noneThumbnail: {
            backgroundColor: theme.palette.ui04
        },
        slightBlur: {
            boxShadow: 'inset 0 0 12px #000000',
            background: '#a4a4a4'
        },
        blur: {
            boxShadow: 'inset 0 0 12px #000000',
            background: '#7e8287'
        },
        storedImageContainer: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&:focus-within .delete-image-container': {
                display: 'block'
            }
        },
        deleteImageIcon: {
            position: 'absolute',
            top: '3px',
            right: '3px',
            background: theme.palette.ui03,
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'none',
            '@media (max-width: 607px)': {
                display: 'block',
                padding: '3px'
            },
            [['&:hover', '&:focus']]: {
                display: 'block'
            }
        }
    };
});
/**
 * Renders virtual background dialog.
 *
 * @returns {ReactElement}
 */
function VirtualBackgrounds({ _images, _showUploadButton, onOptionsChange, options, selectedVideoInputId, t }) {
    const { classes, cx } = useStyles();
    const [previewIsLoaded, setPreviewIsLoaded] = (0, react_1.useState)(false);
    const localImages = jitsi_local_storage_1.jitsiLocalStorage.getItem('virtualBackgrounds');
    const [storedImages, setStoredImages] = (0, react_1.useState)((localImages && (0, json_1.safeJsonParse)(localImages)) || []);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const deleteStoredImage = (0, react_1.useCallback)(e => {
        const imageId = e.currentTarget.getAttribute('data-imageid');
        setStoredImages(storedImages.filter(item => item.id !== imageId));
    }, [storedImages]);
    const deleteStoredImageKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            deleteStoredImage(e);
        }
    }, [deleteStoredImage]);
    /**
     * Updates stored images on local storage.
     */
    (0, react_1.useEffect)(() => {
        try {
            jitsi_local_storage_1.jitsiLocalStorage.setItem('virtualBackgrounds', JSON.stringify(storedImages));
        }
        catch (err) {
            // Preventing localStorage QUOTA_EXCEEDED_ERR
            err && setStoredImages(storedImages.slice(1));
        }
        if (storedImages.length === constants_1.BACKGROUNDS_LIMIT) {
            setStoredImages(storedImages.slice(1));
        }
    }, [storedImages]);
    const enableBlur = (0, react_1.useCallback)(async () => {
        onOptionsChange({
            backgroundEffectEnabled: true,
            backgroundType: constants_1.VIRTUAL_BACKGROUND_TYPE.BLUR,
            blurValue: 25,
            selectedThumbnail: 'blur'
        });
        logger_1.default.info('"Blur" option set for virtual background preview!');
    }, []);
    const enableBlurKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            enableBlur();
        }
    }, [enableBlur]);
    const enableSlideBlur = (0, react_1.useCallback)(async () => {
        onOptionsChange({
            backgroundEffectEnabled: true,
            backgroundType: constants_1.VIRTUAL_BACKGROUND_TYPE.BLUR,
            blurValue: 8,
            selectedThumbnail: 'slight-blur'
        });
        logger_1.default.info('"Slight-blur" option set for virtual background preview!');
    }, []);
    const enableSlideBlurKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            enableSlideBlur();
        }
    }, [enableSlideBlur]);
    const removeBackground = (0, react_1.useCallback)(async () => {
        onOptionsChange({
            backgroundEffectEnabled: false,
            selectedThumbnail: 'none'
        });
        logger_1.default.info('"None" option set for virtual background preview!');
    }, []);
    const removeBackgroundKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            removeBackground();
        }
    }, [removeBackground]);
    const setUploadedImageBackground = (0, react_1.useCallback)(async (e) => {
        const imageId = e.currentTarget.getAttribute('data-imageid');
        const image = storedImages.find(img => img.id === imageId);
        if (image) {
            onOptionsChange({
                backgroundEffectEnabled: true,
                backgroundType: constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE,
                selectedThumbnail: image.id,
                virtualSource: image.src
            });
            logger_1.default.info('Uploaded image set for virtual background preview!');
        }
    }, [storedImages]);
    const setImageBackground = (0, react_1.useCallback)(async (e) => {
        const imageId = e.currentTarget.getAttribute('data-imageid');
        const image = _images.find(img => img.id === imageId);
        if (image) {
            try {
                const url = await (0, functions_2.toDataURL)(image.src);
                onOptionsChange({
                    backgroundEffectEnabled: true,
                    backgroundType: constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE,
                    selectedThumbnail: image.id,
                    virtualSource: url
                });
                logger_1.default.info('Image set for virtual background preview!');
            }
            catch (err) {
                logger_1.default.error('Could not fetch virtual background image:', err);
            }
            setLoading(false);
        }
    }, []);
    const setImageBackgroundKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setImageBackground(e);
        }
    }, [setImageBackground]);
    const setUploadedImageBackgroundKeyPress = (0, react_1.useCallback)(e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setUploadedImageBackground(e);
        }
    }, [setUploadedImageBackground]);
    const loadedPreviewState = (0, react_1.useCallback)(async (loaded) => {
        await setPreviewIsLoaded(loaded);
    }, []);
    // create a full list of {backgroundId: backgroundLabel} to easily retrieve label of selected background
    const labelsMap = {
        none: t('virtualBackground.none'),
        'slight-blur': t('virtualBackground.slightBlur'),
        blur: t('virtualBackground.blur'),
        ..._images.reduce((acc, image) => {
            acc[image.id] = image.tooltip ? t(`virtualBackground.${image.tooltip}`) : '';
            return acc;
        }, {}),
        ...storedImages.reduce((acc, image, index) => {
            acc[image.id] = t('virtualBackground.uploadedImage', { index: index + 1 });
            return acc;
        }, {})
    };
    const currentBackgroundLabel = options?.selectedThumbnail ? labelsMap[options.selectedThumbnail] : labelsMap.none;
    const isThumbnailSelected = (0, react_1.useCallback)(thumbnail => options?.selectedThumbnail === thumbnail, [options]);
    const getSelectedThumbnailClass = (0, react_1.useCallback)(thumbnail => isThumbnailSelected(thumbnail) && classes.selectedThumbnail, [isThumbnailSelected, options]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(VirtualBackgroundPreview_1.default, { loadedPreview: loadedPreviewState, options: options, selectedVideoInputId: selectedVideoInputId }),
        loading ? (react_1.default.createElement("div", { className: classes.virtualBackgroundLoading },
            react_1.default.createElement(Spinner_1.default, null))) : (react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement("span", { className: 'sr-only', id: 'virtual-background-current-info' }, t('virtualBackground.accessibilityLabel.currentBackground', {
                background: currentBackgroundLabel
            })),
            _showUploadButton
                && react_1.default.createElement(UploadImageButton_1.default, { setLoading: setLoading, setOptions: onOptionsChange, setStoredImages: setStoredImages, showLabel: previewIsLoaded, storedImages: storedImages }),
            react_1.default.createElement("div", { "aria-describedby": 'virtual-background-current-info', "aria-label": t('virtualBackground.accessibilityLabel.selectBackground'), className: classes.thumbnailContainer, role: 'radiogroup', tabIndex: -1 },
                react_1.default.createElement(Tooltip_1.default, { content: t('virtualBackground.removeBackground'), position: 'top' },
                    react_1.default.createElement("div", { "aria-checked": isThumbnailSelected('none'), "aria-label": t('virtualBackground.removeBackground'), className: cx(classes.thumbnail, classes.noneThumbnail, getSelectedThumbnailClass('none')), onClick: removeBackground, onKeyPress: removeBackgroundKeyPress, role: 'radio', tabIndex: 0 }, t('virtualBackground.none'))),
                react_1.default.createElement(Tooltip_1.default, { content: t('virtualBackground.slightBlur'), position: 'top' },
                    react_1.default.createElement("div", { "aria-checked": isThumbnailSelected('slight-blur'), "aria-label": t('virtualBackground.slightBlur'), className: cx(classes.thumbnail, classes.slightBlur, getSelectedThumbnailClass('slight-blur')), onClick: enableSlideBlur, onKeyPress: enableSlideBlurKeyPress, role: 'radio', tabIndex: 0 }, t('virtualBackground.slightBlur'))),
                react_1.default.createElement(Tooltip_1.default, { content: t('virtualBackground.blur'), position: 'top' },
                    react_1.default.createElement("div", { "aria-checked": isThumbnailSelected('blur'), "aria-label": t('virtualBackground.blur'), className: cx(classes.thumbnail, classes.blur, getSelectedThumbnailClass('blur')), onClick: enableBlur, onKeyPress: enableBlurKeyPress, role: 'radio', tabIndex: 0 }, t('virtualBackground.blur'))),
                _images.map(image => (react_1.default.createElement(Tooltip_1.default, { content: (image.tooltip && t(`virtualBackground.${image.tooltip}`)) ?? '', key: image.id, position: 'top' },
                    react_1.default.createElement("img", { alt: image.tooltip && t(`virtualBackground.${image.tooltip}`), "aria-checked": isThumbnailSelected(image.id), className: cx(classes.thumbnail, getSelectedThumbnailClass(image.id)), "data-imageid": image.id, onClick: setImageBackground, onError: onError, onKeyPress: setImageBackgroundKeyPress, role: 'radio', src: image.src, tabIndex: 0 })))),
                storedImages.map((image, index) => (react_1.default.createElement("div", { className: classes.storedImageContainer, key: image.id },
                    react_1.default.createElement("img", { alt: t('virtualBackground.uploadedImage', { index: index + 1 }), "aria-checked": isThumbnailSelected(image.id), className: cx(classes.thumbnail, getSelectedThumbnailClass(image.id)), "data-imageid": image.id, onClick: setUploadedImageBackground, onError: onError, onKeyPress: setUploadedImageBackgroundKeyPress, role: 'radio', src: image.src, tabIndex: 0 }),
                    react_1.default.createElement(Icon_1.default, { ariaLabel: t('virtualBackground.deleteImage'), className: cx(classes.deleteImageIcon, 'delete-image-icon'), "data-imageid": image.id, onClick: deleteStoredImage, onKeyPress: deleteStoredImageKeyPress, role: 'button', size: 16, src: svg_1.IconCloseLarge, tabIndex: 0 })))))))));
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VirtualBackground} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{Props}}
 */
function _mapStateToProps(state) {
    const dynamicBrandingImages = state['features/dynamic-branding'].virtualBackgrounds;
    const hasBrandingImages = Boolean(dynamicBrandingImages.length);
    return {
        _images: (hasBrandingImages && dynamicBrandingImages) || constants_1.IMAGES,
        _showUploadButton: !state['features/base/config'].disableAddingBackgroundImages
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)((0, functions_1.translate)(VirtualBackgrounds));
