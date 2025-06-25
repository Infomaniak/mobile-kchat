/// <reference types="react" />
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractProps } from '../../../base/label/components/native/ExpandedLabel';
type Props = AbstractProps & WithTranslation;
declare const _default: import("react").ComponentType<import("react-i18next").Omit<Props, keyof WithTranslation>>;
export default _default;
