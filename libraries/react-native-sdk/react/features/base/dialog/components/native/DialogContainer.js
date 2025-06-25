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
const react_redux_1 = require("react-redux");
const ReactionEmoji_1 = __importDefault(require("../../../../reactions/components/native/ReactionEmoji"));
const functions_native_1 = require("../../../../reactions/functions.native");
const AbstractDialogContainer_1 = __importStar(require("../AbstractDialogContainer"));
/**
 * Implements a DialogContainer responsible for showing all dialogs. We will
 * need a separate container so we can handle multiple dialogs by showing them
 * simultaneously or queueing them.
 *
 * @augments AbstractDialogContainer
 */
class DialogContainer extends AbstractDialogContainer_1.default {
    /**
     * Returns the reactions to be displayed.
     *
     * @returns {Array<React$Element>}
     */
    _renderReactions() {
        const { _reactionsQueue } = this.props;
        return _reactionsQueue.map(({ reaction, uid }, index) => (<ReactionEmoji_1.default index={index} key={uid} reaction={reaction} uid={uid}/>));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<react_1.Fragment>
                {this._renderReactions()}
                {this._renderDialogContent()}
            </react_1.Fragment>);
    }
}
const mapStateToProps = (state) => {
    return {
        ...(0, AbstractDialogContainer_1.abstractMapStateToProps)(state),
        _reactionsQueue: (0, functions_native_1.getReactionsQueue)(state)
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(DialogContainer);
