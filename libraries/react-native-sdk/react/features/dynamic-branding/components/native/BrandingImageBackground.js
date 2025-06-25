"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const react_redux_1 = require("react-redux");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that displays a branding background image.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
const BrandingImageBackground = ({ uri }) => {
    const imageType = uri?.substr(uri.lastIndexOf('/') + 1);
    const imgSrc = uri ? uri : undefined;
    let backgroundImage;
    if (!uri) {
        return null;
    }
    if (imageType?.includes('.svg')) {
        backgroundImage
            = (<react_native_svg_1.SvgUri height='100%' 
            // Force uniform scaling.
            // Align the <min-x> of the element's viewBox
            // with the smallest X value of the viewport.
            // Align the <min-y> of the element's viewBox
            // with the smallest Y value of the viewport.
            preserveAspectRatio='xMinYMin' style={styles_1.default.brandingImageBackgroundSvg} uri={imgSrc ?? null} viewBox='0 0 400 650' width='100%'/>);
    }
    else {
        backgroundImage
            = (<react_native_1.Image source={{ uri: imgSrc }} style={styles_1.default.brandingImageBackground}/>);
    }
    return backgroundImage;
};
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code DialInLink} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { backgroundImageUrl } = state['features/dynamic-branding'];
    return {
        uri: backgroundImageUrl
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(BrandingImageBackground);
