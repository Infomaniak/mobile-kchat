// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as React from 'react';
import Svg, {Path, Rect, Circle, Mask, G} from 'react-native-svg';

import {isDarkTheme} from '@utils/theme';

type Props = {
    theme: Theme;
};

const PublicChannelIllustration = ({theme}: Props) => {
    if (isDarkTheme(theme)) {
        return (
            <Svg
                width={152}
                height={149}
                viewBox='0 0 519 256'
                fill='none'
            >
                <Path
                    d='M340.935 193.138h-.782v17.666l-19.326-17.464-.223-.202H180.053a5.48 5.48 0 0 1-5.48-5.48V70.456a5.48 5.48 0 0 1 5.48-5.48h191.012a5.48 5.48 0 0 1 5.48 5.48v117.202a5.48 5.48 0 0 1-5.48 5.48h-30.13Z'
                    fill='#3E3E3E'
                    stroke='#4C4C4C'
                    strokeWidth={1.566}
                />
                <Path
                    d='M188.263 161.458h.783v17.666l19.325-17.464.223-.202h140.551a5.48 5.48 0 0 0 5.48-5.48V38.776a5.48 5.48 0 0 0-5.48-5.48H158.133a5.48 5.48 0 0 0-5.48 5.48v117.202a5.48 5.48 0 0 0 5.48 5.48h30.13Z'
                    fill='#EAEAEA'
                    stroke='#4C4C4C'
                    strokeWidth={1.566}
                />
                <Path
                    d='M325.661 0H134.648a6.263 6.263 0 0 0-6.262 6.263v117.202a6.263 6.263 0 0 0 6.262 6.262h140.25l20.633 18.646v-18.646h30.13a6.263 6.263 0 0 0 6.263-6.262V6.263A6.263 6.263 0 0 0 325.661 0Z'
                    fill='#0088B2'
                />
                <Rect
                    x={142.477}
                    y={42.273}
                    width={118.816}
                    height={14.549}
                    rx={7.274}
                    fill='#EAEAEA'
                />
                <Rect
                    x={142.477}
                    y={71.371}
                    width={174.587}
                    height={14.549}
                    rx={7.274}
                    fill='#EAEAEA'
                />
                <Path
                    d='M114.804 73.586C27.126 108.03-9.21 197.37 42.784 219.977c36.198 15.738 81.275 2.735 130.222-18.364m297.99-59.92c-27.947-17.59-58.276-22.269-89.755-19.119'
                    stroke='#7C7C7C'
                    strokeWidth={1.566}
                    strokeLinecap='round'
                    strokeDasharray='12.53 12.53'
                />
                <Circle
                    cx={493.187}
                    cy={155.001}
                    r={19.082}
                    transform='rotate(24.231 493.187 155.001)'
                    fill='#7C7C7C'
                    stroke='#7C7C7C'
                    strokeWidth={0.587}
                />
                <Mask
                    id='a'
                    maskUnits='userSpaceOnUse'
                    x={474}
                    y={136}
                    width={38}
                    height={38}
                >
                    <Circle
                        cx={493.187}
                        cy={155.001}
                        r={18.788}
                        transform='rotate(24.231 493.187 155.001)'
                        fill='#fff'
                    />
                </Mask>
                <G mask='url(#a)'>
                    <Path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M492.105 159.196a8.073 8.073 0 1 0 6.626-14.724 8.073 8.073 0 0 0-6.626 14.724Zm-19.343 9.001c3.167-7.016 11.416-10.144 18.439-6.993 7.016 3.167 10.144 11.416 6.993 18.439a.735.735 0 0 1-.971.368l-24.093-10.844a.733.733 0 0 1-.368-.97Z'
                        fill='#282828'
                    />
                </G>
                <Circle
                    cx={26.235}
                    cy={154.622}
                    r={19.082}
                    transform='rotate(-35.893 26.235 154.622)'
                    fill='#7C7C7C'
                    stroke='#7C7C7C'
                    strokeWidth={0.587}
                />
                <Mask
                    id='b'
                    maskUnits='userSpaceOnUse'
                    x={7}
                    y={135}
                    width={39}
                    height={39}
                >
                    <Circle
                        cx={26.235}
                        cy={154.622}
                        r={18.788}
                        transform='rotate(-35.893 26.235 154.622)'
                        fill='#fff'
                    />
                </Mask>
                <G mask='url(#b)'>
                    <Path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M29.334 157.65a8.073 8.073 0 1 0-9.466-13.08 8.073 8.073 0 0 0 9.466 13.08Zm-1.83 21.256c-4.505-6.241-3.109-14.952 3.122-19.472 6.241-4.505 14.951-3.109 19.471 3.122a.733.733 0 0 1-.164 1.024L28.53 179.07a.734.734 0 0 1-1.024-.164Z'
                        fill='#282828'
                    />
                </G>
                <Circle
                    cx={355.408}
                    cy={236.417}
                    r={19.082}
                    fill='#7C7C7C'
                    stroke='#7C7C7C'
                    strokeWidth={0.587}
                />
                <Mask
                    id='c'
                    maskUnits='userSpaceOnUse'
                    x={336}
                    y={217}
                    width={39}
                    height={39}
                >
                    <Circle
                        cx={355.408}
                        cy={236.417}
                        r={18.788}
                        fill='#fff'
                    />
                </Mask>
                <G mask='url(#c)'>
                    <Path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M356.141 240.687a8.072 8.072 0 0 0 8.073-8.073 8.073 8.073 0 1 0-8.073 8.073Zm-13.944 16.146c.009-7.697 6.247-13.935 13.945-13.944 7.697.009 13.935 6.247 13.944 13.944a.734.734 0 0 1-.734.734h-26.421a.734.734 0 0 1-.734-.734Z'
                        fill='#282828'
                    />
                </G>
            </Svg>
        );
    }
    return (
        <Svg
            width={152}
            height={149}
            viewBox='0 0 519 256'
            fill='none'
        >
            <Path
                d='M340.935 193.138h-.782v17.666l-19.326-17.464-.223-.202H180.053a5.48 5.48 0 0 1-5.48-5.48V70.456a5.48 5.48 0 0 1 5.48-5.48h191.012a5.48 5.48 0 0 1 5.48 5.48v117.202a5.48 5.48 0 0 1-5.48 5.48h-30.13Z'
                fill='#F5F5F5'
                stroke='#E0E0E0'
                strokeWidth={1.566}
            />
            <Path
                d='M188.263 161.458h.783v17.666l19.325-17.464.223-.202h140.551a5.48 5.48 0 0 0 5.48-5.48V38.776a5.48 5.48 0 0 0-5.48-5.48H158.133a5.48 5.48 0 0 0-5.48 5.48v117.202a5.48 5.48 0 0 0 5.48 5.48h30.13Z'
                fill='#fff'
                stroke='#E0E0E0'
                strokeWidth={1.566}
            />
            <Path
                d='M325.661 0H134.648a6.263 6.263 0 0 0-6.262 6.263v117.202a6.263 6.263 0 0 0 6.262 6.262h140.25l20.633 18.646v-18.646h30.13a6.263 6.263 0 0 0 6.263-6.262V6.263A6.263 6.263 0 0 0 325.661 0Z'
                fill='#0088B2'
            />
            <Rect
                x={142.477}
                y={42.273}
                width={118.816}
                height={14.549}
                rx={7.274}
                fill='#fff'
                fillOpacity={0.4}
            />
            <Rect
                x={142.477}
                y={71.371}
                width={174.587}
                height={14.549}
                rx={7.274}
                fill='#fff'
                fillOpacity={0.4}
            />
            <Path
                d='M114.804 73.586C27.126 108.03-9.21 197.37 42.784 219.977c36.198 15.738 81.275 2.735 130.222-18.364m297.99-59.92c-27.947-17.59-58.276-22.269-89.755-19.119'
                stroke='#E0E0E0'
                strokeWidth={1.566}
                strokeLinecap='round'
                strokeDasharray='12.53 12.53'
            />
            <Circle
                cx={493.187}
                cy={155.001}
                r={19.082}
                transform='rotate(24.231 493.187 155.001)'
                fill='#E0E0E0'
                stroke='#E0E0E0'
                strokeWidth={0.587}
            />
            <Mask
                id='a'
                maskUnits='userSpaceOnUse'
                x={474}
                y={136}
                width={38}
                height={38}
            >
                <Circle
                    cx={493.187}
                    cy={155.001}
                    r={18.788}
                    transform='rotate(24.231 493.187 155.001)'
                    fill='#fff'
                />
            </Mask>
            <G mask='url(#a)'>
                <Path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M492.105 159.196a8.073 8.073 0 1 0 6.626-14.724 8.073 8.073 0 0 0-6.626 14.724Zm-19.343 9.001c3.167-7.016 11.416-10.144 18.439-6.993 7.016 3.167 10.144 11.416 6.993 18.439a.735.735 0 0 1-.971.368l-24.093-10.844a.733.733 0 0 1-.368-.97Z'
                    fill='#FAFAFA'
                />
            </G>
            <Circle
                cx={26.235}
                cy={154.622}
                r={19.082}
                transform='rotate(-35.893 26.235 154.622)'
                fill='#E0E0E0'
                stroke='#E0E0E0'
                strokeWidth={0.587}
            />
            <Mask
                id='b'
                maskUnits='userSpaceOnUse'
                x={7}
                y={135}
                width={39}
                height={39}
            >
                <Circle
                    cx={26.235}
                    cy={154.622}
                    r={18.788}
                    transform='rotate(-35.893 26.235 154.622)'
                    fill='#fff'
                />
            </Mask>
            <G mask='url(#b)'>
                <Path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M29.334 157.65a8.073 8.073 0 1 0-9.466-13.08 8.073 8.073 0 0 0 9.466 13.08Zm-1.83 21.256c-4.505-6.241-3.109-14.952 3.122-19.472 6.241-4.505 14.951-3.109 19.471 3.122a.733.733 0 0 1-.164 1.024L28.53 179.07a.734.734 0 0 1-1.024-.164Z'
                    fill='#FAFAFA'
                />
            </G>
            <Circle
                cx={355.408}
                cy={236.417}
                r={19.082}
                fill='#E0E0E0'
                stroke='#E0E0E0'
                strokeWidth={0.587}
            />
            <Mask
                id='c'
                maskUnits='userSpaceOnUse'
                x={336}
                y={217}
                width={39}
                height={39}
            >
                <Circle
                    cx={355.408}
                    cy={236.417}
                    r={18.788}
                    fill='#fff'
                />
            </Mask>
            <G mask='url(#c)'>
                <Path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M356.141 240.687a8.072 8.072 0 0 0 8.073-8.073 8.073 8.073 0 1 0-8.073 8.073Zm-13.944 16.146c.009-7.697 6.247-13.935 13.945-13.944 7.697.009 13.935 6.247 13.944 13.944a.734.734 0 0 1-.734.734h-26.421a.734.734 0 0 1-.734-.734Z'
                    fill='#FAFAFA'
                />
            </G>
        </Svg>
    );
};

export default PublicChannelIllustration;
