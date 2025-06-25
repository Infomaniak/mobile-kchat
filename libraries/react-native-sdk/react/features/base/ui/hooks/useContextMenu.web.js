"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const functions_web_1 = require("../functions.web");
const initialState = Object.freeze({});
const useContextMenu = () => {
    const [raiseContext, setRaiseContext] = (0, react_1.useState)(initialState);
    const isMouseOverMenu = (0, react_1.useRef)(false);
    const lowerMenu = (0, react_1.useCallback)((force = false) => {
        /**
         * We are tracking mouse movement over the active participant item and
         * the context menu. Due to the order of enter/leave events, we need to
         * defer checking if the mouse is over the context menu with
         * queueMicrotask.
         */
        window.queueMicrotask(() => {
            if (isMouseOverMenu.current && !(force === true)) {
                return;
            }
            if (raiseContext !== initialState) {
                setRaiseContext(initialState);
            }
        });
    }, [raiseContext]);
    const raiseMenu = (0, react_1.useCallback)((entity, target) => {
        setRaiseContext({
            entity,
            offsetTarget: (0, functions_web_1.findAncestorByClass)(target, 'list-item-container')
        });
    }, [raiseContext]);
    const toggleMenu = (0, react_1.useCallback)((entity) => (e) => {
        e?.stopPropagation();
        const { entity: raisedEntity } = raiseContext;
        if (raisedEntity && raisedEntity === entity) {
            lowerMenu();
        }
        else {
            raiseMenu(entity, e?.target);
        }
    }, [raiseContext]);
    const menuEnter = (0, react_1.useCallback)(() => {
        isMouseOverMenu.current = true;
    }, []);
    const menuLeave = (0, react_1.useCallback)(() => {
        isMouseOverMenu.current = false;
    }, [lowerMenu]);
    return [lowerMenu, raiseMenu, toggleMenu, menuEnter, menuLeave, raiseContext];
};
exports.default = useContextMenu;
