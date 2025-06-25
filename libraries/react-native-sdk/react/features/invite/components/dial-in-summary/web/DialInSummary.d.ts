import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link DialInSummary}.
 */
export interface IProps extends WithTranslation {
    /**
     * Additional CSS classnames to append to the root of the component.
     */
    className: string;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Whether or not numbers should include links with the telephone protocol.
     */
    clickableNumbers: boolean;
    /**
     * Whether to hide the error.
     */
    hideError?: boolean;
    /**
     * The name of the conference to show a conferenceID for.
     */
    room: string;
    /**
     * Whether the dial in summary container is scrollable.
     */
    scrollable?: boolean;
    /**
     * Whether the room name should show as title.
     */
    showTitle?: boolean;
    /**
     * The url where we were loaded.
     */
    url: any;
}
declare const styles: (theme: Theme) => {
    hasNumbers: {
        alignItems: string;
        display: string;
        flexDirection: "column";
        background: string;
        color: string;
    };
    scrollable: {
        height: string;
        overflowY: "scroll";
    };
    roomName: any;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
