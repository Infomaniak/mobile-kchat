"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const functions_1 = require("../base/participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const constants_1 = require("../filmstrip/constants");
const functions_any_1 = require("../video-layout/functions.any");
const actions_any_1 = require("./actions.any");
const functions_any_2 = require("./functions.any");
/**
 * Notifies when audio availability changes.
 */
StateListenerRegistry_1.default.register(
/* selector */ (state) => (0, functions_any_2.isAudioMuteButtonDisabled)(state), 
/* listener */ (disabled, store, previousDisabled) => {
    if (disabled !== previousDisabled) {
        APP.API.notifyAudioAvailabilityChanged(!disabled);
    }
});
const checkToolboxOverlap = (clientHeight, store) => {
    let toolboxRect = document.querySelector('.toolbox-content-items')?.getBoundingClientRect();
    if (!toolboxRect) {
        return;
    }
    const tiles = document.querySelectorAll('span.videocontainer');
    if (!tiles.length) {
        return;
    }
    const toolboxHeight = 48 + 12; // height + padding
    const bottomMargin = 16;
    // Set top and bottom manually to avoid wrong coordinates
    // caused by the hiding/ showing of the toolbox.
    toolboxRect = {
        ...toolboxRect,
        top: clientHeight - toolboxHeight - bottomMargin,
        bottom: clientHeight - bottomMargin,
        left: toolboxRect.left,
        right: toolboxRect.right
    };
    let isIntersecting = false;
    const rows = store.getState()['features/filmstrip'].tileViewDimensions?.gridDimensions?.rows;
    const noOfTilesToCheck = rows === 1 ? tiles.length : constants_1.DEFAULT_MAX_COLUMNS - 1;
    for (let i = 1; i < Math.max(noOfTilesToCheck, tiles.length); i++) {
        const tile = tiles[tiles.length - i];
        const indicatorsRect = tile?.querySelector('.bottom-indicators')?.getBoundingClientRect();
        if (!indicatorsRect) {
            // eslint-disable-next-line no-continue
            continue;
        }
        if (indicatorsRect.top <= toolboxRect.bottom
            && indicatorsRect.right >= toolboxRect.left
            && indicatorsRect.bottom >= toolboxRect.top
            && indicatorsRect.left <= toolboxRect.right) {
            isIntersecting = true;
            break;
        }
    }
    store.dispatch((0, actions_any_1.setShiftUp)(isIntersecting));
};
const throttledCheckOverlap = (0, lodash_1.throttle)(checkToolboxOverlap, 100, {
    leading: false,
    trailing: true
});
/**
 * Listens for changes in the selected layout to calculate the dimensions of the tile view grid and horizontal view.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
    return {
        participantCount: (0, functions_1.getParticipantCount)(state),
        clientHeight,
        clientWidth,
        isTileView: (0, functions_any_1.isLayoutTileView)(state)
    };
}, 
/* listener */ ({ clientHeight, isTileView }, store, previousState) => {
    if (!isTileView) {
        if (previousState?.isTileView) {
            store.dispatch((0, actions_any_1.setShiftUp)(false));
        }
        return;
    }
    throttledCheckOverlap(clientHeight, store);
}, {
    deepEquals: true
});
