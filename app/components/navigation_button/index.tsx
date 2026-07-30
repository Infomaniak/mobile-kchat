// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Pressable, Text, type StyleProp, type ViewStyle} from 'react-native';

import CompassIcon, {type CompassIconName} from '@components/compass_icon';
import {useTheme} from '@context/theme';
import {changeOpacity} from '@utils/theme';
import {typography} from '@utils/typography';

export type NavigationButtonProps = {
    borderless?: boolean;
    color?: string;
    disabled?: boolean;
    iconName?: CompassIconName;
    iconSize?: number;
    text?: string;
    count?: number | string;
    onPress: () => void;
    testID?: string;
    style?: StyleProp<ViewStyle>;
}

const hitSlop = {top: 20, bottom: 5, left: 5, right: 5};

function NavigationButton({
    color,
    count,
    disabled,
    iconName,
    iconSize = 20,
    onPress,
    testID,
    text,
    style,
}: NavigationButtonProps) {
    const theme = useTheme();
    const textColor = disabled ? changeOpacity(color ?? theme.sidebarHeaderTextColor, 0.32) : (color ?? theme.sidebarHeaderTextColor);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            hitSlop={hitSlop}
            testID={testID}
            style={({pressed}) => [pressed && {opacity: 0.72}, style]}
        >
            {Boolean(text) && <Text style={[typography('Body', 200), {color: textColor}]}>{text}</Text>}
            {Boolean(iconName) &&
                <CompassIcon
                    name={iconName!}
                    size={iconSize}
                    style={{padding: 5, color: textColor}}
                />
            }
            {Boolean(count) && <Text style={[typography('Body', 200), {color: textColor}]}>{count}</Text>}
        </Pressable>
    );
}

export default NavigationButton;
