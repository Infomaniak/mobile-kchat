// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import FormattedText from '@app/components/formatted_text';
import {useTheme} from '@app/context/theme';
import {makeStyleSheetFromTheme} from '@app/utils/theme';
import {Screens} from '@constants';
import BottomSheet from '@screens/bottom_sheet';

import {dismissBottomSheet} from '../navigation';

import BenefitIcon from './benefit';
import EuriaIcon from './euria';
import KchatIcon from './kchat';
import MailIcon from './mail';
import PlusIcon from './plus';
import Header from './top';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    headerTop: {
        width: '100%',
        height: 36,
        backgroundColor: '#222633',

    },
    header: {

        // position: 'relative',

        // width: '100%',

    },
    container: {
        flex: 1,
    },
    space: {
        backgroundColor: '#222633',

    },
    content: {
        flex: 1,
        width: '85%',
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
                <View style={styles.header}>
                    <View style={styles.headerTop}/>
                    <Header/>
                </View>
                <View style={styles.content}>
                    <View>
                        <FormattedText
                            defaultMessage={'Passez à la vitesse supérieure avec l’offre Standard'}
                            id='ksuite_free_banner_3'
                            style={styles.title}
                        />
                        <FormattedText
                            defaultMessage={'Donnez à votre équipe les outils essentiels pour collaborer efficacement au quotidien.'}
                            id='ksuite_free_banner'
                        />
                    </View>
                    <View style={styles.choices}>
                        <View style={styles.choiceItem}>
                            <BenefitIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'50 Go par utilisateur de stockage cloud kDrive et kChat'}
                                id='ksuite_free_banne'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <KchatIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'kChat : historique des messages illimités, plus de canaux, etc.'}
                                id='ksuite_free_banne'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <MailIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'Mail : stockage messagerie illimité, envoi programmé, etc.'}
                                id='ksuite_free_banne'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <EuriaIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'Euria : transcription des vidéos, création d’image, etc.'}
                                id='ksuite_free_banne'
                            />
                        </View>
                        <View style={styles.choiceItem}>
                            <PlusIcon style={styles.choiceIcon}/>
                            <FormattedText
                                defaultMessage={'Et bien plus encore !'}
                                id='ksuite_free_bann'
                            />
                        </View>
                    </View>
                    <View style={styles.evolve}>
                        <FormattedText
                            defaultMessage={'Pour faire évoluer votre offre, utilisez l’interface web.'}
                            id='ksuite_free_banne'
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.flowButtonContainer}
                        onPress={handleClose}
                    >
                        <Text style={styles.flowButtonText}>
                            <FormattedText
                                defaultMessage={'Fermer'}
                                id='ksuite_free_b'
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
            snapPoints={['10%', '90%']}
            contentStyle={{paddingHorizontal: 0}}
        />
    );
};

export default IKEvolve;
