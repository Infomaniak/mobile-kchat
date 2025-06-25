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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const constants_1 = require("../../constants");
const useSalesforceLinkDialog_1 = require("../../useSalesforceLinkDialog");
const RecordItem_1 = require("./RecordItem");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders the Salesforce link dialog.
 *
 * @returns {React$Element<any>}
 */
const SalesforceLinkDialog = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { clientHeight } = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']);
    const { hasDetailsErrors, hasRecordsErrors, isLoading, linkMeeting, notes, records, searchTerm, selectedRecord, selectedRecordOwner, setNotes, setSearchTerm, setSelectedRecord, showNoResults, showSearchResults } = (0, useSalesforceLinkDialog_1.useSalesforceLinkDialog)();
    const handlePress = (0, react_1.useCallback)(() => {
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.main);
        selectedRecord && linkMeeting();
    }, [ConferenceNavigationContainerRef_1.navigate, linkMeeting]);
    const renderSpinner = () => (<react_native_1.View style={[styles_1.default.recordsSpinner, { height: clientHeight - constants_1.CONTENT_HEIGHT_OFFSET }]}>
            <LoadingIndicator_1.default />
        </react_native_1.View>);
    const renderDetailsErrors = () => (<react_native_1.Text style={styles_1.default.detailsError}>
            {t('dialog.searchResultsDetailsError')}
        </react_native_1.Text>);
    const renderSelection = () => (<react_native_1.SafeAreaView>
            <react_native_1.ScrollView bounces={false} style={[styles_1.default.selectedRecord, { height: clientHeight - constants_1.CONTENT_HEIGHT_OFFSET }]}>
                <react_native_1.View style={styles_1.default.recordInfo}>
                    <RecordItem_1.RecordItem {...selectedRecord}/>
                    {selectedRecordOwner && <RecordItem_1.RecordItem {...selectedRecordOwner}/>}
                    {hasDetailsErrors && renderDetailsErrors()}
                </react_native_1.View>
                <react_native_1.Text style={styles_1.default.addNote}>
                    {t('dialog.addOptionalNote')}
                </react_native_1.Text>
                <Input_1.default customStyles={{ container: styles_1.default.notes }} maxLength={constants_1.NOTES_MAX_LENGTH} minHeight={react_native_1.Platform.OS === 'ios' && constants_1.NOTES_LINES ? 20 * constants_1.NOTES_LINES : undefined} multiline={true} numberOfLines={react_native_1.Platform.OS === 'ios' ? undefined : constants_1.NOTES_LINES} 
    /* eslint-disable-next-line react/jsx-no-bind */
    onChange={value => setNotes(value)} placeholder={t('dialog.addMeetingNote')} value={notes}/>
            </react_native_1.ScrollView>
        </react_native_1.SafeAreaView>);
    const renderRecordsSearch = () => (<react_native_1.View style={styles_1.default.recordsSearchContainer}>
            <Input_1.default icon={svg_1.IconSearch} maxLength={constants_1.NOTES_MAX_LENGTH} 
    /* eslint-disable-next-line react/jsx-no-bind */
    onChange={value => setSearchTerm(value)} placeholder={t('dialog.searchInSalesforce')} value={searchTerm ?? ''}/>
            {(!isLoading && !hasRecordsErrors) && (<react_native_1.Text style={styles_1.default.resultLabel}>
                    {showSearchResults
                ? t('dialog.searchResults', { count: records.length })
                : t('dialog.recentlyUsedObjects')}
                </react_native_1.Text>)}
        </react_native_1.View>);
    const renderNoRecords = () => showNoResults && (<react_native_1.View style={[styles_1.default.noRecords, { height: clientHeight - constants_1.CONTENT_HEIGHT_OFFSET }]}>
            <react_native_1.Text style={styles_1.default.noRecordsText}>
                {t('dialog.searchResultsNotFound')}
            </react_native_1.Text>
            <react_native_1.Text style={styles_1.default.noRecordsText}>
                {t('dialog.searchResultsTryAgain')}
            </react_native_1.Text>
        </react_native_1.View>);
    const renderRecordsError = () => (<react_native_1.View style={[styles_1.default.recordsError, { height: clientHeight - constants_1.CONTENT_HEIGHT_OFFSET }]}>
            <react_native_1.Text style={styles_1.default.recordsErrorText}>
                {t('dialog.searchResultsError')}
            </react_native_1.Text>
        </react_native_1.View>);
    const renderContent = () => {
        if (isLoading) {
            return renderSpinner();
        }
        if (hasRecordsErrors) {
            return renderRecordsError();
        }
        if (showNoResults) {
            return renderNoRecords();
        }
        if (selectedRecord) {
            return renderSelection();
        }
        return (<react_native_1.SafeAreaView>
                <react_native_1.ScrollView bounces={false} style={[styles_1.default.recordList, { height: clientHeight - constants_1.LIST_HEIGHT_OFFSET }]}>
                    {records.map((item) => (<RecordItem_1.RecordItem key={`record-${item.id}`} 
            /* eslint-disable-next-line react/jsx-no-bind */
            onClick={() => setSelectedRecord(item)} {...item}/>))}
                </react_native_1.ScrollView>
            </react_native_1.SafeAreaView>);
    };
    return (<JitsiScreen_1.default style={styles_1.default.salesforceDialogContainer}>
            <react_native_1.View>
                {!selectedRecord && renderRecordsSearch()}
                {renderContent()}
            </react_native_1.View>
            {selectedRecord
            && <react_native_1.View>
                    <Button_1.default labelKey='dialog.Cancel' 
            /* eslint-disable-next-line react/jsx-no-bind */
            onClick={() => setSelectedRecord(null)} style={styles_1.default.cancelButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>
                    <Button_1.default labelKey='dialog.linkMeeting' onClick={handlePress} style={styles_1.default.linkButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
                </react_native_1.View>}
        </JitsiScreen_1.default>);
};
exports.default = SalesforceLinkDialog;
