import { Component } from 'react';
import { MultiSelectItem } from '../../../ui/components/types';
/**
 * The type of the React {@code Component} props of
 * {@link MultiSelectAutocomplete}.
 */
export interface IProps {
    /**
     * The default value of the selected item.
     */
    defaultValue?: Array<any>;
    /**
     * Optional footer to show as a last element in the results.
     * Should be of type {content: <some content>}.
     */
    footer?: any;
    /**
     * Id for the included input, necessary for screen readers.
     */
    id: string;
    /**
     * Indicates if the component is disabled.
     */
    isDisabled: boolean;
    /**
     * Text to display while a query is executing.
     */
    loadingMessage: string;
    /**
     * The text to show when no matches are found.
     */
    noMatchesFound: string;
    /**
     * The function called immediately before a selection has been actually
     * selected. Provides an opportunity to do any formatting.
     */
    onItemSelected: Function;
    /**
     * The function called when the selection changes.
     */
    onSelectionChange: Function;
    /**
     * The placeholder text of the input component.
     */
    placeholder: string;
    /**
     * The service providing the search.
     */
    resourceClient: {
        makeQuery: Function;
        parseResults: Function;
    };
    /**
     * Indicates if the component should fit the container.
     */
    shouldFitContainer: boolean;
    /**
     * Indicates if we should focus.
     */
    shouldFocus: boolean;
    /**
     * Indicates whether the support link should be shown in case of an error.
     */
    showSupportLink: Boolean;
}
/**
 * The type of the React {@code Component} state of
 * {@link MultiSelectAutocomplete}.
 */
export interface IState {
    /**
     * Indicates if there was an error.
     */
    error: boolean;
    /**
     * The text that filters the query result of the search.
     */
    filterValue: string;
    /**
     * Indicates if the dropdown is open.
     */
    isOpen: boolean;
    /**
     * The list of result items.
     */
    items: Array<MultiSelectItem>;
    /**
     * Indicates if the component is currently loading results.
     */
    loading: boolean;
    /**
     * The list of selected items.
     */
    selectedItems: Array<MultiSelectItem>;
}
/**
 * A MultiSelect that is also auto-completing.
 */
declare class MultiSelectAutocomplete extends Component<IProps, IState> {
    /**
     * Initializes a new {@code MultiSelectAutocomplete} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Sets the items to display as selected.
     *
     * @param {Array<MultiSelectItem>} selectedItems - The list of items to display as
     * having been selected.
     * @returns {void}
     */
    setSelectedItems(selectedItems?: Array<MultiSelectItem>): void;
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Sets the state and sends a query on filter change.
     *
     * @param {string} filterValue - The filter text value.
     * @private
     * @returns {void}
     */
    _onFilterChange(filterValue: string): void;
    /**
     * Retries the query on retry.
     *
     * @private
     * @returns {void}
     */
    _onRetry(): void;
    /**
     * Updates the selected items when a selection event occurs.
     *
     * @param {any} item - The selected item.
     * @private
     * @returns {void}
     */
    _onSelectionChange(item: any): void;
    /**
     * Renders the error UI.
     *
     * @returns {ReactElement|null}
     */
    _renderError(): JSX.Element | null;
    /**
     * Sends a query to the resourceClient.
     *
     * @param {string} filterValue - The string to use for the search.
     * @returns {void}
     */
    _sendQuery(filterValue: string): void;
}
export default MultiSelectAutocomplete;
