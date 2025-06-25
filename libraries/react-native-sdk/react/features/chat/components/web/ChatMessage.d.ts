import React from 'react';
import { IChatMessageProps } from '../../types';
export interface IProps extends IChatMessageProps {
    type: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "knocking" | "canReply"> & IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
