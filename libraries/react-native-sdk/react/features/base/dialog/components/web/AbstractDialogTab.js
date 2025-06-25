"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Abstract React {@code Component} for tabs of the DialogWithTabs component.
 *
 * @augments Component
 */
class AbstractDialogTab extends react_1.Component {
    /**
     * Initializes a new {@code AbstractDialogTab} instance.
     *
     * @param {P} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onChange = this._onChange.bind(this);
    }
    /**
     * Uses the onTabStateChange function to pass the changed state of the
     * controlled tab component to the controlling DialogWithTabs component.
     *
     * @param {Object} change - Object that contains the changed property and
     * value.
     * @returns {void}
     */
    _onChange(change) {
        const { onTabStateChange, tabId } = this.props;
        onTabStateChange(tabId, {
            ...this.props,
            ...change
        });
    }
}
exports.default = AbstractDialogTab;
