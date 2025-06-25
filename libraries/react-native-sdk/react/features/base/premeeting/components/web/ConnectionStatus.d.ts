import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * List of strings with details about the connection.
     */
    connectionDetails?: string[];
    /**
     * The type of the connection. Can be: 'none', 'poor', 'nonOptimal' or 'good'.
     */
    connectionType?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "connectionDetails" | "connectionType">, keyof WithTranslation>>;
export default _default;
