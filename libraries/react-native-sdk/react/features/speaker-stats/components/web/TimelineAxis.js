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
const react_redux_1 = require("react-redux");
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
const functions_1 = require("../../functions");
const TimeElapsed_1 = __importDefault(require("./TimeElapsed"));
const TimelineAxis = () => {
    const currentDuration = (0, react_redux_1.useSelector)((state) => (0, functions_1.getCurrentDuration)(state)) ?? 0;
    const { left, right } = (0, react_redux_1.useSelector)((state) => (0, functions_1.getTimelineBoundaries)(state));
    const { timelinePanning } = (0, react_redux_1.useSelector)((state) => state['features/speaker-stats']);
    const dispatch = (0, react_redux_1.useDispatch)();
    const axisRef = (0, react_1.useRef)(null);
    const [dragLeft, setDragLeft] = (0, react_1.useState)(false);
    const [dragRight, setDragRight] = (0, react_1.useState)(false);
    const getPointOnAxis = (0, react_1.useCallback)((event) => {
        const axisRect = event.currentTarget.getBoundingClientRect();
        const eventOffsetX = event.pageX - axisRect.left;
        return (eventOffsetX * currentDuration) / axisRect.width;
    }, [currentDuration]);
    const startResizeHandlerLeft = (0, react_1.useCallback)((event) => {
        if (!timelinePanning.active && !dragRight) {
            setDragLeft(true);
        }
        event.preventDefault();
        event.stopPropagation();
    }, [dragRight, timelinePanning, setDragLeft]);
    const stopResizeLeft = () => {
        setDragLeft(false);
    };
    const resizeHandlerLeft = (0, react_1.useCallback)((event) => {
        if (dragLeft) {
            const point = getPointOnAxis(event);
            if (point >= 0 && point < right) {
                const value = point - left;
                dispatch((0, actions_any_1.addToOffsetLeft)(value));
            }
        }
    }, [dragLeft, getPointOnAxis, dispatch, actions_any_1.addToOffsetLeft]);
    const startResizeHandlerRight = (0, react_1.useCallback)((event) => {
        if (!timelinePanning.active && !dragRight) {
            setDragRight(true);
        }
        event.preventDefault();
        event.stopPropagation();
    }, [timelinePanning, dragRight]);
    const stopResizeRight = (0, react_1.useCallback)(() => {
        setDragRight(false);
    }, [setDragRight]);
    const resizeHandlerRight = (event) => {
        if (dragRight) {
            const point = getPointOnAxis(event);
            if (point > left && point <= currentDuration) {
                const value = point - right;
                dispatch((0, actions_any_1.addToOffsetRight)(value));
            }
        }
    };
    const startMoveHandler = (0, react_1.useCallback)((event) => {
        if (!dragLeft && !dragRight) {
            const point = getPointOnAxis(event);
            dispatch((0, actions_any_1.setTimelinePanning)({
                active: true,
                x: point
            }));
        }
        event.preventDefault();
        event.stopPropagation();
    }, [dragLeft, dragRight, getPointOnAxis, dispatch, actions_any_1.setTimelinePanning]);
    const stopMoveHandler = () => {
        dispatch((0, actions_any_1.setTimelinePanning)({ ...timelinePanning,
            active: false }));
    };
    const moveHandler = (0, react_1.useCallback)((event) => {
        const { active, x } = timelinePanning;
        if (active) {
            const point = getPointOnAxis(event);
            dispatch((0, actions_any_1.addToOffset)(point - x));
            dispatch((0, actions_any_1.setTimelinePanning)({ ...timelinePanning,
                x: point }));
        }
    }, [timelinePanning, getPointOnAxis, dispatch, actions_any_1.addToOffset, actions_any_1.setTimelinePanning]);
    const handleOnMouseMove = (0, react_1.useCallback)((event) => {
        resizeHandlerLeft(event);
        resizeHandlerRight(event);
        moveHandler(event);
    }, [resizeHandlerLeft, resizeHandlerRight]);
    const handleOnMouseUp = (0, react_1.useCallback)(() => {
        stopResizeLeft();
        stopResizeRight();
        stopMoveHandler();
    }, [stopResizeLeft, stopResizeRight, stopMoveHandler]);
    const getHandlerStyle = (0, react_1.useCallback)(() => {
        let marginLeft = 100 / (currentDuration / left);
        let width = 100 / (currentDuration / (right - left));
        if (axisRef.current) {
            const axisWidth = axisRef.current.getBoundingClientRect().width;
            let handlerWidth = (width / 100) * axisWidth;
            if (handlerWidth < constants_1.MIN_HANDLER_WIDTH) {
                const newLeft = right - ((currentDuration * constants_1.MIN_HANDLER_WIDTH) / axisWidth);
                handlerWidth = constants_1.MIN_HANDLER_WIDTH;
                marginLeft = 100 / (currentDuration / newLeft);
                width = 100 / (currentDuration / (right - newLeft));
            }
            if (marginLeft + width > 100) {
                return {
                    marginLeft: `calc(100% - ${handlerWidth}px)`,
                    width: handlerWidth
                };
            }
        }
        return {
            marginLeft: `${marginLeft > 0 ? marginLeft : 0}%`,
            width: `${width}%`
        };
    }, [currentDuration, left, right, axisRef]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('mouseup', handleOnMouseUp);
        return () => window.removeEventListener('mouseup', handleOnMouseUp);
    }, []);
    return (react_1.default.createElement("div", { className: 'axis-container', onMouseMove: handleOnMouseMove, ref: axisRef },
        react_1.default.createElement("div", { className: 'axis' },
            react_1.default.createElement("div", { className: 'left-bound' },
                react_1.default.createElement(TimeElapsed_1.default, { time: 0 })),
            react_1.default.createElement("div", { className: 'right-bound' },
                react_1.default.createElement(TimeElapsed_1.default, { time: currentDuration })),
            react_1.default.createElement("div", { className: 'handler', onMouseDown: startMoveHandler, style: getHandlerStyle() },
                react_1.default.createElement("div", { className: 'resize', id: 'left', onMouseDown: startResizeHandlerLeft }),
                react_1.default.createElement("div", { className: 'resize', id: 'right', onMouseDown: startResizeHandlerRight })))));
};
exports.default = TimelineAxis;
