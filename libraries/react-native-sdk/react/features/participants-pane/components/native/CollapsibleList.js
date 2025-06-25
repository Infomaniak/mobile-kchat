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
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const styles_1 = __importDefault(require("../../../breakout-rooms/components/native/styles"));
const CollapsibleList = ({ children, onLongPress, title }) => {
    const [collapsed, setCollapsed] = (0, react_1.useState)(false);
    const _toggleCollapsed = (0, react_1.useCallback)(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);
    return (<react_native_1.View>
            <react_native_1.TouchableOpacity onLongPress={onLongPress} onPress={_toggleCollapsed} style={styles_1.default.collapsibleList}>
                <react_native_1.TouchableOpacity onPress={_toggleCollapsed} style={styles_1.default.arrowIcon}>
                    <Icon_1.default size={18} src={collapsed ? svg_1.IconArrowDown : svg_1.IconArrowUp}/>
                </react_native_1.TouchableOpacity>
                <react_native_1.Text style={styles_1.default.listTile}>
                    {title}
                </react_native_1.Text>
            </react_native_1.TouchableOpacity>
            {!collapsed && children}
        </react_native_1.View>);
};
exports.default = CollapsibleList;
