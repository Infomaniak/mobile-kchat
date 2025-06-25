"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/participants/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_2 = require("./actionTypes");
ReducerRegistry_1.default.register('features/large-video', (state = {}, action) => {
    switch (action.type) {
        // When conference is joined, we update ID of local participant from default
        // 'local' to real ID. However, in large video we might have already
        // selected 'local' as participant on stage. So in this case we must update
        // ID of participant on stage to match ID in 'participants' state to avoid
        // additional changes in state and (re)renders.
        case actionTypes_1.PARTICIPANT_ID_CHANGED:
            if (state.participantId === action.oldValue) {
                return {
                    ...state,
                    participantId: action.newValue
                };
            }
            break;
        case actionTypes_2.SELECT_LARGE_VIDEO_PARTICIPANT:
            return {
                ...state,
                participantId: action.participantId
            };
        case actionTypes_2.SET_LARGE_VIDEO_DIMENSIONS:
            return {
                ...state,
                height: action.height,
                width: action.width
            };
        case actionTypes_2.UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION:
            return {
                ...state,
                resolution: action.resolution
            };
        case actionTypes_2.SET_SEE_WHAT_IS_BEING_SHARED:
            return {
                ...state,
                seeWhatIsBeingShared: action.seeWhatIsBeingShared
            };
    }
    return state;
});
