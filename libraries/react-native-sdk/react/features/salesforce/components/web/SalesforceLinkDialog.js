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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_1 = require("../../../base/dialog/actions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/react/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const Spinner_1 = __importDefault(require("../../../base/ui/components/web/Spinner"));
const constants_1 = require("../../constants");
const useSalesforceLinkDialog_1 = require("../../useSalesforceLinkDialog");
const RecordItem_1 = require("./RecordItem");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            height: '450px',
            overflowY: 'auto',
            position: 'relative'
        },
        recordsSearchContainer: {
            position: 'relative',
            padding: '1px'
        },
        searchIcon: {
            display: 'block',
            position: 'absolute',
            color: theme.palette.text03,
            left: 16,
            top: 10,
            width: 20,
            height: 20
        },
        resultLabel: {
            fontSize: '15px',
            margin: '16px 0 8px'
        },
        recordsSearch: {
            backgroundColor: theme.palette.field01,
            border: '1px solid',
            borderRadius: theme.shape.borderRadius,
            borderColor: theme.palette.ui05,
            color: theme.palette.text01,
            padding: '10px 16px 10px 44px',
            width: '100%',
            height: 40,
            '&::placeholder': {
                color: theme.palette.text03,
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
            }
        },
        spinner: {
            alignItems: 'center',
            display: 'flex',
            height: 'calc(100% - 70px)',
            justifyContent: 'center',
            width: '100%',
            '@media (max-width: 448px)': {
                height: 'auto',
                marginTop: '24px'
            }
        },
        noRecords: {
            height: 'calc(100% - 150px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            '@media (max-width: 448px)': {
                height: 'auto',
                marginTop: '24px'
            }
        },
        recordsError: {
            height: 'calc(100% - 42px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            '@media (max-width: 448px)': {
                height: 'auto',
                marginTop: '24px'
            }
        },
        recordList: {
            listStyle: 'none',
            margin: '10px 0',
            padding: 0
        },
        recordInfo: {
            backgroundColor: theme.palette.ui03,
            padding: '0 16px',
            borderRadius: theme.shape.borderRadius,
            marginBottom: '28px'
        },
        detailsError: {
            padding: '10px 0'
        },
        addNote: {
            padding: '10px 0'
        },
        notes: {
            lineHeight: '18px',
            minHeight: '130px',
            resize: 'vertical',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.ui05,
            backgroundColor: theme.palette.field01,
            color: theme.palette.text01,
            borderRadius: theme.shape.borderRadius,
            padding: '10px 16px'
        }
    };
});
/**
 * Component that renders the Salesforce link dialog.
 *
 * @returns {React$Element<any>}
 */
function SalesforceLinkDialog() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes, theme } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { hasDetailsErrors, hasRecordsErrors, isLoading, linkMeeting, notes, records, searchTerm, selectedRecord, selectedRecordOwner, setNotes, setSearchTerm, setSelectedRecord, showNoResults, showSearchResults } = (0, useSalesforceLinkDialog_1.useSalesforceLinkDialog)();
    const handleChange = (0, react_1.useCallback)((event) => {
        const value = (0, functions_1.getFieldValue)(event);
        setSearchTerm(value);
    }, [functions_1.getFieldValue]);
    const handleSubmit = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.hideDialog)());
        selectedRecord && linkMeeting();
    }, [actions_1.hideDialog, linkMeeting]);
    const renderSpinner = () => (react_1.default.createElement("div", { className: classes.spinner },
        react_1.default.createElement(Spinner_1.default, null)));
    const renderDetailsErrors = () => (react_1.default.createElement("div", { className: classes.detailsError }, t('dialog.searchResultsDetailsError')));
    const renderSelection = () => (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: classes.recordInfo },
            react_1.default.createElement(RecordItem_1.RecordItem, { ...selectedRecord }),
            selectedRecordOwner && react_1.default.createElement(RecordItem_1.RecordItem, { ...selectedRecordOwner }),
            hasDetailsErrors && renderDetailsErrors()),
        react_1.default.createElement("div", { className: classes.addNote }, t('dialog.addOptionalNote')),
        react_1.default.createElement("textarea", { autoFocus: true, className: classes.notes, maxLength: constants_1.NOTES_MAX_LENGTH, 
            /* eslint-disable-next-line react/jsx-no-bind */
            onChange: e => setNotes(e.target.value), placeholder: t('dialog.addMeetingNote'), rows: 4, value: notes })));
    const renderRecordsSearch = () => !selectedRecord && (react_1.default.createElement("div", { className: classes.recordsSearchContainer },
        react_1.default.createElement(Icon_1.default, { className: classes.searchIcon, color: theme.palette.icon03, src: svg_1.IconSearch }),
        react_1.default.createElement("input", { autoComplete: 'off', autoFocus: false, className: classes.recordsSearch, name: 'recordsSearch', onChange: handleChange, placeholder: t('dialog.searchInSalesforce'), tabIndex: 0, value: searchTerm ?? '' }),
        (!isLoading && !hasRecordsErrors) && (react_1.default.createElement("div", { className: classes.resultLabel }, showSearchResults
            ? t('dialog.searchResults', { count: records.length })
            : t('dialog.recentlyUsedObjects')))));
    const renderNoRecords = () => showNoResults && (react_1.default.createElement("div", { className: classes.noRecords },
        react_1.default.createElement("div", null, t('dialog.searchResultsNotFound')),
        react_1.default.createElement("div", null, t('dialog.searchResultsTryAgain'))));
    const renderRecordsError = () => (react_1.default.createElement("div", { className: classes.recordsError }, t('dialog.searchResultsError')));
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
        return (react_1.default.createElement("ul", { className: classes.recordList }, records.map((item) => (react_1.default.createElement(RecordItem_1.RecordItem, { key: `record-${item.id}`, 
            /* eslint-disable-next-line react/jsx-no-bind */
            onClick: () => setSelectedRecord(item), ...item })))));
    };
    return (react_1.default.createElement(Dialog_1.default, { back: {
            hidden: !selectedRecord,
            onClick: () => setSelectedRecord(null),
            translationKey: 'dialog.Back'
        }, cancel: { hidden: true }, disableEnter: true, ok: {
            translationKey: 'dialog.linkMeeting',
            hidden: !selectedRecord
        }, onSubmit: handleSubmit, titleKey: 'dialog.linkMeetingTitle' },
        react_1.default.createElement("div", { className: classes.container },
            renderRecordsSearch(),
            renderContent())));
}
exports.default = SalesforceLinkDialog;
