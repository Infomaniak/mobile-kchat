"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../functions");
const PollAnswer_1 = __importDefault(require("./PollAnswer"));
const PollResults_1 = __importDefault(require("./PollResults"));
const styles_1 = require("./styles");
const PollItem = ({ pollId, setCreateMode }) => {
    const showResults = (0, react_redux_1.useSelector)((0, functions_1.shouldShowResults)(pollId));
    return (<react_native_1.View style={styles_1.chatStyles.pollItemContainer}>
            {showResults
            ? <PollResults_1.default key={pollId} pollId={pollId}/>
            : <PollAnswer_1.default pollId={pollId} setCreateMode={setCreateMode}/>}

        </react_native_1.View>);
};
exports.default = PollItem;
