export type FaceBox = {
    left: number;
    right: number;
    width?: number;
};
export type InitInput = {
    baseUrl: string;
    detectionTypes: string[];
};
export type DetectOutput = {
    faceBox?: FaceBox;
    faceCount: number;
    faceExpression?: FaceExpression;
};
export type FaceExpression = {
    expression: string;
    score: number;
};
export type FaceLandmarks = {
    duration: number;
    faceExpression: string;
    score?: number;
    timestamp: number;
};
