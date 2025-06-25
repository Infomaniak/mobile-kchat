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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const styles_1 = __importStar(require("./styles"));
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code Label}.
 */
class ExpandedLabel extends react_1.Component {
    /**
     * Instantiates a new {@code ExpandedLabel} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            opacityAnimation: new react_native_1.Animated.Value(0)
        };
    }
    /**
     * Implements React {@code Component}'s componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount() {
        react_native_1.Animated.decay(this.state.opacityAnimation, {
            toValue: 1,
            velocity: 1,
            useNativeDriver: true
        }).start();
    }
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        return (<react_native_1.Animated.View style={[styles_1.default.expandedLabelContainer,
                this.props.style,
                { opacity: this.state.opacityAnimation }
            ]}>
                <react_native_1.View style={[styles_1.default.expandedLabelTextContainer,
                { backgroundColor: this._getColor() || styles_1.DEFAULT_COLOR }]}>
                    <react_native_1.Text style={styles_1.default.expandedLabelText}>
                        {this._getLabel()}
                    </react_native_1.Text>
                </react_native_1.View>
            </react_native_1.Animated.View>);
    }
    /**
     * Defines the color of the expanded label. This function returns a default
     * value if implementing classes don't override it, but the goal is to have
     * expanded labels matching to circular labels in color.
     * If implementing classes return a falsy value, it also uses the default
     * color.
     *
     * @returns {string}
     */
    _getColor() {
        return styles_1.DEFAULT_COLOR;
    }
}
exports.default = ExpandedLabel;
