"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACK_COLOR = exports.LOCAL_RECORDING = exports.ICON_USERS = exports.ICON_INFO = exports.ICON_CLOUD = exports.DROPBOX_LOGO = void 0;
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const functions_1 = require("../../../base/color-scheme/functions");
const BoxModel_1 = require("../../../base/styles/components/styles/BoxModel");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
/* eslint-disable @typescript-eslint/no-var-requires */
exports.DROPBOX_LOGO = require('../../../../../images/dropboxLogo_square.png');
exports.ICON_CLOUD = require('../../../../../images/icon-cloud.png');
exports.ICON_INFO = require('../../../../../images/icon-info.png');
exports.ICON_USERS = require('../../../../../images/icon-users.png');
exports.LOCAL_RECORDING = require('../../../../../images/downloadLocalRecording.png');
exports.TRACK_COLOR = BaseTheme_native_1.default.palette.ui07;
/* eslint-enable @typescript-eslint/no-var-requires */
// XXX The "standard" {@code BoxModel.padding} has been deemed insufficient in
// the special case(s) of the recording feature below.
const _PADDING = BoxModel_1.BoxModel.padding * 1.5;
const header = {
    alignItems: 'center',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: _PADDING,
    paddingTop: _PADDING
};
const recordingIcon = {
    width: BaseTheme_native_1.default.spacing[4],
    height: BaseTheme_native_1.default.spacing[4]
};
const title = {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: BoxModel_1.BoxModel.padding
};
exports.default = {
    /**
     * Container for the StartRecordingDialog screen.
     */
    startRecodingContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Label for the start recording button.
     */
    startRecordingLabel: {
        color: BaseTheme_native_1.default.palette.text01,
        marginRight: 12
    },
    highlightButton: {
        backgroundColor: BaseTheme_native_1.default.palette.ui09,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: BaseTheme_native_1.default.spacing[0],
        marginBottom: BaseTheme_native_1.default.spacing[0],
        marginRight: BaseTheme_native_1.default.spacing[1]
    },
    highlightButtonText: {
        color: BaseTheme_native_1.default.palette.field01,
        paddingLeft: BaseTheme_native_1.default.spacing[2],
        ...BaseTheme_native_1.default.typography.labelBold
    },
    highlightDialog: {
        paddingLeft: BaseTheme_native_1.default.spacing[3],
        paddingRight: BaseTheme_native_1.default.spacing[3],
        paddingTop: BaseTheme_native_1.default.spacing[4],
        paddingBottom: BaseTheme_native_1.default.spacing[7]
    },
    highlightDialogHeading: {
        ...BaseTheme_native_1.default.typography.heading5,
        color: BaseTheme_native_1.default.palette.text01,
        marginBottom: BaseTheme_native_1.default.spacing[3]
    },
    highlightDialogText: {
        ...BaseTheme_native_1.default.typography.bodyLongRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginBottom: BaseTheme_native_1.default.spacing[5]
    },
    highlightDialogButtonsContainer: {
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    highlightDialogButtonsSpace: {
        height: 16,
        width: '100%'
    }
};
/**
 * Color schemed styles for the @{code StartRecordingDialogContent} component.
 */
ColorSchemeRegistry_1.default.register('StartRecordingDialogContent', {
    container: {
        flex: 0,
        flexDirection: 'column'
    },
    controlDisabled: {
        opacity: 0.5
    },
    header: {
        ...header,
        marginHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    headerIntegrations: {
        ...header,
        paddingHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    headerInfo: {
        ...header,
        backgroundColor: BaseTheme_native_1.default.palette.warning02,
        marginBottom: BaseTheme_native_1.default.spacing[4],
        paddingHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    loggedIn: {
        paddingHorizontal: _PADDING
    },
    recordingIcon: {
        ...recordingIcon
    },
    recordingInfoIcon: {
        ...recordingIcon
    },
    recordingText: {
        color: BaseTheme_native_1.default.palette.text01
    },
    switch: {
        color: BaseTheme_native_1.default.palette.ui10
    },
    title: {
        ...title
    },
    titleInfo: {
        ...title,
        color: BaseTheme_native_1.default.palette.ui01
    },
    text: {
        color: (0, functions_1.schemeColor)('text')
    }
});
