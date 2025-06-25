import { Theme } from '@mui/material';
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current theme.
 * @returns {Object}
 */
export declare const styles: (theme: Theme) => {
    toggleFilmstripContainer: {
        display: string;
        flexWrap: "nowrap";
        alignItems: string;
        justifyContent: string;
        backgroundColor: string;
        width: string;
        height: string;
        position: "absolute";
        borderRadius: string;
        top: string;
        left: string;
        opacity: number;
        transition: string;
        zIndex: number;
        '&:hover, &:focus-within': {
            backgroundColor: string;
        };
    };
    toggleFilmstripButton: {
        fontSize: string;
        lineHeight: number;
        textAlign: "center";
        background: string;
        height: string;
        width: string;
        padding: number;
        margin: number;
        border: string;
        '-webkit-appearance': string;
        '& svg': {
            fill: string;
        };
    };
    toggleVerticalFilmstripContainer: {
        transform: string;
        left: string;
        top: string;
    };
    toggleTopPanelContainer: {
        transform: string;
        bottom: string;
        top: string;
    };
    toggleTopPanelContainerHidden: {
        visibility: "hidden";
    };
    filmstrip: {
        transition: string;
        right: number;
        bottom: number;
        '&:hover, &:focus-within': {
            '& .resizable-filmstrip': {
                backgroundColor: string;
            };
            '& .filmstrip-hover': {
                backgroundColor: string;
            };
            '& .toggleFilmstripContainer': {
                opacity: number;
            };
            '& .dragHandleContainer': {
                visibility: "visible";
            };
        };
        '.horizontal-filmstrip &.hidden': {
            bottom: string;
            '&:hover': {
                backgroundColor: string;
            };
        };
        '&.hidden': {
            '& .toggleFilmstripContainer': {
                opacity: number;
            };
        };
    };
    filmstripBackground: {
        backgroundColor: string;
        '&:hover, &:focus-within': {
            backgroundColor: string;
        };
    };
    resizableFilmstripContainer: {
        display: string;
        position: "relative";
        flexDirection: "row";
        alignItems: string;
        height: string;
        width: string;
        transition: string;
        '& .avatar-container': {
            maxWidth: string;
            maxHeight: string;
        };
        '&.top-panel-filmstrip': {
            flexDirection: string;
        };
    };
    dragHandleContainer: {
        height: string;
        width: string;
        backgroundColor: string;
        position: "relative";
        cursor: string;
        display: string;
        alignItems: string;
        justifyContent: string;
        visibility: "hidden";
        '&:hover': {
            '& .dragHandle': {
                backgroundColor: string;
            };
        };
        '&.visible': {
            visibility: string;
            '& .dragHandle': {
                backgroundColor: string;
            };
        };
        '&.top-panel': {
            order: number;
            width: string;
            height: string;
            cursor: string;
            '& .dragHandle': {
                height: string;
                width: string;
            };
        };
    };
    dragHandle: {
        backgroundColor: string;
        height: string;
        width: string;
        borderRadius: string;
    };
};
