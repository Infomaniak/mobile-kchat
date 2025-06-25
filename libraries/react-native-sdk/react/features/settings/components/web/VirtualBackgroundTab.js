"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const AbstractDialogTab_1 = __importDefault(require("../../../base/dialog/components/web/AbstractDialogTab"));
const functions_1 = require("../../../base/i18n/functions");
const VirtualBackgrounds_1 = __importDefault(require("../../../virtual-background/components/VirtualBackgrounds"));
const styles = () => {
    return {
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
        }
    };
};
/**
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class VirtualBackgroundTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code ModeratorTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onOptionsChanged = this._onOptionsChanged.bind(this);
    }
    /**
     * Callback invoked to select if follow-me mode
     * should be activated.
     *
     * @param {Object} options - The new background options.
     *
     * @returns {void}
     */
    _onOptionsChanged(options) {
        super._onChange({ options });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { options, selectedVideoInputId } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.container, id: 'virtual-background-dialog', key: 'virtual-background' },
            react_1.default.createElement(VirtualBackgrounds_1.default, { onOptionsChange: this._onOptionsChanged, options: options, selectedThumbnail: options.selectedThumbnail ?? '', selectedVideoInputId: selectedVideoInputId })));
    }
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)(VirtualBackgroundTab), styles);
