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
const functions_1 = require("../../styles/functions");
/**
 * Abstract (base) class for container of React {@link Component} children with
 * a style.
 *
 * @augments Component
 */
class AbstractContainer extends react_1.Component {
    /**
     * Renders this {@code AbstractContainer} as a React {@code Component} of a
     * specific type.
     *
     * @param {string|ReactClass} type - The type of the React {@code Component}
     * which is to be rendered.
     * @param {Object|undefined} props - The read-only React {@code Component}
     * properties, if any, to render. If undefined, the props of this instance
     * will be rendered.
     * @protected
     * @returns {ReactElement}
     */
    _render(type, props) {
        const { children, style, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        // The following properties are defined for the benefit of
        // AbstractContainer and its extenders so they are to not be
        // propagated.
        touchFeedback, visible, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...filteredProps } = props || this.props;
        const _style = (0, functions_1.getFixedPlatformStyle)(style);
        return react_1.default.createElement(type, {
            style: _style,
            ...filteredProps
        }, children);
    }
}
exports.default = AbstractContainer;
