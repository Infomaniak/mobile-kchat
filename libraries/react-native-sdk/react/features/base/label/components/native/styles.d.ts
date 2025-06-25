/**
 * The default color of the {@code Label} and {@code ExpandedLabel}.
 */
export declare const DEFAULT_COLOR = "#36383C";
/**
 * Margin of the {@Label} - to be reused when rendering the
 * {@code ExpandedLabel}.
 */
export declare const LABEL_MARGIN = 8;
/**
 * Size of the {@Label} - to be reused when rendering the
 * {@code ExpandedLabel}.
 */
export declare const LABEL_SIZE = 28;
/**
 * The styles of the native base/label feature.
 */
declare const _default: {
    expandedLabelContainer: {
        position: string;
        left: number;
        right: number;
        top: number;
        flexDirection: string;
        justifyContent: string;
        zIndex: number;
    };
    expandedLabelTextContainer: {
        borderRadius: number;
        paddingHorizontal: number;
        paddingVertical: number;
    };
    expandedLabelText: {
        color: string;
    };
    /**
     * The outermost view.
     */
    labelContainer: {
        alignItems: string;
        backgroundColor: string;
        borderRadius: number;
        flex: number;
        height: number;
        justifyContent: string;
        marginLeft: number;
        marginBottom: number;
        paddingHorizontal: number;
    };
    labelText: any;
    labelOff: {
        opacity: number;
    };
};
export default _default;
