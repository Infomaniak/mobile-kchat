"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarLabelCounter = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const styles_1 = require("./styles");
const TabBarLabelCounter = ({ activeUnreadNr, isFocused, label, nbUnread }) => {
    const labelStyles = isFocused
        ? styles_1.navigationStyles.unreadCounterDescriptionFocused
        : styles_1.navigationStyles.unreadCounterDescription;
    return (<react_native_1.View style={styles_1.navigationStyles.unreadCounterContainer}>
            <react_native_1.Text style={labelStyles}>
                {label && label}
            </react_native_1.Text>
            {activeUnreadNr && (<react_native_1.View style={styles_1.navigationStyles.unreadCounterCircle}>
                        <react_native_1.Text style={styles_1.navigationStyles.unreadCounter}>
                            {nbUnread}
                        </react_native_1.Text>
                    </react_native_1.View>)}
        </react_native_1.View>);
};
exports.TabBarLabelCounter = TabBarLabelCounter;
