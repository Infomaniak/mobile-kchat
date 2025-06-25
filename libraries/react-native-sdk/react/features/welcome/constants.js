"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsTabBarOptions = exports.calendarListTabBarOptions = exports.recentListTabBarOptions = exports.tabBarOptions = exports.INACTIVE_TAB_COLOR = exports.ACTIVE_TAB_COLOR = void 0;
const react_1 = __importDefault(require("react"));
const svg_1 = require("../base/icons/svg");
const BaseTheme_1 = __importDefault(require("../base/ui/components/BaseTheme"));
const TabIcon_1 = __importDefault(require("./components/TabIcon"));
exports.ACTIVE_TAB_COLOR = BaseTheme_1.default.palette.icon01;
exports.INACTIVE_TAB_COLOR = BaseTheme_1.default.palette.icon03;
exports.tabBarOptions = {
    tabBarActiveTintColor: exports.ACTIVE_TAB_COLOR,
    tabBarInactiveTintColor: exports.INACTIVE_TAB_COLOR,
    tabBarLabelStyle: {
        fontSize: 12
    },
    tabBarStyle: {
        backgroundColor: BaseTheme_1.default.palette.ui01
    }
};
exports.recentListTabBarOptions = {
    tabBarIcon: ({ focused }) => (react_1.default.createElement(TabIcon_1.default, { focused: focused, src: svg_1.IconRestore }))
};
exports.calendarListTabBarOptions = {
    tabBarIcon: ({ focused }) => (react_1.default.createElement(TabIcon_1.default, { focused: focused, src: svg_1.IconCalendar }))
};
exports.settingsTabBarOptions = {
    tabBarIcon: ({ focused }) => (react_1.default.createElement(TabIcon_1.default, { focused: focused, src: svg_1.IconGear }))
};
