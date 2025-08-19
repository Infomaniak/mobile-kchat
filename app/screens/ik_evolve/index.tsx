// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

import FormattedText from '@components/formatted_text';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import BottomSheet from '@screens/bottom_sheet';
import {makeStyleSheetFromTheme} from '@utils/theme';

import {dismissBottomSheet} from '../navigation';

import BenefitIcon from './icons/benefit';
import KchatIcon from './icons/kchat';
import MailIcon from './icons/mail';
import PlusIcon from './icons/plus';
import Header from './icons/top';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '90%',
        },
        title: {
            fontWeight: '600',
            fontSize: 18,
            lineHeight: 18,
            textAlign: 'center',
            color: theme.centerChannelColor,
            paddingBottom: 20,
        },
        subtitle: {
            color: theme.textDescription,
            textAlign: 'center',
        },
        choices: {
            width: '100%',
            paddingTop: 12,
        },
        choiceItem: {
            color: theme.textDescription,
            flexDirection: 'row',
            marginBottom: 16,
        },
        choiceIcon: {
            marginRight: 12,
        },
        choiceText: {
            color: theme.textDescription,
            flex: 1,
        },
        evolve: {
            paddingTop: 32,
        },
        flowButtonContainer: {
            width: 343,
            height: 56,
            backgroundColor: '#F1F1F1',
            borderRadius: 16,
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
            color: '#000',
            textAlign: 'center',
        },
    };
});

const IKEvolve = () => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const handleClose = useCallback(() => {
        dismissBottomSheet(Screens.INFOMANIAK_EVOLVE);
    }, []);

    const allImages = {
        euria: {path: require('@assets/images/euria.png')},
    };

    const renderContent = () => {
        return (
            <View style={styles.container}>
                <Header/>
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
                            style={styles.subtitle}
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
                            <Image
                                style={styles.choiceIcon}
                                source={allImages.euria.path}
                            />
                            <FormattedText
                                defaultMessage={'Euria: video transcription, image creation, etc.'}
                                id='upgrade_banner_ksuite_euria'
                                style={styles.choiceText}

                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <PlusIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'And much more!'}
                                id='upgrade_banner_ksuite_plus'
                                style={styles.choiceText}
                            />
                        </View>
                    </View>
                    <View style={styles.evolve}>
                        <FormattedText
                            defaultMessage={'To upgrade your plan, use the web interface.'}
                            id='upgrade_banner_ksuite_evolve'
                            style={styles.subtitle}
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
                borderColor: '#222633',
            }}
        />
    );
};

export default IKEvolve;
