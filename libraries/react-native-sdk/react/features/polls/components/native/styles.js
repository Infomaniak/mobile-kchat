"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatStyles = exports.resultsStyles = exports.dialogStyles = void 0;
const functions_native_1 = require("../../../base/styles/functions.native");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.dialogStyles = (0, functions_native_1.createStyleSheet)({
    customContainer: {
        marginBottom: BaseTheme_native_1.default.spacing[3],
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    questionText: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        color: BaseTheme_native_1.default.palette.text01,
        marginLeft: BaseTheme_native_1.default.spacing[1]
    },
    questionOwnerText: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        color: BaseTheme_native_1.default.palette.text03,
        marginBottom: BaseTheme_native_1.default.spacing[2],
        marginLeft: BaseTheme_native_1.default.spacing[1]
    },
    optionContainer: {
        flexDirection: 'column',
        marginTop: BaseTheme_native_1.default.spacing[3],
        marginHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    optionRemoveButton: {
        marginTop: BaseTheme_native_1.default.spacing[2],
        width: 128
    },
    optionRemoveButtonText: {
        color: BaseTheme_native_1.default.palette.link01
    },
    field: {
        borderWidth: 1,
        borderColor: BaseTheme_native_1.default.palette.ui06,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 14,
        paddingBottom: BaseTheme_native_1.default.spacing[2],
        paddingLeft: BaseTheme_native_1.default.spacing[3],
        paddingRight: BaseTheme_native_1.default.spacing[3],
        paddingTop: BaseTheme_native_1.default.spacing[2]
    }
});
exports.resultsStyles = (0, functions_native_1.createStyleSheet)({
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    barContainer: {
        backgroundColor: '#ccc',
        borderRadius: 3,
        width: '100%',
        height: 6,
        marginTop: 2
    },
    bar: {
        backgroundColor: BaseTheme_native_1.default.palette.action01,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        height: 6
    },
    voters: {
        backgroundColor: BaseTheme_native_1.default.palette.ui04,
        borderColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderWidth: 1,
        padding: BaseTheme_native_1.default.spacing[2],
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    voter: {
        color: BaseTheme_native_1.default.palette.text01
    },
    answerContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[1],
        marginVertical: BaseTheme_native_1.default.spacing[3],
        maxWidth: '100%'
    },
    answerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    answer: {
        color: BaseTheme_native_1.default.palette.text01,
        flexShrink: 1
    },
    answerVoteCount: {
        paddingLeft: 10
    },
    chatQuestion: {
        fontWeight: 'bold'
    }
});
exports.chatStyles = (0, functions_native_1.createStyleSheet)({
    noPollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: '25%'
    },
    noPollText: {
        flex: 1,
        color: BaseTheme_native_1.default.palette.text03,
        textAlign: 'center',
        maxWidth: '70%'
    },
    pollItemContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        borderColor: BaseTheme_native_1.default.palette.ui06,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        boxShadow: BaseTheme_native_1.default.shape.boxShadow,
        borderWidth: 1,
        padding: BaseTheme_native_1.default.spacing[2],
        margin: BaseTheme_native_1.default.spacing[3]
    },
    pollCreateContainer: {
        flex: 1
    },
    pollCreateSubContainer: {
        flex: 1,
        marginTop: BaseTheme_native_1.default.spacing[3]
    },
    pollCreateButtonsContainerAndroid: {
        marginBottom: BaseTheme_native_1.default.spacing[8],
        marginHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    pollCreateButtonsContainerIos: {
        marginBottom: BaseTheme_native_1.default.spacing[5],
        marginHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    pollSendLabel: {
        color: BaseTheme_native_1.default.palette.text01,
        textTransform: 'capitalize'
    },
    pollSendDisabledLabel: {
        color: BaseTheme_native_1.default.palette.text03,
        textTransform: 'capitalize'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    answerContent: {
        marginBottom: BaseTheme_native_1.default.spacing[2]
    },
    switchRow: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: BaseTheme_native_1.default.spacing[2]
    },
    switchLabel: {
        color: BaseTheme_native_1.default.palette.text01,
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    pollCreateAddButton: {
        marginHorizontal: BaseTheme_native_1.default.spacing[1],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    pollCreateButton: {
        marginHorizontal: BaseTheme_native_1.default.spacing[1],
        maxWidth: 160,
        flex: 1
    },
    toggleText: {
        color: BaseTheme_native_1.default.palette.action01
    },
    createPollButtonIos: {
        marginHorizontal: 20,
        marginVertical: BaseTheme_native_1.default.spacing[5]
    },
    createPollButtonAndroid: {
        marginHorizontal: 20,
        marginVertical: BaseTheme_native_1.default.spacing[5]
    },
    pollPane: {
        flex: 1,
        padding: BaseTheme_native_1.default.spacing[2]
    },
    pollPaneContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    bottomLinks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: BaseTheme_native_1.default.spacing[1]
    },
    unreadPollsCounterContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    unreadPollsCounterDescription: {
        color: BaseTheme_native_1.default.palette.text01
    },
    unreadPollsCounterCircle: {
        backgroundColor: BaseTheme_native_1.default.palette.warning01,
        borderRadius: BaseTheme_native_1.default.spacing[3] / 2,
        height: BaseTheme_native_1.default.spacing[3],
        justifyContent: 'center',
        marginLeft: BaseTheme_native_1.default.spacing[2],
        width: BaseTheme_native_1.default.spacing[3]
    },
    unreadPollsCounter: {
        alignSelf: 'center',
        color: BaseTheme_native_1.default.palette.text04
    }
});
