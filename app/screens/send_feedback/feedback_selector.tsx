// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {
    Modal,
    Pressable,
    Text,
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import CompassIcon from '@components/compass_icon';
import {useTheme} from '@context/theme';
import {usePreventDoubleTap} from '@hooks/utils';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        borderWidth: 1,
        borderColor: changeOpacity(theme.centerChannelColor, 0.1),
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: changeOpacity(theme.centerChannelBg, 0.9),
    },
    text: {
        ...typography('Body', 200),
        color: theme.centerChannelColor,
    },
    placeholder: {
        ...typography('Body', 200),
        color: changeOpacity(theme.centerChannelColor, 0.5),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSheet: {
        backgroundColor: theme.centerChannelBg,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: changeOpacity(theme.centerChannelColor, 0.1),
    },
    modalTitle: {
        ...typography('Heading', 300, 'SemiBold'),
        color: theme.centerChannelColor,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: changeOpacity(theme.centerChannelColor, 0.06),
    },
    optionText: {
        ...typography('Body', 200),
        flex: 1,
        color: theme.centerChannelColor,
    },
    optionTextSelected: {
        color: theme.buttonBg,
    },
    checkmark: {
        marginLeft: 8,
    },
}));

type Option = {
    text: string;
    value: string;
};

type Props = {
    options: readonly Option[];
    selected: string;
    onSelected: (value: string) => void;
}

const FeedbackSelector = ({options, selected, onSelected}: Props) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const [visible, setVisible] = useState(false);

    const selectedText = useMemo(() => {
        return options.find((opt) => opt.value === selected)?.text || '';
    }, [options, selected]);

    const handleOpen = usePreventDoubleTap(() => {
        setVisible(true);
    });

    const handleSelect = useMemo(() => (value: string) => {
        onSelected(value);
        setVisible(false);
    }, [onSelected]);

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={handleOpen}
            >
                <Text style={selectedText ? styles.text : styles.placeholder}>
                    {selectedText || intl.formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'})}
                </Text>
                <CompassIcon
                    name='chevron-down'
                    size={24}
                    color={changeOpacity(theme.centerChannelColor, 0.5)}
                />
            </Pressable>
            <Modal
                animationType='slide'
                transparent={true}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setVisible(false)}
                    />
                    <SafeAreaView style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {intl.formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'})}
                            </Text>
                            <Pressable
                                onPress={() => setVisible(false)}
                                hitSlop={12}
                            >
                                <CompassIcon
                                    name='close'
                                    size={24}
                                    color={changeOpacity(theme.centerChannelColor, 0.5)}
                                />
                            </Pressable>
                        </View>
                        <ScrollView>
                            {options.map((option) => {
                                const isSelected = option.value === selected;
                                return (
                                    <Pressable
                                        key={option.value}
                                        style={({pressed}) => [
                                            styles.optionItem,
                                            pressed && {opacity: 0.7},
                                        ]}
                                        onPress={() => handleSelect(option.value)}
                                    >
                                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                            {option.text}
                                        </Text>
                                        {isSelected && (
                                            <CompassIcon
                                                name='check'
                                                size={20}
                                                color={theme.buttonBg}
                                                style={styles.checkmark}
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
};

export default FeedbackSelector;
