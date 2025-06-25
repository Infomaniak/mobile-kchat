/// <reference types="react" />
interface ILanguageListProps {
    items: Array<ILanguageItem>;
    onLanguageSelected: (lang: string) => void;
    selectedLanguage: string;
}
interface ILanguageItem {
    id: string;
    lang: string;
    selected: boolean;
}
/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
declare const LanguageList: ({ items, onLanguageSelected }: ILanguageListProps) => JSX.Element;
export default LanguageList;
