import { ComponentType } from 'react';
import { IStore } from '../../app/types';
export interface IAbstractLanguageSelectorDialogProps {
    dispatch: IStore['dispatch'];
    language: string | null;
    listItems: Array<any>;
    onLanguageSelected: (e: string) => void;
    subtitles: string;
    t: Function;
}
/**
 * Higher Order Component taking in a concrete LanguageSelector component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.Component} Component - The concrete component.
 * @returns {React.Component}
 */
declare const AbstractLanguageSelectorDialog: (Component: ComponentType<IAbstractLanguageSelectorDialogProps>) => () => JSX.Element;
export default AbstractLanguageSelectorDialog;
