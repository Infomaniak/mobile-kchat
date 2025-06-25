/// <reference types="react" />
import { IReactionsMenuParent } from '../../../reactions/types';
export interface IProps {
    columns?: number;
    parent: IReactionsMenuParent;
}
/**
 * Gifs menu.
 *
 * @returns {ReactElement}
 */
declare function GifsMenu({ columns, parent }: IProps): JSX.Element;
export default GifsMenu;
