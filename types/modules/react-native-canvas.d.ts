// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

declare module 'react-native-canvas' {
    import {type ComponentType, type Ref} from 'react';

    export interface CanvasRenderingContext2D {
        clearRect(x: number, y: number, w: number, h: number): void;
        translate(x: number, y: number): void;
        beginPath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        stroke(): void;
        lineWidth: number;
        strokeStyle: string;
    }

    export interface CanvasComponent {
        width: number;
        height: number;
        getContext(contextId: string): CanvasRenderingContext2D;
    }

    const Canvas: ComponentType<{ref?: Ref<CanvasComponent>}>;
    export default Canvas;
}
