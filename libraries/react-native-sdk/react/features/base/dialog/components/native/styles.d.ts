/**
 * NOTE: These Material guidelines based values are currently only used in
 * dialogs (and related) but later on it would be nice to export it into a base
 * Material feature.
 */
export declare const MD_FONT_SIZE = 16;
export declare const MD_ITEM_HEIGHT = 48;
export declare const MD_ITEM_MARGIN_PADDING: any;
export declare const inputDialog: {
    formMessage: {
        alignSelf: string;
        fontStyle: string;
        fontWeight: string;
        marginTop: any;
    };
};
/**
 * The React {@code Component} styles of {@code BottomSheet}. These have
 * been implemented as per the Material Design guidelines:
 * {@link https://material.io/guidelines/components/bottom-sheets.html}.
 */
export declare const bottomSheetStyles: {
    sheetAreaCover: {
        backgroundColor: string;
        flex: number;
    };
    scrollView: {
        paddingHorizontal: number;
    };
    /**
     * Style for the container of the sheet.
     */
    sheetContainer: {
        alignItems: string;
        flex: number;
        flexDirection: string;
        justifyContent: string;
        maxWidth: number;
        marginLeft: string;
        marginRight: string;
        width: string;
    };
    sheetItemContainer: {
        flex: number;
        maxHeight: string;
    };
    buttons: {
        /**
         * Style for the {@code Icon} element in a generic item of the menu.
         */
        iconStyle: {
            color: any;
            fontSize: number;
        };
        /**
         * Style for the label in a generic item rendered in the menu.
         */
        labelStyle: {
            marginLeft: number;
            color: any;
            flexShrink: number;
            fontSize: number;
            opacity: number;
        };
        /**
         * Container style for a generic item rendered in the menu.
         */
        style: {
            paddingHorizontal: any;
            alignItems: string;
            flexDirection: string;
            height: number;
        };
        /**
         * Additional style that is not directly used as a style object.
         */
        underlayColor: any;
    };
    /**
     * Bottom sheet's base style.
     */
    sheet: {
        backgroundColor: any;
        borderTopLeftRadius: number;
        borderTopRightRadius: number;
    };
    /**
     * Bottom sheet's base style with header.
     */
    sheetHeader: {
        backgroundColor: any;
    };
    /**
     * Bottom sheet's background color with footer.
     */
    sheetFooter: {
        backgroundColor: any;
    };
};
declare const _default: {
    dialogButton: any;
    destructiveDialogButton: any;
};
export default _default;
export declare const brandedDialog: {
    /**
     * The style of bold {@code Text} rendered by the {@code Dialog}s of the
     * feature authentication.
     */
    boldDialogText: {
        fontWeight: string;
    };
    buttonFarRight: {
        borderBottomRightRadius: number;
    };
    buttonWrapper: {
        alignItems: string;
        borderRadius: number;
        flexDirection: string;
    };
    mainWrapper: {
        alignSelf: string;
        padding: number;
        paddingBottom: number;
    };
    overlayTouchable: {
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
};
