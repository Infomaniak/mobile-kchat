"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSalesforceLinkDialog = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const functions_1 = require("../base/conference/functions");
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const functions_2 = require("./functions");
const useSalesforceLinkDialog = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [selectedRecord, setSelectedRecord] = (0, react_1.useState)(null);
    const [selectedRecordOwner, setSelectedRecordOwner] = (0, react_1.useState)(null);
    const [records, setRecords] = (0, react_1.useState)([]);
    const [isLoading, setLoading] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)(null);
    const [notes, setNotes] = (0, react_1.useState)('');
    const [hasRecordsErrors, setRecordsErrors] = (0, react_1.useState)(false);
    const [hasDetailsErrors, setDetailsErrors] = (0, react_1.useState)(false);
    const conference = (0, react_redux_1.useSelector)(functions_1.getCurrentConference);
    const sessionId = conference?.getMeetingUniqueId();
    const { salesforceUrl = '' } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const { jwt = '' } = (0, react_redux_1.useSelector)((state) => state['features/base/jwt']);
    const showSearchResults = searchTerm && searchTerm.length > 1;
    const showNoResults = showSearchResults && records.length === 0;
    (0, react_1.useEffect)(() => {
        const fetchRecords = async () => {
            setRecordsErrors(false);
            setLoading(true);
            try {
                const text = showSearchResults ? searchTerm : null;
                const result = text
                    ? await (0, functions_2.searchSessionRecords)(salesforceUrl, jwt, text)
                    : await (0, functions_2.getRecentSessionRecords)(salesforceUrl, jwt);
                setRecords(result);
            }
            catch (error) {
                setRecordsErrors(true);
            }
            setLoading(false);
        };
        fetchRecords();
    }, [
        functions_2.getRecentSessionRecords,
        jwt,
        salesforceUrl,
        functions_2.searchSessionRecords,
        searchTerm
    ]);
    (0, react_1.useEffect)(() => {
        const fetchRecordDetails = async () => {
            setDetailsErrors(false);
            setSelectedRecordOwner(null);
            try {
                const result = await (0, functions_2.getSessionRecordDetails)(salesforceUrl, jwt, selectedRecord);
                setSelectedRecordOwner({
                    id: result.id,
                    name: result.ownerName,
                    type: 'OWNER'
                });
            }
            catch (error) {
                setDetailsErrors(true);
            }
        };
        selectedRecord && fetchRecordDetails();
    }, [
        jwt,
        functions_2.getSessionRecordDetails,
        salesforceUrl,
        selectedRecord
    ]);
    const linkMeeting = (0, react_1.useCallback)(async () => {
        dispatch((0, actions_1.showNotification)({
            titleKey: 'notify.linkToSalesforceProgress',
            uid: constants_1.SALESFORCE_LINK_NOTIFICATION_ID,
            appearance: constants_1.NOTIFICATION_TYPE.NORMAL
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
        try {
            await (0, functions_2.executeLinkMeetingRequest)(salesforceUrl, jwt, sessionId, {
                id: selectedRecord?.id,
                type: selectedRecord?.type,
                notes
            });
            dispatch((0, actions_1.hideNotification)(constants_1.SALESFORCE_LINK_NOTIFICATION_ID));
            dispatch((0, actions_1.showNotification)({
                titleKey: 'notify.linkToSalesforceSuccess',
                uid: constants_1.SALESFORCE_LINK_NOTIFICATION_ID,
                appearance: constants_1.NOTIFICATION_TYPE.SUCCESS
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
        catch (error) {
            dispatch((0, actions_1.hideNotification)(constants_1.SALESFORCE_LINK_NOTIFICATION_ID));
            dispatch((0, actions_1.showNotification)({
                titleKey: 'notify.linkToSalesforceError',
                descriptionKey: error?.messageKey && t(error.messageKey),
                uid: constants_1.SALESFORCE_LINK_NOTIFICATION_ID,
                appearance: constants_1.NOTIFICATION_TYPE.ERROR
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
    }, [
        functions_2.executeLinkMeetingRequest,
        actions_1.hideNotification,
        jwt,
        notes,
        salesforceUrl,
        selectedRecord,
        actions_1.showNotification
    ]);
    return {
        hasDetailsErrors,
        hasRecordsErrors,
        isLoading,
        linkMeeting,
        notes,
        records,
        searchTerm,
        selectedRecord,
        selectedRecordOwner,
        setNotes,
        setSearchTerm,
        setSelectedRecord,
        showNoResults,
        showSearchResults
    };
};
exports.useSalesforceLinkDialog = useSalesforceLinkDialog;
