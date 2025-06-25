"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_2 = require("../base/responsive-ui/actions");
const functions_any_1 = require("../base/settings/functions.any");
const actions_any_1 = require("../large-video/actions.any");
const functions_2 = require("../participants-pane/functions");
const actions_web_1 = require("../toolbox/actions.web");
const constants_1 = require("../video-layout/constants");
const functions_web_1 = require("../video-layout/functions.web");
const actions_web_2 = require("./actions.web");
const constants_2 = require("./constants");
const functions_web_2 = require("./functions.web");
require("./subscriber.any");
/**
 * Listens for changes in the number of participants to calculate the dimensions of the tile view grid and the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    return {
        numberOfParticipants: (0, functions_1.getParticipantCountWithFake)(state),
        disableSelfView: (0, functions_any_1.getHideSelfView)(state),
        localScreenShare: state['features/base/participants'].localScreenShare
    };
}, 
/* listener */ (currentState, store) => {
    const state = store.getState();
    const resizableFilmstrip = (0, functions_web_2.isFilmstripResizable)(state);
    if ((0, functions_web_1.shouldDisplayTileView)(state)) {
        store.dispatch((0, actions_web_2.setTileViewDimensions)());
    }
    if (resizableFilmstrip) {
        store.dispatch((0, actions_web_2.setVerticalViewDimensions)());
    }
}, {
    deepEquals: true
});
/**
 * Listens for changes in the selected layout to calculate the dimensions of the tile view grid and horizontal view.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
    return {
        layout: (0, functions_web_1.getCurrentLayout)(state),
        height: clientHeight,
        width: clientWidth
    };
}, 
/* listener */ ({ layout }, store) => {
    switch (layout) {
        case constants_1.LAYOUTS.TILE_VIEW: {
            const { pinnedParticipant } = store.getState()['features/base/participants'];
            if (pinnedParticipant) {
                store.dispatch((0, actions_1.pinParticipant)(null));
            }
            store.dispatch((0, actions_web_2.clearStageParticipants)());
            store.dispatch((0, actions_web_2.setTileViewDimensions)());
            break;
        }
        case constants_1.LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW:
            store.dispatch((0, actions_web_2.setHorizontalViewDimensions)());
            break;
        case constants_1.LAYOUTS.VERTICAL_FILMSTRIP_VIEW:
            store.dispatch((0, actions_web_2.setVerticalViewDimensions)());
            if (store.getState()['features/filmstrip'].activeParticipants.length > 1) {
                store.dispatch((0, actions_web_2.clearStageParticipants)());
            }
            break;
        case constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW:
            store.dispatch((0, actions_1.pinParticipant)(null));
            break;
    }
}, {
    deepEquals: true
});
/**
 * Listens for changes in the chat state to recompute available width.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/chat'].isOpen, 
/* listener */ (isChatOpen, store) => {
    const { innerWidth, innerHeight } = window;
    if (isChatOpen) {
        document.body.classList.add('shift-right');
    }
    else {
        document.body.classList.remove('shift-right');
    }
    store.dispatch((0, actions_2.clientResized)(innerWidth, innerHeight));
});
/**
 * Listens for changes in the participant pane state to calculate the
 * dimensions of the tile view grid and the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ functions_2.getParticipantsPaneOpen, 
/* listener */ (isOpen, store) => {
    const { innerWidth, innerHeight } = window;
    store.dispatch((0, actions_2.clientResized)(innerWidth, innerHeight));
});
/**
 * Listens for changes in the client width to determine whether the overflow menu(s) should be displayed as drawers.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/responsive-ui'].clientWidth < constants_2.DISPLAY_DRAWER_THRESHOLD, 
/* listener */ (widthBelowThreshold, store) => {
    store.dispatch((0, actions_web_1.setOverflowDrawer)(widthBelowThreshold));
    store.dispatch((0, actions_2.setNarrowLayout)(widthBelowThreshold));
});
/**
 * Gracefully hide/show the filmstrip when going past threshold.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/responsive-ui'].clientWidth < constants_2.ASPECT_RATIO_BREAKPOINT, 
/* listener */ (widthBelowThreshold, store) => {
    const state = store.getState();
    const { disableFilmstripAutohiding } = state['features/base/config'];
    if (!disableFilmstripAutohiding) {
        store.dispatch((0, actions_web_2.setFilmstripVisible)(!widthBelowThreshold));
    }
});
/**
 * Listens for changes in the filmstrip width to determine the size of the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/filmstrip'].width?.current, 
/* listener */ (_, store) => {
    store.dispatch((0, actions_web_2.setVerticalViewDimensions)());
});
/**
 * Listens for changes in the filmstrip config to determine the size of the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/config'].filmstrip?.disableResizable, 
/* listener */ (_, store) => {
    store.dispatch((0, actions_web_2.setVerticalViewDimensions)());
});
/**
 * Listens for changes to determine the size of the stage filmstrip tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    return {
        remoteScreenShares: state['features/video-layout'].remoteScreenShares.length,
        length: state['features/filmstrip'].activeParticipants.length,
        width: state['features/filmstrip'].width?.current,
        visible: state['features/filmstrip'].visible,
        clientWidth: state['features/base/responsive-ui'].clientWidth,
        clientHeight: state['features/base/responsive-ui'].clientHeight,
        tileView: state['features/video-layout'].tileViewEnabled,
        height: state['features/filmstrip'].topPanelHeight?.current
    };
}, 
/* listener */ (_, store) => {
    if ((0, functions_web_1.getCurrentLayout)(store.getState()) === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW) {
        store.dispatch((0, actions_web_2.setStageFilmstripViewDimensions)());
    }
}, {
    deepEquals: true
});
/**
 * Listens for changes in the active participants count determine the stage participant (when
 * there's just one).
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/filmstrip'].activeParticipants, 
/* listener */ (activeParticipants, store) => {
    if (activeParticipants.length <= 1) {
        store.dispatch((0, actions_any_1.selectParticipantInLargeVideo)());
    }
});
/**
 * Listens for changes to determine the size of the screenshare filmstrip.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    return {
        length: state['features/video-layout'].remoteScreenShares.length,
        clientWidth: state['features/base/responsive-ui'].clientWidth,
        clientHeight: state['features/base/responsive-ui'].clientHeight,
        height: state['features/filmstrip'].topPanelHeight?.current,
        width: state['features/filmstrip'].width?.current,
        visible: state['features/filmstrip'].visible,
        topPanelVisible: state['features/filmstrip'].topPanelVisible
    };
}, 
/* listener */ ({ length }, store) => {
    if (length >= 1 && (0, functions_web_2.isTopPanelEnabled)(store.getState())) {
        store.dispatch((0, actions_web_2.setScreensharingTileDimensions)());
    }
}, {
    deepEquals: true
});
/**
 * Listens for changes to clear invalid data.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/video-layout'].remoteScreenShares.length, 
/* listener */ (length, store) => {
    if (length === 0) {
        store.dispatch((0, actions_web_2.setScreenshareFilmstripParticipant)());
    }
}, {
    deepEquals: true
});
