// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {type Asset, type ImagePickerResponse, launchImageLibrary} from 'react-native-image-picker';

import {sendFeedback} from '@actions/remote/feedback/send_feedback';
import Button from '@components/button';
import FloatingTextInput from '@components/floating_input/floating_text_input_label';
import MenuDivider from '@components/menu_divider';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {getCurrentUser} from '@queries/servers/user';
import {popTopScreen} from '@screens/navigation';
import {logDebug, logError} from '@utils/log';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import FeedbackSelector from './feedback_selector';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

type FeedbackType = 'bug' | 'feature';
const FeedbackTypeOptions = [
    {text: 'Bug', value: 'bug'},
    {text: 'Feature', value: 'feature'},
] as const;

type Priority = 'low' | 'normal' | 'high' | 'urgent' | 'immediate';
const PriorityOptions = [
    {text: 'Low', value: 'low'},
    {text: 'Normal', value: 'normal'},
    {text: 'High', value: 'high'},
    {text: 'Urgent', value: 'urgent'},
    {text: 'Immediate', value: 'immediate'},
] as const;

const PriorityValueMap: Record<Priority, number> = {
    low: 1,
    normal: 2,
    high: 3,
    urgent: 4,
    immediate: 5,
};

const BUCKET_IDENTIFIER = 'kchat';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.centerChannelBg,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formPadding: {
        padding: 20,
    },
    sectionTitle: {
        ...typography('Heading', 200, 'SemiBold'),
        color: theme.centerChannelColor,
        marginBottom: 8,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: changeOpacity(theme.centerChannelColor, 0.08),
    },
    fileList: {
        marginTop: 8,
    },
    fileItem: {
        flexDirection: 'row' as const,
        alignItems: 'center',
        padding: 12,
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.04),
        borderRadius: 8,
        marginBottom: 8,
    },
    fileName: {
        ...typography('Body', 200, 'Regular'),
        color: theme.centerChannelColor,
        flex: 1,
    },
}));

type Props = {
    componentId: AvailableScreens;
};

type FileItemProps = {
    file: Asset;
    index: number;
    onRemove: (index: number) => void;
}

const FileItem = ({file, index, onRemove}: FileItemProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const handlePress = useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    return (
        <View
            key={`${file.uri}-${index}`}
            style={styles.fileItem}
        >
            <Text
                style={styles.fileName}
                numberOfLines={1}
            >
                {file.fileName || file.uri}
            </Text>
            <Button
                theme={theme}
                text={intl.formatMessage({id: 'send_feedback.files.remove', defaultMessage: 'Remove'})}
                onPress={handlePress}
                size='lg'
                emphasis='tertiary'
            />
        </View>
    );
};

const SendFeedback = ({componentId}: Props) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const database = useDatabase();
    const serverUrl = useServerUrl();

    const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
    const [priority, setPriority] = useState<Priority>('normal');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<Asset[]>([]);
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (database) {
            getCurrentUser(database).then(setCurrentUser).catch(() => {
                // silently ignore
            });
        }
    }, [database]);

    const handleClose = useCallback(() => {
        popTopScreen(componentId);
    }, [componentId]);

    useAndroidHardwareBackHandler(componentId, handleClose);

    const handleSelectFiles = useCallback(async () => {
        const result: ImagePickerResponse = await launchImageLibrary({
            mediaType: 'mixed',
            selectionLimit: 5,
            includeBase64: false,
        });

        if (result.assets) {
            setFiles((prev) => [...prev, ...result.assets!]);
        }
    }, []);

    const handleRemoveFile = useCallback((index: number) => {
        setFiles((prev) => {
            const filterByIndex = (file: Asset, i: number) => i !== index;
            return prev.filter(filterByIndex);
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!currentUser || !serverUrl) {
            return;
        }

        const prefix = Platform.OS === 'android' ? '[Android]' : '[iOS]';
        const fullSubject = `${prefix}: ${subject}`;

        setIsSubmitting(true);
        try {
            const result = await sendFeedback({
                serverUrl,
                bucketIdentifier: BUCKET_IDENTIFIER,
                type: feedbackType === 'bug' ? 'bugs' : 'features',
                subject: fullSubject,
                description,
                priorityValue: PriorityValueMap[priority],
                priorityLabel: PriorityOptions.find((p) => p.value === priority)?.text || priority,
                files: files.map((f) => ({uri: f.uri!, type: f.type, fileName: f.fileName})),
                extra: {
                    project: 'kchat',
                    userAgent: `kchat-mobile/${Platform.OS}`,
                    userId: currentUser.id,
                    userMail: currentUser.email,
                    userDisplayName: currentUser.firstName || currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : currentUser.username,
                    pageLink: serverUrl,
                },
            });

            if (result.error) {
                throw result.error;
            }

            logDebug('Feedback submitted, URL:', result.data);
            handleClose();
        } catch (error) {
            logError('SendFeedback', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, serverUrl, subject, description, feedbackType, priority, files, handleClose]);

    const canSubmit = subject.trim().length > 0 && !isSubmitting;

    const submitIcon = isSubmitting ? (
        <ActivityIndicator
            size='small'
            color={theme.buttonColor}
        />
    ) : undefined;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formPadding}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {intl.formatMessage({id: 'send_feedback.type.label', defaultMessage: 'Type'})}
                        </Text>
                        <FeedbackSelector
                            options={FeedbackTypeOptions}
                            selected={feedbackType}
                            onSelected={(value: string) => setFeedbackType(value as FeedbackType)}
                        />
                    </View>
                    <MenuDivider/>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {intl.formatMessage({id: 'send_feedback.priority.label', defaultMessage: 'Priority'})}
                        </Text>
                        <FeedbackSelector
                            options={PriorityOptions}
                            selected={priority}
                            onSelected={(value: string) => setPriority(value as Priority)}
                        />
                    </View>
                    <MenuDivider/>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {intl.formatMessage({id: 'send_feedback.subject.label', defaultMessage: 'Subject'})}
                        </Text>
                        <FloatingTextInput
                            label={intl.formatMessage({id: 'send_feedback.subject.label', defaultMessage: 'Subject'})}
                            value={subject}
                            onChangeText={setSubject}
                            theme={theme}
                        />
                    </View>
                    <MenuDivider/>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {intl.formatMessage({id: 'send_feedback.description.label', defaultMessage: 'Description'})}
                        </Text>
                        <FloatingTextInput
                            label={intl.formatMessage({id: 'send_feedback.description.label', defaultMessage: 'Description'})}
                            value={description}
                            onChangeText={setDescription}
                            theme={theme}
                            multiline={true}
                        />
                    </View>
                    <MenuDivider/>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {intl.formatMessage({id: 'send_feedback.files.label', defaultMessage: 'Files'})}
                        </Text>
                        <Button
                            theme={theme}
                            text={intl.formatMessage({id: 'send_feedback.files.select', defaultMessage: 'Select Files'})}
                            onPress={handleSelectFiles}
                            size='lg'
                        />
                        <View style={styles.fileList}>
                            {files.map((file, index) => (
                                <FileItem
                                    key={`${file.uri}-${index}`}
                                    file={file}
                                    index={index}
                                    onRemove={handleRemoveFile}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    theme={theme}
                    text={isSubmitting ? intl.formatMessage({id: 'generic.loading', defaultMessage: 'Loading'}) : intl.formatMessage({id: 'send_feedback.submit', defaultMessage: 'Send'})}
                    onPress={handleSubmit}
                    size='lg'
                    icon={submitIcon}
                    disabled={!canSubmit}
                />
            </View>
        </View>
    );
};

export default SendFeedback;
