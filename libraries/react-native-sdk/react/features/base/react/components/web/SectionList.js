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
const Container_1 = __importDefault(require("./Container"));
/**
 * Implements a React/Web {@link Component} for displaying a list with
 * sections similar to React Native's {@code SectionList} in order to
 * facilitate cross-platform source code.
 *
 * @augments Component
 */
class SectionList extends react_1.Component {
    /**
     * Renders the content of this component.
     *
     * @returns {React.ReactNode}
     */
    render() {
        const { ListEmptyComponent, renderSectionHeader, renderItem, sections, keyExtractor } = this.props;
        /**
         * If there are no recent items we don't want to display anything.
         */
        if (sections) {
            return (react_1.default.createElement(Container_1.default, { className: 'navigate-section-list' }, sections.length === 0
                ? ListEmptyComponent
                : sections.map((section, sectionIndex) => (react_1.default.createElement(Container_1.default, { key: sectionIndex },
                    renderSectionHeader(section),
                    section.data
                        .map((item, listIndex) => {
                        const listItem = {
                            item
                        };
                        return renderItem(listItem, keyExtractor(section, listIndex));
                    }))))));
        }
        return null;
    }
}
exports.default = SectionList;
