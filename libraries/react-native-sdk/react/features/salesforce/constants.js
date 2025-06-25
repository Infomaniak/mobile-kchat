"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECORD_TYPE = exports.LIST_HEIGHT_OFFSET = exports.CONTENT_HEIGHT_OFFSET = exports.NOTES_LINES = exports.NOTES_MAX_LENGTH = void 0;
const svg_1 = require("../base/icons/svg");
exports.NOTES_MAX_LENGTH = 255;
exports.NOTES_LINES = 4;
exports.CONTENT_HEIGHT_OFFSET = 200;
exports.LIST_HEIGHT_OFFSET = 250;
exports.RECORD_TYPE = {
    ACCOUNT: {
        label: 'record.type.account',
        icon: svg_1.IconRecordAccount
    },
    CONTACT: {
        label: 'record.type.contact',
        icon: svg_1.IconRecordContact
    },
    LEAD: {
        label: 'record.type.lead',
        icon: svg_1.IconRecordLead
    },
    OPPORTUNITY: {
        label: 'record.type.opportunity',
        icon: svg_1.IconRecordOpportunity
    },
    OWNER: {
        label: 'record.type.owner'
    }
};
