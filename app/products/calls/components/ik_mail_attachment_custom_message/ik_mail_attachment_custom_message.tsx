// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedDate} from 'react-intl';
import {Text, View} from 'react-native';

import FormattedText from '@components/formatted_text';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import KMailIcon from './kmail_icon';

export type MailAttachmentProps = { to: string; subject: string;created_at: number};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    icon: {
        borderRadius: 4,
        backgroundColor: theme.bgSecondary,
        flexShrink: 0,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 16,
        width: 16,
    },
    mail_attachment: {
        borderRadius: 4,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: theme.bgSecondary,
        marginBottom: 8,
        marginTop: 8,
        width: '100%',
    },
    container: {
        overflow: 'hidden',
        flexDirection: 'row',
        gap: 8,
        borderRadius: 4,
        marginTop: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8,
        width: '100%',
        backgroundColor: theme.centerChannelBg,
        flexShrink: 1,
        display: 'flex',
        alignItems: 'flex-start',
        ...typography('Body', 100),
    },
    row: {
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        gap: 8,
        flexDirection: 'row',
    },
    column: {
        overflow: 'hidden',
        width: '100%',
        flexShrink: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    thin: {
        flexShrink: 0,
        lineHeight: 16,
        color: changeOpacity(theme.centerChannelColor, 0.64),
    },
    bold: {
        flexShrink: 1,
        fontWeight: 'bold',
        color: theme.centerChannelColor,
        lineHeight: 16,
    },
}));

export const IkMailAttachmentCustomMessage = (props: MailAttachmentProps) => {
    const {subject, to, created_at} = props;
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    return (
        <View style={styles.mail_attachment}>
            <FormattedText
                id='mobile.mail_preview.title'
                style={styles.thin}
                defaultMessage='About the email:'
            />

            <View style={styles.container}>

                <View style={styles.icon}>
                    <KMailIcon/>
                </View>
                <View
                    style={styles.column}
                >
                    <View style={styles.row}>
                        <Text
                            numberOfLines={1}
                            style={styles.bold}
                        >{to}</Text>
                        <Text
                            style={styles.thin}
                        >
                            <FormattedDate value={created_at * 1000}/></Text>
                    </View>
                    <View style={styles.row}>
                        <FormattedText
                            id='mobile.mail_preview.subject'
                            style={styles.thin}
                            defaultMessage='Subject:'
                        />
                        <Text
                            style={styles.bold}
                        >{subject}</Text>
                    </View>
                </View>

            </View>
        </View>
    );
};
