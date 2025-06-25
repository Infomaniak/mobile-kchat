"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const functions_1 = require("../functions");
/**
 * Implements an abstract class for {@code SharedVideoDialog}.
 */
class AbstractSharedVideoDialog extends react_1.Component {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onSetVideoLink = this._onSetVideoLink.bind(this);
    }
    /**
     * Validates the entered video link by extracting the id and dispatches it.
     *
     * It returns a boolean to comply the Dialog behaviour:
     *     {@code true} - the dialog should be closed.
     *     {@code false} - the dialog should be left open.
     *
    * @param {string} link - The entered video link.
     * @returns {boolean}
     */
    _onSetVideoLink(link) {
        const { onPostSubmit } = this.props;
        const id = (0, functions_1.extractYoutubeIdOrURL)(link);
        if (!id) {
            return false;
        }
        onPostSubmit(id);
        return true;
    }
}
exports.default = AbstractSharedVideoDialog;
