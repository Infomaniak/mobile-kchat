"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = {
    salesforceDialogContainer: {
        position: 'relative',
        flexDirection: 'column',
        flex: 1,
        display: 'flex',
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    recordsSearchContainer: {
        alignSelf: 'stretch',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        paddingTop: BaseTheme_native_1.default.spacing[2],
        position: 'relative'
    },
    searchIcon: {
        color: BaseTheme_native_1.default.palette.text03,
        fontSize: 30,
        left: 22,
        position: 'absolute',
        top: 22,
        zIndex: 2
    },
    resultLabel: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        color: BaseTheme_native_1.default.palette.text03,
        fontSize: 15,
        margin: 0,
        paddingBottom: 8,
        paddingTop: 16
    },
    recordsSpinner: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    noRecords: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: BaseTheme_native_1.default.spacing[3]
    },
    noRecordsText: {
        color: BaseTheme_native_1.default.palette.text03
    },
    recordsError: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 30
    },
    recordsErrorText: {
        color: BaseTheme_native_1.default.palette.text03
    },
    recordList: {
        alignSelf: 'stretch',
        display: 'flex',
        listStyle: 'none',
        paddingVertical: BaseTheme_native_1.default.spacing[3],
        position: 'relative'
    },
    selectedRecord: {
        alignSelf: 'stretch',
        display: 'flex',
        paddingTop: BaseTheme_native_1.default.spacing[3],
        position: 'relative'
    },
    recordInfo: {
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        display: 'flex',
        margin: BaseTheme_native_1.default.spacing[3],
        position: 'relative'
    },
    detailsError: {
        color: BaseTheme_native_1.default.palette.text03,
        padding: BaseTheme_native_1.default.spacing[3]
    },
    addNote: {
        color: BaseTheme_native_1.default.palette.text01,
        margin: BaseTheme_native_1.default.spacing[3]
    },
    notes: {
        alignItems: 'flex-start',
        backgroundColor: BaseTheme_native_1.default.palette.field01,
        borderColor: BaseTheme_native_1.default.palette.ui05,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderWidth: 1,
        color: BaseTheme_native_1.default.palette.text01,
        lineHeight: 18,
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2],
        overflow: 'hidden',
        padding: BaseTheme_native_1.default.spacing[2],
        textAlignVertical: 'top'
    },
    cancelButton: {
        margin: BaseTheme_native_1.default.spacing[2]
    },
    linkButton: {
        marginBottom: BaseTheme_native_1.default.spacing[2],
        marginHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    recordItem: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    recordTypeIcon: {
        alignItems: 'center',
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        display: 'flex',
        height: 40,
        justifyContent: 'center',
        marginRight: BaseTheme_native_1.default.spacing[3],
        width: 40
    },
    recordIcon: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    recordDetails: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        overflow: 'hidden',
        paddingVertical: BaseTheme_native_1.default.spacing[3]
    },
    recordName: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 15,
        overflow: 'hidden'
    },
    recordType: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 13
    }
};
