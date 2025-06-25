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
const react_native_1 = require("react-native");
const functions_1 = require("../../../base/i18n/functions");
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a React {@code Component} which renders a standardized row on a
 * form. The component should have exactly one child component.
 */
class FormRow extends react_1.Component {
    /**
     * Initializes a new {@code FormRow} instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);
        react_1.default.Children.only(this.props.children);
        this._getDefaultFieldProps = this._getDefaultFieldProps.bind(this);
        this._getRowStyle = this._getRowStyle.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @override
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;
        // Some field types need additional props to look good and standardized
        // on a form.
        const newChild = react_1.default.cloneElement(this.props.children, this._getDefaultFieldProps(this.props.children));
        return (<react_native_1.View style={this._getRowStyle()}>
                <react_native_1.View style={styles_1.default.fieldLabelContainer}>
                    <react_native_1.Text style={[
                styles_1.default.text,
                styles_1.default.fieldLabelText
            ]}>
                        {t(this.props.label)}
                    </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles_1.default.fieldValueContainer}>
                    {newChild}
                </react_native_1.View>
            </react_native_1.View>);
    }
    /**
     * Assembles the default props to the field child component of this form
     * row.
     *
     * Currently tested/supported field types:
     *     - TextInput
     *     - Switch (needs no addition props ATM).
     *
     * @param {Object} field - The field (child) component.
     * @private
     * @returns {Object}
     */
    _getDefaultFieldProps(field) {
        if (field?.type) { // @ts-ignore
            switch (field.type.displayName) {
                case 'TextInput':
                    return {
                        placeholderTextColor: styles_1.PLACEHOLDER_COLOR,
                        style: [
                            styles_1.default.textInputField,
                            this.props.layout === 'column' ? styles_1.default.textInputFieldColumn : undefined
                        ],
                        underlineColorAndroid: styles_1.ANDROID_UNDERLINE_COLOR
                    };
            }
        }
        return {};
    }
    /**
     * Assembles the row style array based on the row's props.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getRowStyle() {
        const { fieldSeparator, layout } = this.props;
        const rowStyle = [
            styles_1.default.fieldContainer
        ];
        if (fieldSeparator) {
            rowStyle.push(styles_1.default.fieldSeparator);
        }
        if (layout === 'column') {
            rowStyle.push(styles_1.default.fieldContainerColumn);
        }
        return rowStyle;
    }
}
exports.default = (0, functions_1.translate)(FormRow);
