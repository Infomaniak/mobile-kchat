import { Theme } from '@mui/material';
export * from './constants.any';
/**
 * Returns an object containing the declaration of the common, reusable CSS classes.
 *
 * @param {Object} theme -The theme.
 *
 * @returns {Object} - The common styles.
 */
export declare const commonStyles: (theme: Theme) => {
    '.empty-list': {
        listStyleType: string;
        margin: number;
        padding: number;
    };
    '.mute-dialog': {
        '& .separator-line': {
            margin: string;
            padding: string;
            width: string;
            height: string;
            background: string;
        };
        '& .control-row': {
            display: string;
            justifyContent: string;
            marginTop: string;
            '& label': {
                fontSize: string;
            };
        };
    };
    '.overflow-menu-item': {
        alignItems: string;
        color: string;
        cursor: string;
        display: string;
        fontSize: number;
        fontWeight: number;
        height: number;
        lineHeight: string;
        padding: string;
        boxSizing: "border-box";
        '& > div': {
            display: string;
            alignItems: string;
        };
        '&.unclickable': {
            cursor: string;
        };
        '&.disabled': {
            cursor: string;
            color: string;
            '&:hover': {
                background: string;
            };
            '& svg': {
                fill: string;
            };
        };
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                background: string;
            };
            '&.unclickable:hover': {
                background: string;
            };
        };
    };
    '.overflow-menu-item-icon': {
        marginRight: string;
        '& i': {
            display: string;
            fontSize: number;
        };
        '@media (hover: hover) and (pointer: fine)': {
            '&i:hover': {
                backgroundColor: string;
            };
        };
        '& img': {
            maxWidth: number;
            maxHeight: number;
        };
        '& svg': {
            fill: string;
            height: number;
            width: number;
        };
    };
    '.prejoin-dialog': {
        backgroundColor: string;
        boxShadow: string;
        borderRadius: number;
        color: string;
        height: string;
        width: string;
        '.prejoin-dialog--small': {
            height: number;
            width: number;
        };
        '.prejoin-dialog-label': {
            fontSize: string;
            lineHeight: string;
        };
        '.prejoin-dialog-label-num': {
            background: string;
            border: string;
            borderRadius: string;
            color: string;
            display: string;
            height: string;
            marginRight: string;
            width: string;
        };
        '.prejoin-dialog-container': {
            alignItems: string;
            background: string;
            display: string;
            height: string;
            justifyContent: string;
            left: number;
            position: "absolute";
            top: number;
            width: string;
            zIndex: number;
        };
        '.prejoin-dialog-flag': {
            display: string;
            marginRight: string;
            transform: string;
        };
        '.prejoin-dialog-title': {
            display: string;
            fontSize: string;
            lineHeight: string;
        };
        '.prejoin-dialog-icon': {
            cursor: string;
        };
        '.prejoin-dialog-btn': {
            marginBottom: string;
        };
        '.prejoin-dialog-dialin-container': {
            textAlign: "center";
        };
        '.prejoin-dialog-delimiter': {
            background: string;
            border: string;
            height: string;
            margin: string;
            padding: string;
            width: string;
        };
        '.prejoin-dialog-delimiter-container': {
            margin: string;
            position: "relative";
        };
        '.prejoin-dialog-delimiter-txt-container': {
            position: "absolute";
            textAlign: "center";
            top: string;
            width: string;
        };
        '.prejoin-dialog-delimiter-txt': {
            background: string;
            color: string;
            fontSize: string;
            textTransform: "uppercase";
            padding: string;
        };
    };
    '.prejoin-dialog-btn': {
        '&.primary, &.prejoin-dialog-btn.text': {
            width: string;
        };
    };
    '.toolbox-icon': {
        [x: string]: string | number | {
            '&:hover': {
                backgroundColor: string;
            };
            '&:active': {
                backgroundColor: string;
            };
            height?: undefined;
            width?: undefined;
            backgroundColor?: undefined;
            cursor?: undefined;
            '& svg'?: undefined;
        } | {
            height: number;
            width: number;
            '&:hover'?: undefined;
            '&:active'?: undefined;
            backgroundColor?: undefined;
            cursor?: undefined;
            '& svg'?: undefined;
        } | {
            backgroundColor: string;
            '&:hover'?: undefined;
            '&:active'?: undefined;
            height?: undefined;
            width?: undefined;
            cursor?: undefined;
            '& svg'?: undefined;
        } | {
            cursor: string;
            backgroundColor: string;
            '& svg': {
                fill: string;
            };
            '&:hover'?: undefined;
            '&:active'?: undefined;
            height?: undefined;
            width?: undefined;
        };
        display: string;
        borderRadius: number;
        flexDirection: "column";
        fontSize: number;
        height: number;
        justifyContent: string;
        width: number;
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                backgroundColor: string;
            };
            '&:active': {
                backgroundColor: string;
            };
        };
        '&.toggled': {
            backgroundColor: string;
        };
        '&.disabled': {
            cursor: string;
            backgroundColor: string;
            '& svg': {
                fill: string;
            };
        };
    };
    '.toolbox-button': {
        color: string;
        cursor: string;
        display: string;
        lineHeight: string;
        textAlign: "center";
    };
    '.toolbox-content-items': {
        background: string;
        borderRadius: number;
        margin: string;
        padding: number;
        textAlign: "center";
        pointerEvents: "all";
        display: string;
        boxShadow: string;
        '& > div': {
            marginRight: string;
            '&:last-of-type': {
                marginRight: number;
            };
        };
    };
};
