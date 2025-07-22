// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import FormattedText from '@app/components/formatted_text';
import {useTheme} from '@app/context/theme';
import {makeStyleSheetFromTheme} from '@app/utils/theme';
import Emoji from '@components/emoji';
import {Screens} from '@constants';
import BottomSheet from '@screens/bottom_sheet';

import {dismissBottomSheet} from '../navigation';

import BenefitIcon from './icons/benefit';
import KchatIcon from './icons/kchat';
import MailIcon from './icons/mail';
import PlusIcon from './icons/plus';
import Header from './icons/top';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    headerTop: {
        width: '100%',
        height: 16,
        backgroundColor: '#222633',
    },
    container: {
        flex: 1,
    },
    space: {
        backgroundColor: '#222633',
    },
    content: {
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    title: {
        fontFamily: 'SuisseIntl',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: 'center',
        color: theme.centerChannelColor,
        paddingBottom: 10,
        marginTop: 0,
    },
    choices: {
        paddingTop: 32,
        maxWidth: '100%',
    },
    choiceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    choiceIcon: {
        marginRight: 12,
        flex: 1,
    },
    choiceText: {
        flex: 1,
        flexWrap: 'wrap',
    },
    evolve: {
        paddingTop: 32,
    },
    flowButtonContainer: {
        width: 343,
        height: 56,
        backgroundColor: '#F1F1F1',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 16,
    },
    flowButtonText: {
        fontFamily: 'SuisseIntl',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#000',
        textAlign: 'center',
    },

}));

const IKEvolve = () => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const handleClose = useCallback(() => {
        dismissBottomSheet(Screens.INFOMANIAK_EVOLVE);
    }, []);

    const renderContent = () => {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.headerTop}/>
                    <Header/>
                </View>
                <View style={styles.content}>
                    <View>
                        <FormattedText
                            defaultMessage={'Take it to the next level with the Standard plan'}
                            id='upgrade_banner_ksuite_title'
                            style={styles.title}
                        />
                        <FormattedText
                            defaultMessage={'Give your team the essential tools to collaborate efficiently every day.'}
                            id='upgrade_banner_ksuite_subtitle'
                        />
                    </View>
                    <View style={styles.choices}>
                        <View style={styles.choiceItem}>
                            <BenefitIcon style={styles.choiceIcon}/>
                            <FormattedText
                                style={styles.choiceText}
                                defaultMessage={'50 GB per user of kDrive and kChat cloud storage'}
                                id='upgrade_banner_ksuite_benefit'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <KchatIcon style={styles.choiceIcon}/>
                            <FormattedText
                                style={styles.choiceText}
                                defaultMessage={'kChat: unlimited message history, more channels, etc.'}
                                id='upgrade_banner_ksuite_kchat'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <MailIcon style={styles.choiceIcon}/>
                            <FormattedText
                                style={styles.choiceText}
                                defaultMessage={'Mail: unlimited mailbox storage, scheduled sending, etc.'}
                                id='upgrade_banner_ksuite_mail'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <Emoji
                                size={100}
                                emojiName={'euria'}
                            />
                            <FormattedText
                                defaultMessage={'Euria: video transcription, image creation, etc.'}
                                id='upgrade_banner_ksuite_euria'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <PlusIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'And much more!'}
                                id='upgrade_banner_ksuite_plus'
                            />
                        </View>
                    </View>
                    <View style={styles.evolve}>
                        <FormattedText
                            defaultMessage={'To upgrade your plan, use the web interface.'}
                            id='upgrade_banner_ksuite_evolve'
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.flowButtonContainer}
                        onPress={handleClose}
                    >
                        <Text style={styles.flowButtonText}>
                            <FormattedText
                                defaultMessage={'Close'}
                                id='upgrade_banner_ksuite_close'
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <BottomSheet
            renderContent={renderContent}
            componentId={Screens.INFOMANIAK_EVOLVE}
            initialSnapIndex={1}
            snapPoints={['10%', '80%']}
            contentStyle={{paddingHorizontal: 0}}
            headerStyle={{
                borderTopWidth: 50,
                borderTopColor: '#222633',
            }}
        />
    );
};

export default IKEvolve;
