"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../functions");
const PollAnswer_1 = __importDefault(require("./PollAnswer"));
const PollResults_1 = __importDefault(require("./PollResults"));
const PollItem = react_1.default.forwardRef(({ pollId, setCreateMode }, ref) => {
    const showResults = (0, react_redux_1.useSelector)((0, functions_1.shouldShowResults)(pollId));
    return (react_1.default.createElement("div", { ref: ref }, showResults
        ? react_1.default.createElement(PollResults_1.default, { key: pollId, pollId: pollId })
        : react_1.default.createElement(PollAnswer_1.default, { pollId: pollId, setCreateMode: setCreateMode })));
});
exports.default = PollItem;
