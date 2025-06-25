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
/**
 * A React component that implements tabs.
 *
 * @returns {ReactElement} The component.
 */
const Tabs = ({ accessibilityLabel, tabs }) => {
    const [current, setCurrent] = (0, react_1.useState)(0);
    const onClick = (0, react_1.useCallback)(index => (event) => {
        event.preventDefault();
        setCurrent(index);
    }, []);
    const onKeyDown = (0, react_1.useCallback)(index => (event) => {
        let newIndex = null;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            newIndex = index === 0 ? tabs.length - 1 : index - 1;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            newIndex = index === tabs.length - 1 ? 0 : index + 1;
        }
        if (newIndex !== null) {
            setCurrent(newIndex);
        }
    }, [tabs]);
    (0, react_1.useEffect)(() => {
        // this test is needed to make sure the effect is triggered because of user actually changing tab
        if (document.activeElement?.getAttribute('role') === 'tab') {
            // @ts-ignore
            document.querySelector(`#${`${tabs[current].id}-tab`}`)?.focus();
        }
    }, [current, tabs]);
    return (react_1.default.createElement("div", { className: 'tab-container' }, tabs.length > 1
        ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { "aria-label": accessibilityLabel, className: 'tab-buttons', role: 'tablist' }, tabs.map((tab, index) => (react_1.default.createElement("button", { "aria-controls": `${tab.id}-panel`, "aria-selected": current === index ? 'true' : 'false', id: `${tab.id}-tab`, key: tab.id, onClick: onClick(index), onKeyDown: onKeyDown(index), role: 'tab', tabIndex: current === index ? undefined : -1 }, tab.label)))),
            tabs.map((tab, index) => (react_1.default.createElement("div", { "aria-labelledby": `${tab.id}-tab`, className: current === index ? 'tab-content' : 'hide', id: `${tab.id}-panel`, key: tab.id, role: 'tabpanel', tabIndex: 0 }, tab.content)))))
        : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h2", { className: 'sr-only' }, accessibilityLabel),
            react_1.default.createElement("div", { className: 'tab-content' }, tabs[0].content)))));
};
exports.default = Tabs;
