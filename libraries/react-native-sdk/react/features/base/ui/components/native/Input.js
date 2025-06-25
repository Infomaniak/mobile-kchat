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
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const svg_1 = require("../../../icons/svg");
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
const inputStyles_1 = __importDefault(require("./inputStyles"));
const Input = (0, react_1.forwardRef)(({ accessibilityLabel, autoCapitalize, autoFocus, blurOnSubmit, bottomLabel, clearable, customStyles, disabled, error, icon, id, keyboardType, label, maxLength, minHeight, multiline, numberOfLines, onBlur, onChange, onFocus, onKeyPress, onSubmitEditing, placeholder, pointerEvents, returnKeyType, secureTextEntry, textContentType, value }, ref) => {
    const [focused, setFocused] = (0, react_1.useState)(false);
    const handleChange = (0, react_1.useCallback)((e) => {
        const { nativeEvent: { text } } = e;
        onChange?.(text);
    }, [onChange]);
    const clearInput = (0, react_1.useCallback)(() => {
        onChange?.('');
    }, [onChange]);
    const handleBlur = (0, react_1.useCallback)((e) => {
        setFocused(false);
        onBlur?.(e);
    }, [onBlur]);
    const handleFocus = (0, react_1.useCallback)((e) => {
        setFocused(true);
        onFocus?.(e);
    }, [onFocus]);
    const handleKeyPress = (0, react_1.useCallback)((e) => {
        onKeyPress?.(e);
    }, [onKeyPress]);
    const handleSubmitEditing = (0, react_1.useCallback)((e) => {
        const { nativeEvent: { text } } = e;
        onSubmitEditing?.(text);
    }, [onSubmitEditing]);
    return (<react_native_1.View style={[inputStyles_1.default.inputContainer, customStyles?.container]}>
        {label && <react_native_1.Text style={inputStyles_1.default.label}>{label}</react_native_1.Text>}
        <react_native_1.View style={inputStyles_1.default.fieldContainer}>
            {icon && <Icon_1.default size={22} src={icon} style={inputStyles_1.default.icon}/>}
            <react_native_1.TextInput accessibilityLabel={accessibilityLabel} autoCapitalize={autoCapitalize} autoComplete={'off'} autoCorrect={false} autoFocus={autoFocus} blurOnSubmit={blurOnSubmit} editable={!disabled} id={id} keyboardType={keyboardType} maxLength={maxLength} 
    // @ts-ignore
    minHeight={minHeight} multiline={multiline} numberOfLines={numberOfLines} onBlur={handleBlur} onChange={handleChange} onFocus={handleFocus} onKeyPress={handleKeyPress} onSubmitEditing={handleSubmitEditing} placeholder={placeholder} placeholderTextColor={BaseTheme_native_1.default.palette.text02} pointerEvents={pointerEvents} ref={ref} returnKeyType={returnKeyType} secureTextEntry={secureTextEntry} spellCheck={false} style={[
            inputStyles_1.default.input,
            clearable && inputStyles_1.default.clearableInput,
            customStyles?.input,
            disabled && inputStyles_1.default.inputDisabled,
            icon && inputStyles_1.default.iconInput,
            multiline && inputStyles_1.default.inputMultiline,
            focused && inputStyles_1.default.inputFocused,
            error && inputStyles_1.default.inputError
        ]} textContentType={textContentType} value={typeof value === 'number' ? `${value}` : value}/>
            {clearable && !disabled && value !== '' && (<react_native_1.TouchableOpacity onPress={clearInput} style={inputStyles_1.default.clearButton}>
                    <Icon_1.default size={22} src={svg_1.IconCloseCircle} style={inputStyles_1.default.clearIcon}/>
                </react_native_1.TouchableOpacity>)}
        </react_native_1.View>
        {bottomLabel && (<react_native_1.View>
                    <react_native_1.Text id={`${id}-description`} style={[
                inputStyles_1.default.bottomLabel,
                error && inputStyles_1.default.bottomLabelError
            ]}>
                        {bottomLabel}
                    </react_native_1.Text>
                </react_native_1.View>)}
    </react_native_1.View>);
});
exports.default = Input;
