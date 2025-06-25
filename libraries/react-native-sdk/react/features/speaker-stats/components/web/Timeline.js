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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/conference/functions");
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
const functions_2 = require("../../functions");
const Timeline = ({ faceLandmarks }) => {
    const startTimestamp = (0, react_redux_1.useSelector)((state) => (0, functions_1.getConferenceTimestamp)(state)) ?? 0;
    const { left, right } = (0, react_redux_1.useSelector)((state) => (0, functions_2.getTimelineBoundaries)(state));
    const { timelinePanning } = (0, react_redux_1.useSelector)((state) => state['features/speaker-stats']);
    const dispatch = (0, react_redux_1.useDispatch)();
    const containerRef = (0, react_1.useRef)(null);
    const intervalDuration = (0, react_1.useMemo)(() => right - left, [left, right]);
    const getSegments = (0, react_1.useCallback)(() => {
        const segments = faceLandmarks?.filter(landmarks => {
            const timeStart = (0, functions_2.getFaceLandmarksStart)(landmarks, startTimestamp);
            const timeEnd = (0, functions_2.getFaceLandmarksEnd)(landmarks, startTimestamp);
            if (timeEnd > left && timeStart < right) {
                return true;
            }
            return false;
        }) ?? [];
        let leftCut;
        let rightCut;
        if (segments.length) {
            const start = (0, functions_2.getFaceLandmarksStart)(segments[0], startTimestamp);
            const end = (0, functions_2.getFaceLandmarksEnd)(segments[segments.length - 1], startTimestamp);
            if (start <= left) {
                leftCut = segments[0];
            }
            if (end >= right) {
                rightCut = segments[segments.length - 1];
            }
        }
        if (leftCut) {
            segments.shift();
        }
        if (rightCut) {
            segments.pop();
        }
        return {
            segments,
            leftCut,
            rightCut
        };
    }, [faceLandmarks, left, right, startTimestamp]);
    const { segments, leftCut, rightCut } = getSegments();
    const getStyle = (0, react_1.useCallback)((duration, faceExpression) => {
        return {
            width: `${100 / (intervalDuration / duration)}%`,
            backgroundColor: constants_1.TIMELINE_COLORS[faceExpression] ?? constants_1.TIMELINE_COLORS['no-detection']
        };
    }, [intervalDuration]);
    const getStartStyle = (0, react_1.useCallback)(() => {
        let startDuration = 0;
        let color = constants_1.TIMELINE_COLORS['no-detection'];
        if (leftCut) {
            const { faceExpression } = leftCut;
            startDuration = (0, functions_2.getFaceLandmarksEnd)(leftCut, startTimestamp) - left;
            color = constants_1.TIMELINE_COLORS[faceExpression];
        }
        else if (segments.length) {
            startDuration = (0, functions_2.getFaceLandmarksStart)(segments[0], startTimestamp) - left;
        }
        else if (rightCut) {
            startDuration = (0, functions_2.getFaceLandmarksStart)(rightCut, startTimestamp) - left;
        }
        return {
            width: `${100 / (intervalDuration / startDuration)}%`,
            backgroundColor: color
        };
    }, [leftCut, rightCut, startTimestamp, left, intervalDuration, segments]);
    const getEndStyle = (0, react_1.useCallback)(() => {
        let endDuration = 0;
        let color = constants_1.TIMELINE_COLORS['no-detection'];
        if (rightCut) {
            const { faceExpression } = rightCut;
            endDuration = right - (0, functions_2.getFaceLandmarksStart)(rightCut, startTimestamp);
            color = constants_1.TIMELINE_COLORS[faceExpression];
        }
        else if (segments.length) {
            endDuration = right - (0, functions_2.getFaceLandmarksEnd)(segments[segments.length - 1], startTimestamp);
        }
        else if (leftCut) {
            endDuration = right - (0, functions_2.getFaceLandmarksEnd)(leftCut, startTimestamp);
        }
        return {
            width: `${100 / (intervalDuration / endDuration)}%`,
            backgroundColor: color
        };
    }, [leftCut, rightCut, startTimestamp, right, intervalDuration, segments]);
    const getOneSegmentStyle = (0, react_1.useCallback)((faceExpression) => {
        return {
            width: '100%',
            backgroundColor: faceExpression ? constants_1.TIMELINE_COLORS[faceExpression] : constants_1.TIMELINE_COLORS['no-detection'],
            borderRadius: 0
        };
    }, []);
    const handleOnWheel = (0, react_1.useCallback)((event) => {
        // check if horizontal scroll
        if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
            const value = event.deltaX * constants_1.SCROLL_RATE;
            dispatch((0, actions_any_1.addToOffset)(value));
            event.preventDefault();
        }
    }, [dispatch, actions_any_1.addToOffset]);
    const hideStartAndEndSegments = (0, react_1.useCallback)(() => leftCut && rightCut
        && leftCut.faceExpression === rightCut.faceExpression
        && !segments.length, [leftCut, rightCut, segments]);
    (0, react_1.useEffect)(() => {
        containerRef.current?.addEventListener('wheel', handleOnWheel, { passive: false });
        return () => containerRef.current?.removeEventListener('wheel', handleOnWheel);
    }, []);
    const getPointOnTimeline = (0, react_1.useCallback)((event) => {
        const axisRect = event.currentTarget.getBoundingClientRect();
        const eventOffsetX = event.pageX - axisRect.left;
        return (eventOffsetX * right) / axisRect.width;
    }, [right]);
    const handleOnMouseMove = (0, react_1.useCallback)((event) => {
        const { active, x } = timelinePanning;
        if (active) {
            const point = getPointOnTimeline(event);
            dispatch((0, actions_any_1.addToOffset)(x - point));
            dispatch((0, actions_any_1.setTimelinePanning)({ ...timelinePanning,
                x: point }));
        }
    }, [timelinePanning, dispatch, actions_any_1.addToOffset, actions_any_1.setTimelinePanning, getPointOnTimeline]);
    const handleOnMouseDown = (0, react_1.useCallback)((event) => {
        const point = getPointOnTimeline(event);
        dispatch((0, actions_any_1.setTimelinePanning)({
            active: true,
            x: point
        }));
        event.preventDefault();
        event.stopPropagation();
    }, [getPointOnTimeline, dispatch, actions_any_1.setTimelinePanning]);
    return (react_1.default.createElement("div", { className: 'timeline-container', onMouseDown: handleOnMouseDown, onMouseMove: handleOnMouseMove, ref: containerRef },
        react_1.default.createElement("div", { className: 'timeline' },
            !hideStartAndEndSegments() && react_1.default.createElement("div", { "aria-label": 'start', style: getStartStyle() }),
            hideStartAndEndSegments() && react_1.default.createElement("div", { style: getOneSegmentStyle(leftCut?.faceExpression) }),
            segments?.map(({ duration, timestamp, faceExpression }) => (react_1.default.createElement("div", { "aria-label": faceExpression, key: timestamp, style: getStyle(duration, faceExpression) }))),
            !hideStartAndEndSegments() && react_1.default.createElement("div", { "aria-label": 'end', style: getEndStyle() }))));
};
exports.default = Timeline;
