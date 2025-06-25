"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/participants/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_2 = require("./actionTypes");
const DEFAULT_STATE = {
    /**
     * The list of participants to be displayed on the stage filmstrip.
     */
    activeParticipants: [],
    /**
     * The indicator which determines whether the {@link Filmstrip} is enabled.
     *
     * @public
     * @type {boolean}
     */
    enabled: true,
    /**
     * The horizontal view dimensions.
     *
     * @public
     * @type {Object}
     */
    horizontalViewDimensions: {},
    /**
     * Whether or not the user is actively resizing the filmstrip.
     *
     * @public
     * @type {boolean}
     */
    isResizing: false,
    /**
     * The custom audio volume levels per participant.
     *
     * @type {Object}
     */
    participantsVolume: {},
    /**
     * The ordered IDs of the remote participants displayed in the filmstrip.
     *
     * @public
     * @type {Array<string>}
     */
    remoteParticipants: [],
    /**
     * The dimensions of the screenshare filmstrip.
     */
    screenshareFilmstripDimensions: {},
    /**
     * The id of the participant whose screenshare to
     * display on the screenshare filmstrip.
     */
    screenshareFilmstripParticipantId: null,
    /**
     * The stage filmstrip view dimensions.
     *
     * @public
     * @type {Object}
     */
    stageFilmstripDimensions: {},
    /**
     * The tile view dimensions.
     *
     * @public
     * @type {Object}
     */
    tileViewDimensions: {},
    /**
     * The height of the resizable top panel.
     */
    topPanelHeight: {
        /**
         * Current height. Affected by: user top panel resize,
         * window resize.
         */
        current: null,
        /**
         * Height set by user resize. Used as the preferred height.
         */
        userSet: null
    },
    /**
     * The indicator determines if the top panel is visible.
     */
    topPanelVisible: true,
    /**
     * The vertical view dimensions.
     *
     * @public
     * @type {Object}
     */
    verticalViewDimensions: {},
    /**
     * The indicator which determines whether the {@link Filmstrip} is visible.
     *
     * @public
     * @type {boolean}
     */
    visible: true,
    /**
     * The end index in the remote participants array that is visible in the filmstrip.
     *
     * @public
     * @type {number}
     */
    visibleParticipantsEndIndex: 0,
    /**
     * The start index in the remote participants array that is visible in the filmstrip.
     *
     * @public
     * @type {number}
     */
    visibleParticipantsStartIndex: 0,
    /**
     * The visible remote participants in the filmstrip.
     *
     * @public
     * @type {Set<string>}
     */
    visibleRemoteParticipants: new Set(),
    /**
     * The width of the resizable filmstrip.
     *
     * @public
     * @type {Object}
     */
    width: {
        /**
         * Current width. Affected by: user filmstrip resize,
         * window resize, panels open/ close.
         */
        current: null,
        /**
         * Width set by user resize. Used as the preferred width.
         */
        userSet: null
    }
};
ReducerRegistry_1.default.register('features/filmstrip', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_2.SET_FILMSTRIP_ENABLED:
            return {
                ...state,
                enabled: action.enabled
            };
        case actionTypes_2.SET_FILMSTRIP_VISIBLE:
            return {
                ...state,
                visible: action.visible
            };
        case actionTypes_2.SET_HORIZONTAL_VIEW_DIMENSIONS:
            return {
                ...state,
                horizontalViewDimensions: action.dimensions
            };
        case actionTypes_2.SET_REMOTE_PARTICIPANTS: {
            state.remoteParticipants = action.participants;
            const { visibleParticipantsStartIndex: startIndex, visibleParticipantsEndIndex: endIndex } = state;
            state.visibleRemoteParticipants = new Set(state.remoteParticipants.slice(startIndex, endIndex + 1));
            return { ...state };
        }
        case actionTypes_2.SET_TILE_VIEW_DIMENSIONS:
            return {
                ...state,
                tileViewDimensions: action.dimensions
            };
        case actionTypes_2.SET_VERTICAL_VIEW_DIMENSIONS:
            return {
                ...state,
                verticalViewDimensions: action.dimensions
            };
        case actionTypes_2.SET_VOLUME:
            return {
                ...state,
                participantsVolume: {
                    ...state.participantsVolume,
                    // NOTE: This would fit better in the features/base/participants. But currently we store
                    // the participants as an array which will make it expensive to search for the volume for
                    // every participant separately.
                    [action.participantId]: action.volume
                }
            };
        case actionTypes_2.SET_VISIBLE_REMOTE_PARTICIPANTS: {
            const { endIndex, startIndex } = action;
            const { remoteParticipants } = state;
            const visibleRemoteParticipants = new Set(remoteParticipants.slice(startIndex, endIndex + 1));
            return {
                ...state,
                visibleParticipantsStartIndex: startIndex,
                visibleParticipantsEndIndex: endIndex,
                visibleRemoteParticipants
            };
        }
        case actionTypes_1.PARTICIPANT_LEFT: {
            const { id, local } = action.participant;
            if (local) {
                return state;
            }
            delete state.participantsVolume[id];
            return {
                ...state
            };
        }
        case actionTypes_2.SET_FILMSTRIP_HEIGHT: {
            return {
                ...state,
                topPanelHeight: {
                    ...state.topPanelHeight,
                    current: action.height
                }
            };
        }
        case actionTypes_2.SET_FILMSTRIP_WIDTH: {
            return {
                ...state,
                width: {
                    ...state.width,
                    current: action.width
                }
            };
        }
        case actionTypes_2.SET_USER_FILMSTRIP_HEIGHT: {
            const { height } = action;
            return {
                ...state,
                topPanelHeight: {
                    current: height,
                    userSet: height
                }
            };
        }
        case actionTypes_2.SET_USER_FILMSTRIP_WIDTH: {
            const { width } = action;
            return {
                ...state,
                width: {
                    current: width,
                    userSet: width
                }
            };
        }
        case actionTypes_2.SET_USER_IS_RESIZING: {
            return {
                ...state,
                isResizing: action.resizing
            };
        }
        case actionTypes_2.SET_STAGE_FILMSTRIP_DIMENSIONS: {
            return {
                ...state,
                stageFilmstripDimensions: action.dimensions
            };
        }
        case actionTypes_2.SET_STAGE_PARTICIPANTS: {
            return {
                ...state,
                activeParticipants: action.queue
            };
        }
        case actionTypes_2.REMOVE_STAGE_PARTICIPANT: {
            return {
                ...state,
                activeParticipants: state.activeParticipants.filter(p => p.participantId !== action.participantId)
            };
        }
        case actionTypes_2.CLEAR_STAGE_PARTICIPANTS: {
            return {
                ...state,
                activeParticipants: []
            };
        }
        case actionTypes_2.SET_SCREENSHARING_TILE_DIMENSIONS: {
            return {
                ...state,
                screenshareFilmstripDimensions: action.dimensions
            };
        }
        case actionTypes_2.SET_TOP_PANEL_VISIBILITY: {
            return {
                ...state,
                topPanelVisible: action.visible
            };
        }
        case actionTypes_2.SET_SCREENSHARE_FILMSTRIP_PARTICIPANT: {
            return {
                ...state,
                screenshareFilmstripParticipantId: action.participantId
            };
        }
    }
    return state;
});
