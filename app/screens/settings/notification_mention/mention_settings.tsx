// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {updateMe} from '@actions/remote/user';
import FloatingTextChipsInput from '@components/floating_input/floating_text_chips_input';
import SettingBlock from '@components/settings/block';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useBackNavigation from '@hooks/navigate_back';
import {popTopScreen} from '@screens/navigation';
import {areBothStringArraysEqual} from '@utils/helpers';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {getNotificationProps} from '@utils/user';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const mentionHeaderText = defineMessage({
    id: 'notification_settings.mentions.keywords_mention',
    defaultMessage: 'Keywords that trigger mentions',
});

const COMMA_KEY = ',';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        flex: {flex: 1},
        input: {
            color: theme.centerChannelColor,
            paddingHorizontal: 25,
            ...typography('Body', 100, 'Regular'),
        },
        containerStyle: {
            marginTop: 5,
            width: '100%',
            paddingTop: 10,
        },
        keywordLabelStyle: {
            marginTop: 4,
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75, 'Regular'),
        },
    };
});

type Props = {
    componentId: AvailableScreens;
    currentUser?: UserModel;
    isCRTEnabled: boolean;
};

export function getMentionProps(currentUser?: UserModel) {
    const notifyProps = getNotificationProps(currentUser);
    const mentionKeys = notifyProps?.mention_keys ?? '';

    let mentionKeywords: string[] = [];
    let usernameMention = false;
    mentionKeys.split(',').forEach((mentionKey) => {
        if (currentUser && mentionKey === currentUser.username) {
            usernameMention = true;
        } else if (mentionKey) {
            mentionKeywords = [...mentionKeywords, mentionKey];
        }
    });

    return {
        mentionKeywords,
        usernameMention,
        channel: notifyProps.channel === 'true',
        first_name: notifyProps.first_name === 'true',
        comments: notifyProps.comments || '',
        notifyProps,
    };
}

export type CanSaveSettings = {
    mentionKeywords: string[];
    mentionProps: ReturnType<typeof getMentionProps>;
}

export function canSaveSettings({mentionKeywords, mentionProps}: CanSaveSettings) {
    const mentionKeywordsChanged = !areBothStringArraysEqual(mentionKeywords, mentionProps.mentionKeywords);
    return mentionKeywordsChanged;
}

export function getUniqueKeywordsFromInput(inputText: string, keywords: string[]) {
    // Replace all the spaces and commas
    const formattedInputText = inputText.trim().replace(/ |,/g, '');

    // Check if the keyword is not empty and not already in the list
    if (formattedInputText.length > 0 && !keywords.includes(formattedInputText)) {
        return [...keywords, formattedInputText];
    }

    return keywords;
}

const MentionSettings = ({componentId, currentUser}: Props) => {
    const serverUrl = useServerUrl();
    const [mentionProps] = useState(() => getMentionProps(currentUser));
    const notifyProps = mentionProps.notifyProps;

    const [mentionKeywords, setMentionKeywords] = useState(mentionProps.mentionKeywords);
    const [mentionKeywordsInput, setMentionKeywordsInput] = useState('');
    const [isInputVisible, setIsInputVisible] = useState(mentionProps.mentionKeywords.length > 0);
    const [isSwitchOn, setIsSwitchOn] = useState(mentionProps.mentionKeywords.length > 0);

    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const saveKeywords = useCallback((keywordsToSave: string[]) => {
        if (!currentUser) {
            return;
        }
        const canSave = canSaveSettings({
            mentionKeywords: keywordsToSave,
            mentionProps,
        });
        if (canSave) {
            const notify_props: UserNotifyProps = {
                ...notifyProps,
                mention_keys: keywordsToSave.join(','),
            };
            updateMe(serverUrl, {notify_props});
        }
    }, [currentUser, mentionProps, notifyProps, serverUrl]);

    const toggleInputVisibility = useCallback(() => {
        setIsInputVisible((prev) => !prev);
    }, []);

    const toggleSwitch = useCallback(() => {
        setIsSwitchOn((prev) => {
            const newSwitchState = !prev;
            if (!newSwitchState) {
                setMentionKeywords([]);
                const notify_props: UserNotifyProps = {
                    ...notifyProps,
                    mention_keys: '',
                };
                updateMe(serverUrl, {notify_props});
            }
            return newSwitchState;
        });
        toggleInputVisibility();
    }, [toggleInputVisibility, notifyProps, serverUrl]);

    const handleMentionKeywordRemoved = useCallback((keyword: string) => {
        const newKeywords = mentionKeywords.filter((item) => item !== keyword);
        setMentionKeywords(newKeywords);
        saveKeywords(newKeywords);
    }, [mentionKeywords, saveKeywords]);

    const appendKeywordsAndClearInput = useCallback((key: string, list: string[]) => {
        const keyAppendedToList = getUniqueKeywordsFromInput(key, list);
        if (keyAppendedToList.length === list.length) {
            // No new keyword added (empty or duplicate)
            setMentionKeywordsInput('');
            return;
        }
        setMentionKeywordsInput('');
        if (keyAppendedToList.length > 0) {
            setIsSwitchOn(true);
            setIsInputVisible(true);
        }
        setMentionKeywords(keyAppendedToList);
        saveKeywords(keyAppendedToList);
    }, [saveKeywords]);

    /**
     * Handler on every key press in the input
     */
    const handleMentionKeywordsInputChanged = useCallback((text: string) => {
        if (text.includes(COMMA_KEY)) {
            appendKeywordsAndClearInput(text, mentionKeywords);
        } else {
            setMentionKeywordsInput(text);
        }
    }, [appendKeywordsAndClearInput, mentionKeywords]);

    /**
     * Handler when the user presses the enter key on keyboard
     * Takes unsaved keywords from the input and adds them to the list
     */
    const handleMentionKeywordEntered = useCallback(() => {
        appendKeywordsAndClearInput(mentionKeywordsInput, mentionKeywords);
    }, [appendKeywordsAndClearInput, mentionKeywordsInput, mentionKeywords]);

    const handleBack = useCallback(() => {
        popTopScreen(componentId);
    }, [componentId]);

    useBackNavigation(handleBack);
    useAndroidHardwareBackHandler(componentId, handleBack);

    return (
        <KeyboardAwareScrollView
            bounces={false}
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode='none'
            scrollToOverflowEnabled={true}
            noPaddingBottomOnAndroid={true}
            style={styles.flex}
        >
            <SettingBlock
                headerText={mentionHeaderText}
                addButton={true}
                isSwitchOn={isSwitchOn}
                toggleSwitch={toggleSwitch}
            >
                {isInputVisible && (
                    <>
                        <View style={styles.containerStyle}>
                            <FloatingTextChipsInput
                                blurOnSubmit={true}
                                label={intl.formatMessage({
                                    id: 'notification_settings.mentions.keywords',
                                    defaultMessage: 'Enter other keywords',
                                })}
                                onTextInputChange={handleMentionKeywordsInputChanged}
                                onChipRemove={handleMentionKeywordRemoved}
                                returnKeyType='done'
                                testID='mention_notification_settings.keywords.input'
                                theme={theme}
                                chipsValues={mentionKeywords}
                                textInputValue={mentionKeywordsInput}
                                onTextInputSubmitted={handleMentionKeywordEntered}
                            />
                        </View>
                        <Text
                            style={styles.keywordLabelStyle}
                            testID='mention_notification_settings.keywords.input.description'
                        >
                            {intl.formatMessage({
                                id: 'notification_settings.mentions.keywordsLabel',
                                defaultMessage:
                            'Keywords are not case-sensitive. Separate keywords with commas.',
                            })}
                        </Text>
                    </>
                )}
            </SettingBlock>
        </KeyboardAwareScrollView>
    );
};

export default MentionSettings;
