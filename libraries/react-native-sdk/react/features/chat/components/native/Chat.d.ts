import { Route } from '@react-navigation/native';
import React from 'react';
import { IChatProps as AbstractProps } from '../../types';
export interface IProps extends AbstractProps {
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: any;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    route: Route<'', {
        privateMessageRecipient: {
            name: string;
        };
    }>;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
