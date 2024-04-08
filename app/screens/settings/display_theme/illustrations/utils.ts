// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type Props = {
    width: number;
    isDark: boolean;
    borderColorBase: string;
    borderColorMix: string;
}

export const baseWidth = 100;
export const baseHeight = 66;

export const calculateHeight = (width: number) => Math.round((width * baseHeight) / baseWidth);
