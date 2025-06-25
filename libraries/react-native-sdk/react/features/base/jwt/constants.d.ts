/**
 * The list of supported meeting features to enable/disable through jwt.
 */
export declare const MEET_FEATURES: {
    BRANDING: string;
    CALENDAR: string;
    FLIP: string;
    INBOUND_CALL: string;
    LIVESTREAMING: string;
    LOBBY: string;
    MODERATION: string;
    OUTBOUND_CALL: string;
    RECORDING: string;
    ROOM: string;
    SCREEN_SHARING: string;
    SIP_INBOUND_CALL: string;
    SIP_OUTBOUND_CALL: string;
    TRANSCRIPTION: string;
};
/**
 * A mapping between jwt features and toolbar buttons keys.
 */
export declare const FEATURES_TO_BUTTONS_MAPPING: {
    livestreaming: string;
    recording: string;
    transcription: string;
};
/**
 * The JWT validation errors for JaaS.
 */
export declare const JWT_VALIDATION_ERRORS: {
    AUD_INVALID: string;
    CONTEXT_NOT_FOUND: string;
    EXP_INVALID: string;
    FEATURE_INVALID: string;
    FEATURE_VALUE_INVALID: string;
    FEATURES_NOT_FOUND: string;
    HEADER_NOT_FOUND: string;
    ISS_INVALID: string;
    KID_NOT_FOUND: string;
    KID_MISMATCH: string;
    NBF_FUTURE: string;
    NBF_INVALID: string;
    PAYLOAD_NOT_FOUND: string;
    TOKEN_EXPIRED: string;
};
