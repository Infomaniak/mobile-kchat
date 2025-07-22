// eslint-disable-next-line header/header
import React from 'react';
import {useIntl} from 'react-intl';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Emoji from '@components/emoji/emoji';
import {buttonBackgroundStyle} from '@utils/buttonStyles';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {showModal} from '@screens/navigation';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            flexDirection: 'column',
            gap: 20,
        },
        buttons: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        buttonOutline: {
            alignItems: 'flex-start',
            borderColor: theme.sidebarText,
            paddingVertical: 6,
            paddingHorizontal: 12,
        },
        text: {
            ...typography('Body', 200),
            color: theme.centerChannelColor,
        },
        boldText: {
            ...typography('Body', 200, 'SemiBold'),
            color: theme.centerChannelColor,
        },
    };
});

const IkWelcomeMessage = () => {
    const theme = useTheme();
    const style = getStyleSheet(theme);
    const intl = useIntl();

    const formatter = {
        b: (chunks: React.ReactNode) => <Text style={style.boldText}>{chunks}</Text>,
        emoji: (chunks: React.ReactNode) => <Emoji emojiName={Array.isArray(chunks) && typeof chunks[0] === 'string' ? chunks[0] : ''}/>,
    };

    const browseChannels = () => {
        const title = intl.formatMessage({id: 'browse_channels.title', defaultMessage: 'Browse channels'});
        const closeButton = CompassIcon.getImageSourceSync('close', 24, theme.sidebarHeaderTextColor);

        showModal(Screens.BROWSE_CHANNELS, title, {
            closeButton,
        });
    };

    const openDirectMessage = () => {
        const title = intl.formatMessage({id: 'infomaniak.post.welcome.action.send_message', defaultMessage: 'Write to someone'}, {emoji: () => ''});
        const closeButton = CompassIcon.getImageSourceSync('close', 24, theme.sidebarHeaderTextColor);

        showModal(Screens.CREATE_DIRECT_MESSAGE, title, {
            closeButton,
        });
    };

    return (
        <View style={style.container}>
            <View>
                <FormattedText
                    id='infomaniak.post.welcome.line1'
                    defaultMessage={'Hello! Happy to see you here and welcome <emoji>blush</emoji>'}
                    values={formatter}
                    style={style.text}
                />
                <FormattedText
                    id='infomaniak.post.welcome.line2'
                    defaultMessage={'I\'m here to answer your questions and send you reminders and notifications about your kSuite products when needed.'}
                    values={formatter}
                    style={style.text}
                />
                <FormattedText
                    id='infomaniak.post.welcome.line3'
                    defaultMessage={'<b>To get started</b>, here are some quick actions to explore kChat'}
                    values={formatter}
                    style={{...style.text, marginTop: 10, marginBottom: -2}}
                />
            </View>

            <View style={style.buttons}>
                <TouchableOpacity
                    style={[buttonBackgroundStyle(theme, 'm', 'secondary'), style.buttonOutline]}
                    onPress={openDirectMessage}
                >
                    <FormattedText
                        id='infomaniak.post.welcome.action.send_message'
                        defaultMessage='<emoji>writing_hand</emoji> Write to someone'
                        values={formatter}
                        style={style.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[buttonBackgroundStyle(theme, 'm', 'secondary'), style.buttonOutline]}
                    onPress={browseChannels}
                >
                    <FormattedText
                        id='infomaniak.post.welcome.action.browse_channels'
                        defaultMessage='<emoji>mag</emoji> Browse channels'
                        values={formatter}
                        style={style.text}
                    />
                </TouchableOpacity>
            </View>

            <View>
                <FormattedText
                    id='infomaniak.post.welcome.line4'
                    defaultMessage={'<emoji>arrow_down</emoji> Or <b>ask me a question</b> directly here!'}
                    values={formatter}
                    style={style.text}
                />
            </View>
        </View>
    );
};

export default React.memo(IkWelcomeMessage);
