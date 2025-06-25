"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FaceLandmarksHelper_1 = require("./FaceLandmarksHelper");
const constants_1 = require("./constants");
let helper;
onmessage = async function ({ data }) {
    switch (data.type) {
        case constants_1.DETECT_FACE: {
            if (!helper || helper.getDetectionInProgress()) {
                return;
            }
            const detections = await helper.detect(data);
            if (detections) {
                self.postMessage(detections);
            }
            break;
        }
        case constants_1.INIT_WORKER: {
            helper = new FaceLandmarksHelper_1.HumanHelper(data);
            break;
        }
    }
};
