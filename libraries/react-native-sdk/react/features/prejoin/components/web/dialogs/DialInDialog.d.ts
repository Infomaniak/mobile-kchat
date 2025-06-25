import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The number to call in order to join the conference.
     */
    number: string | null;
    /**
     * Handler used when clicking the back button.
     */
    onBack: (e?: React.MouseEvent) => void;
    /**
     * Click handler for primary button.
     */
    onPrimaryButtonClick: Function;
    /**
     * Click handler for the small additional text.
     */
    onSmallTextClick: (e?: React.MouseEvent) => void;
    /**
     * Click handler for the text button.
     */
    onTextButtonClick: (e?: React.MouseEvent) => void;
    /**
     * The passCode of the conference.
     */
    passCode?: string | number;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
