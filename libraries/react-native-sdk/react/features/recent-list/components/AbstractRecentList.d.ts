/// <reference types="react" />
import { IStore } from '../../app/types';
import AbstractPage from '../../base/react/components/AbstractPage';
/**
 * The type of the React {@code Component} props of {@link AbstractRecentList}.
 */
export interface IProps {
    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The translate function.
     */
    t: Function;
}
/**
 * An abstract component for the recent list.
 *
 */
export default class AbstractRecentList<P extends IProps> extends AbstractPage<P> {
    /**
     * Initializes a new {@code RecentList} instance.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {React$Component}
     */
    _getRenderListEmptyComponent(): JSX.Element;
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {string} url - The url string to navigate to.
     * @returns {void}
     */
    _onPress(url: string): void;
}
