"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("lodash/debounce"));
const react_1 = __importStar(require("react"));
const MultiSelect_1 = __importDefault(require("../../../ui/components/web/MultiSelect"));
const logger_1 = __importDefault(require("../../logger"));
const InlineDialogFailure_1 = __importDefault(require("./InlineDialogFailure"));
/**
 * A MultiSelect that is also auto-completing.
 */
class MultiSelectAutocomplete extends react_1.Component {
    /**
     * Initializes a new {@code MultiSelectAutocomplete} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        const defaultValue = this.props.defaultValue || [];
        this.state = {
            isOpen: false,
            filterValue: '',
            loading: false,
            error: false,
            items: [],
            selectedItems: [...defaultValue]
        };
        this._onFilterChange = this._onFilterChange.bind(this);
        this._onRetry = this._onRetry.bind(this);
        this._onSelectionChange = this._onSelectionChange.bind(this);
        this._sendQuery = (0, debounce_1.default)(this._sendQuery.bind(this), 200);
    }
    /**
     * Sets the items to display as selected.
     *
     * @param {Array<MultiSelectItem>} selectedItems - The list of items to display as
     * having been selected.
     * @returns {void}
     */
    setSelectedItems(selectedItems = []) {
        this.setState({ selectedItems });
    }
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render() {
        const autoFocus = this.props.shouldFocus || false;
        const disabled = this.props.isDisabled || false;
        const placeholder = this.props.placeholder || '';
        const noMatchesFound = this.state.loading ? this.props.loadingMessage : this.props.noMatchesFound || '';
        const errorDialog = this._renderError();
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(MultiSelect_1.default, { autoFocus: autoFocus, disabled: disabled, error: this.state.error, errorDialog: errorDialog, filterValue: this.state.filterValue, id: this.props.id, isOpen: this.state.isOpen, items: this.state.items, noMatchesText: noMatchesFound, onFilterChange: this._onFilterChange, onRemoved: this._onSelectionChange, onSelected: this._onSelectionChange, placeholder: placeholder, selectedItems: this.state.selectedItems })));
    }
    /**
     * Sets the state and sends a query on filter change.
     *
     * @param {string} filterValue - The filter text value.
     * @private
     * @returns {void}
     */
    _onFilterChange(filterValue) {
        this.setState({
            // Clean the error if the filterValue is empty.
            error: this.state.error && Boolean(filterValue),
            filterValue,
            isOpen: Boolean(this.state.items.length) && Boolean(filterValue),
            items: [],
            loading: Boolean(filterValue)
        });
        if (filterValue) {
            this._sendQuery(filterValue);
        }
    }
    /**
     * Retries the query on retry.
     *
     * @private
     * @returns {void}
     */
    _onRetry() {
        this._sendQuery(this.state.filterValue);
    }
    /**
     * Updates the selected items when a selection event occurs.
     *
     * @param {any} item - The selected item.
     * @private
     * @returns {void}
     */
    _onSelectionChange(item) {
        const existing = this.state.selectedItems.find((k) => k.value === item.value);
        let selectedItems = this.state.selectedItems;
        if (existing) {
            selectedItems = selectedItems.filter(k => k !== existing);
        }
        else {
            selectedItems.push(this.props.onItemSelected(item));
        }
        this.setState({
            isOpen: false,
            selectedItems
        });
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(selectedItems);
        }
    }
    /**
     * Renders the error UI.
     *
     * @returns {ReactElement|null}
     */
    _renderError() {
        if (!this.state.error) {
            return null;
        }
        return (react_1.default.createElement(InlineDialogFailure_1.default, { onRetry: this._onRetry, showSupportLink: this.props.showSupportLink }));
    }
    /**
     * Sends a query to the resourceClient.
     *
     * @param {string} filterValue - The string to use for the search.
     * @returns {void}
     */
    _sendQuery(filterValue) {
        if (!filterValue) {
            return;
        }
        this.setState({
            error: false
        });
        const resourceClient = this.props.resourceClient || {
            makeQuery: () => Promise.resolve([]),
            parseResults: (results) => results
        };
        resourceClient.makeQuery(filterValue)
            .then((results) => {
            if (this.state.filterValue !== filterValue) {
                this.setState({
                    error: false
                });
                return;
            }
            this.setState({
                items: resourceClient.parseResults(results),
                isOpen: true,
                loading: false,
                error: false
            });
        })
            .catch((error) => {
            logger_1.default.error('MultiSelectAutocomplete error in query', error);
            this.setState({
                error: true,
                loading: false,
                isOpen: false
            });
        });
    }
}
exports.default = MultiSelectAutocomplete;
