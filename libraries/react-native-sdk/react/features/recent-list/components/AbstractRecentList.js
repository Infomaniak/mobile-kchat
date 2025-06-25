"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../app/actions");
const AbstractPage_1 = __importDefault(require("../../base/react/components/AbstractPage"));
const index_1 = require("../../base/react/components/index");
const styles_1 = __importDefault(require("./styles"));
/**
 * An abstract component for the recent list.
 *
 */
class AbstractRecentList extends AbstractPage_1.default {
    /**
     * Initializes a new {@code RecentList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onPress = this._onPress.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecentSelectedEvent)());
    }
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {React$Component}
     */
    _getRenderListEmptyComponent() {
        const { t } = this.props;
        const descriptionId = 'meetings-list-empty-description';
        return (react_1.default.createElement(index_1.Container, { "aria-describedby": descriptionId, "aria-label": t('welcomepage.recentList'), className: 'meetings-list-empty', role: 'region', style: styles_1.default.emptyListContainer },
            react_1.default.createElement(index_1.Text // @ts-ignore
            , { className: 'description', id: descriptionId, style: styles_1.default.emptyListText }, t('welcomepage.recentListEmpty'))));
    }
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {string} url - The url string to navigate to.
     * @returns {void}
     */
    _onPress(url) {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecentClickedEvent)('meeting.tile'));
        dispatch((0, actions_1.appNavigate)(url));
    }
}
exports.default = AbstractRecentList;
