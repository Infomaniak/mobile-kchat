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
const react_redux_1 = require("react-redux");
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
/**
 * Animated reaction emoji.
 *
 * @returns {ReactElement}
 */
function ReactionEmoji({ reaction, uid, index }) {
    const _styles = (0, react_redux_1.useSelector)((state) => ColorSchemeRegistry_1.default.get(state, 'Toolbox'));
    const _height = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui'].clientHeight);
    const dispatch = (0, react_redux_1.useDispatch)();
    const animationVal = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const vh = (0, react_1.useState)(_height / 100)[0];
    const randomInt = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);
    const animationIndex = (0, react_1.useMemo)(() => index % 21, [index]);
    const coordinates = (0, react_1.useState)({
        topX: animationIndex === 0 ? 40 : randomInt(-100, 100),
        topY: animationIndex === 0 ? -70 : randomInt(-65, -75),
        bottomX: animationIndex === 0 ? 140 : randomInt(150, 200),
        bottomY: animationIndex === 0 ? -50 : randomInt(-40, -50)
    })[0];
    (0, react_1.useEffect)(() => {
        setTimeout(() => dispatch((0, actions_any_1.removeReaction)(uid)), 5000);
    }, []);
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.timing(animationVal, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true
        }).start();
    }, [animationVal]);
    return (<react_native_1.Animated.Text style={{
            ..._styles.emojiAnimation,
            transform: [
                { translateY: animationVal.interpolate({
                        inputRange: [0, 0.70, 0.75, 1],
                        outputRange: [0, coordinates.topY * vh, coordinates.topY * vh, coordinates.bottomY * vh]
                    })
                }, {
                    translateX: animationVal.interpolate({
                        inputRange: [0, 0.70, 0.75, 1],
                        outputRange: [0, coordinates.topX, coordinates.topX,
                            coordinates.topX < 0 ? -coordinates.bottomX : coordinates.bottomX]
                    })
                }, {
                    scale: animationVal.interpolate({
                        inputRange: [0, 0.70, 0.75, 1],
                        outputRange: [0.6, 1.5, 1.5, 1]
                    })
                }
            ],
            opacity: animationVal.interpolate({
                inputRange: [0, 0.7, 0.75, 1],
                outputRange: [1, 1, 1, 0]
            })
        }}>
            {constants_1.REACTIONS[reaction].emoji}
        </react_native_1.Animated.Text>);
}
exports.default = ReactionEmoji;
