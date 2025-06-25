"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const ColorPalette_1 = require("../../../styles/components/styles/ColorPalette");
const styles_1 = require("../styles");
const DEFAULT_SIZE = 65;
/**
 * The styles of the feature base/participants.
 */
exports.default = {
    avatarContainer: (size = DEFAULT_SIZE) => {
        return {
            alignItems: 'center',
            borderRadius: size / 2,
            height: size,
            justifyContent: 'center',
            overflow: 'hidden',
            width: size
        };
    },
    avatarContent: (size = DEFAULT_SIZE) => {
        return {
            height: size,
            width: size
        };
    },
    badge: (size = DEFAULT_SIZE, status) => {
        let color;
        switch (status) {
            case 'available':
                color = styles_1.PRESENCE_AVAILABLE_COLOR;
                break;
            case 'away':
                color = styles_1.PRESENCE_AWAY_COLOR;
                break;
            case 'busy':
                color = styles_1.PRESENCE_BUSY_COLOR;
                break;
            case 'idle':
                color = styles_1.PRESENCE_IDLE_COLOR;
                break;
        }
        return {
            backgroundColor: color,
            borderRadius: size / 2,
            bottom: 0,
            height: size * 0.3,
            position: 'absolute',
            width: size * 0.3
        };
    },
    badgeContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject
    },
    initialsContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center'
    },
    initialsText: (size = DEFAULT_SIZE) => {
        return {
            color: 'white',
            fontSize: size * 0.45,
            fontWeight: '100'
        };
    },
    staticAvatar: {
        backgroundColor: ColorPalette_1.ColorPalette.lightGrey,
        opacity: 0.4
    }
};
