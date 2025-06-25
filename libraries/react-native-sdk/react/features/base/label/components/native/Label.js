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
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_native_1 = require("../../../styles/functions.native");
const styles_1 = __importDefault(require("./styles"));
/**
 * Const for status string 'in progress'.
 */
const STATUS_IN_PROGRESS = 'in_progress';
/**
 * Const for status string 'off'.
 */
const STATUS_OFF = 'off';
/**
 * Renders a circular indicator to be used for status icons, such as recording
 * on, audio-only conference, video quality and similar.
 */
class Label extends react_1.Component {
    /**
     * Instantiates a new instance of {@code Label}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            pulseAnimation: new react_native_1.Animated.Value(0)
        };
    }
    /**
     * Implements {@code Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._maybeToggleAnimation({}, this.props);
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        this._maybeToggleAnimation(prevProps, this.props);
    }
    /**
     * Implements React {@link Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        const { icon, text, status, style, iconColor, textStyle } = this.props;
        let extraStyle = null;
        switch (status) {
            case STATUS_IN_PROGRESS:
                extraStyle = {
                    opacity: this.state.pulseAnimation
                };
                break;
            case STATUS_OFF:
                extraStyle = styles_1.default.labelOff;
                break;
        }
        return (<react_native_1.Animated.View style={[
                (0, functions_native_1.combineStyles)(styles_1.default.labelContainer, style ?? {}),
                extraStyle
            ]}>
                {icon && <Icon_1.default color={iconColor} size='18' src={icon}/>}
                {text && <react_native_1.Text style={[styles_1.default.labelText, textStyle]}>
                    {text}
                </react_native_1.Text>}
            </react_native_1.Animated.View>);
    }
    /**
     * Checks if the animation has to be started or stopped and acts
     * accordingly.
     *
     * @param {IProps} oldProps - The previous values of the Props.
     * @param {IProps} newProps - The new values of the Props.
     * @returns {void}
     */
    _maybeToggleAnimation(oldProps, newProps) {
        const { status: oldStatus } = oldProps;
        const { status: newStatus } = newProps;
        const { pulseAnimation } = this.state;
        if (newStatus === STATUS_IN_PROGRESS
            && oldStatus !== STATUS_IN_PROGRESS) {
            // Animation must be started
            this.animationReference = react_native_1.Animated.loop(react_native_1.Animated.sequence([
                react_native_1.Animated.timing(pulseAnimation, {
                    delay: 500,
                    toValue: 1,
                    useNativeDriver: true
                }),
                react_native_1.Animated.timing(pulseAnimation, {
                    toValue: 0.3,
                    useNativeDriver: true
                })
            ]));
            this.animationReference.start();
        }
        else if (this.animationReference
            && newStatus !== STATUS_IN_PROGRESS
            && oldStatus === STATUS_IN_PROGRESS) {
            // Animation must be stopped
            this.animationReference.stop();
        }
    }
}
exports.default = Label;
