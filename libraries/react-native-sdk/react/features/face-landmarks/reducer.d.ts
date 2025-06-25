import { FaceBox, FaceLandmarks } from './types';
export interface IFaceLandmarksState {
    faceBoxes: {
        [key: string]: FaceBox;
    };
    faceLandmarks: Array<FaceLandmarks>;
    faceLandmarksBuffer: Array<{
        emotion: string;
        timestamp: number;
    }>;
    recognitionActive: boolean;
}
