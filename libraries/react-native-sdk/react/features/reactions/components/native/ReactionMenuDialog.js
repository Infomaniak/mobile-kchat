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
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/dialog/functions");
const functions_2 = require("../../../base/participants/functions");
const ReactionMenu_1 = __importDefault(require("./ReactionMenu"));
/**
 * The exported React {@code Component}. We need it to execute
 * {@link hideDialog}.
 *
 * XXX It does not break our coding style rule to not utilize globals for state,
 * because it is merely another name for {@code export}'s {@code default}.
 */
let ReactionMenu_; // eslint-disable-line prefer-const
/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
class ReactionMenuDialog extends react_1.PureComponent {
    /**
     * Initializes a new {@code ReactionMenuDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _styles, _width, _height, _participantCount } = this.props;
        return (<react_native_1.SafeAreaView style={_styles}>
                <react_native_1.TouchableWithoutFeedback onPress={this._onCancel}>
                    <react_native_1.View style={_styles}>
                        <react_native_1.View style={{
                left: (_width - 360) / 2,
                top: _height - (_participantCount > 1 ? 144 : 80) - 80
            }}>
                            <ReactionMenu_1.default onCancel={this._onCancel} overflowMenu={false}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.TouchableWithoutFeedback>
            </react_native_1.SafeAreaView>);
    }
    /**
     * Hides this {@code ReactionMenuDialog}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        if (this.props._isOpen) {
            this.props.dispatch((0, actions_1.hideDialog)(ReactionMenu_));
            return true;
        }
        return false;
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _isOpen: (0, functions_1.isDialogOpen)(state, ReactionMenu_),
        _styles: ColorSchemeRegistry_1.default.get(state, 'Toolbox').reactionDialog,
        _width: state['features/base/responsive-ui'].clientWidth,
        _height: state['features/base/responsive-ui'].clientHeight,
        _participantCount: (0, functions_2.getParticipantCount)(state)
    };
}
ReactionMenu_ = (0, react_redux_1.connect)(_mapStateToProps)(ReactionMenuDialog);
exports.default = ReactionMenu_;
