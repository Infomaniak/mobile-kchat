// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import Canvas, {type CanvasRenderingContext2D} from 'react-native-canvas';

import {useTheme} from '@context/theme';

const canvasWidth = 200;
const canvasHeight = 50;
const canvasBarWidth = 2;
const minAmplitude = 35;
const spacing = 4;

const draw = (ctx: CanvasRenderingContext2D, data: number[], canvasBarColor: string) => {
    // Translate the canvas origin to middle of the height
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.translate(0, canvasHeight / 2);

    for (let i = 0; i < data.length; i++) {
        const value = Math.max(-minAmplitude, data[i]);
        const amplitudePercentage = Math.max(0.3, (value + minAmplitude) / minAmplitude);
        const xPoint = canvasWidth - ((canvasBarWidth * i) + (spacing * i));

        // Adjust the amplitude height based on the position
        // const positionFactor = Math.sin((i / 2) * Math.PI);
        // const adjustedAmplitude = amplitudePercentage * positionFactor;
        // const amplitudeHeight = (adjustedAmplitude * canvasHeight) / 4;
        const amplitudeHeight = (amplitudePercentage * canvasHeight) / 4;

        // Draw the visualizer bars
        ctx.lineWidth = canvasBarWidth;
        ctx.strokeStyle = canvasBarColor;

        ctx.beginPath();
        ctx.moveTo(xPoint, amplitudeHeight);
        ctx.lineTo(xPoint, -amplitudeHeight);
        ctx.stroke();
    }

    // Reset the translation for the next frame
    ctx.translate(0, -canvasHeight / 2);
};

type SoundWaveCanvasProps = {
    data: number[];
    isRecording: boolean;
}

const SoundWaveCanvas = ({data, isRecording}: SoundWaveCanvasProps) => {
    const theme = useTheme();
    const canvasRef = useRef<Canvas | null>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

    const formattedData = useMemo(() => data.slice(0, 30), [data]);

    const initCanvas = useCallback((canvas: Canvas) => {
        if (canvas) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvasRef.current = canvas;
            canvasContextRef.current = canvas.getContext('2d');
        }
    }, []);

    useEffect(() => {
        if (isRecording && canvasContextRef.current) {
            draw(canvasContextRef.current, formattedData, theme.buttonBg);
        }
    }, [isRecording, data]);

    return (
        <Canvas ref={initCanvas}/>
    );
};

export default memo(SoundWaveCanvas);
