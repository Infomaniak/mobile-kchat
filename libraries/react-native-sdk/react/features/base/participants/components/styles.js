"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoxModel_1 = require("../../styles/components/styles/BoxModel");
const ColorPalette_1 = require("../../styles/components/styles/ColorPalette");
/**
 * The styles of the feature base/participants.
 */
exports.default = {
    /**
     * Container for the avatar in the view.
     */
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    /**
     * Style for the text rendered when there is a connectivity problem.
     */
    connectionInfoText: {
        color: ColorPalette_1.ColorPalette.white,
        fontSize: 12,
        marginVertical: BoxModel_1.BoxModel.margin,
        marginHorizontal: BoxModel_1.BoxModel.margin,
        textAlign: 'center'
    },
    /**
     * Style for the container of the text rendered when there is a
     * connectivity problem.
     */
    connectionInfoContainer: {
        alignSelf: 'center',
        backgroundColor: ColorPalette_1.ColorPalette.darkGrey,
        borderRadius: 20,
        marginTop: BoxModel_1.BoxModel.margin
    },
    /**
     * {@code ParticipantView} Style.
     */
    participantView: {
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center'
    }
};
