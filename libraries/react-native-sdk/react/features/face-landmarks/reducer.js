"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const defaultState = {
    faceBoxes: {},
    faceLandmarks: [],
    faceLandmarksBuffer: [],
    recognitionActive: false
};
ReducerRegistry_1.default.register('features/face-landmarks', (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes_1.ADD_FACE_LANDMARKS: {
            const { addToBuffer, faceLandmarks } = action;
            return {
                ...state,
                faceLandmarks: [...state.faceLandmarks, faceLandmarks],
                faceLandmarksBuffer: addToBuffer ? [...state.faceLandmarksBuffer,
                    {
                        emotion: faceLandmarks.faceExpression,
                        timestamp: faceLandmarks.timestamp
                    }] : state.faceLandmarksBuffer
            };
        }
        case actionTypes_1.CLEAR_FACE_LANDMARKS_BUFFER: {
            return {
                ...state,
                faceLandmarksBuffer: []
            };
        }
        case actionTypes_1.UPDATE_FACE_COORDINATES: {
            return {
                ...state,
                faceBoxes: {
                    ...state.faceBoxes,
                    [action.id]: action.faceBox
                }
            };
        }
    }
    return state;
});
