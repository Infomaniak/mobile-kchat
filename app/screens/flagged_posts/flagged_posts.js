// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {
    Keyboard,
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {isDateLine, getDateForDateLine} from '@mm-redux/utils/post_list';

import ChannelLoader from 'app/components/channel_loader';
import DateHeader from 'app/components/post_list/date_header';
import FailedNetworkAction from 'app/components/failed_network_action';
import NoResults from 'app/components/no_results';
import PostSeparator from 'app/components/post_separator';
import StatusBar from 'app/components/status_bar';
import mattermostManaged from 'app/mattermost_managed';
import SearchResultPost from 'app/screens/search/search_result_post';
import ChannelDisplayName from 'app/screens/search/channel_display_name';
import {changeOpacity} from 'app/utils/theme';
import {
    goToScreen,
    showModalOverCurrentContext,
    showSearchModal,
    dismissModal,
} from 'app/actions/navigation';

export default class FlaggedPosts extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            clearSearch: PropTypes.func.isRequired,
            loadChannelsByTeamName: PropTypes.func.isRequired,
            loadThreadIfNecessary: PropTypes.func.isRequired,
            getFlaggedPosts: PropTypes.func.isRequired,
            selectFocusedPostId: PropTypes.func.isRequired,
            selectPost: PropTypes.func.isRequired,
        }).isRequired,
        postIds: PropTypes.array,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        postIds: [],
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        props.actions.clearSearch();

        this.state = {
            didFail: false,
            isLoading: false,
        };
    }

    getFlaggedPosts = async () => {
        const {actions} = this.props;
        this.setState({isLoading: true});
        const {error} = await actions.getFlaggedPosts();

        this.setState({
            isLoading: false,
            didFail: Boolean(error),
        });
    }

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);

        this.getFlaggedPosts();
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'close-settings') {
            dismissModal();
        }
    }

    setListRef = (ref) => {
        this.listRef = ref;
    }

    goToThread = (post) => {
        const {actions} = this.props;
        const channelId = post.channel_id;
        const rootId = (post.root_id || post.id);
        const screen = 'Thread';
        const title = '';
        const passProps = {
            channelId,
            rootId,
        };

        Keyboard.dismiss();
        actions.loadThreadIfNecessary(rootId);
        actions.selectPost(rootId);
        goToScreen(screen, title, passProps);
    };

    handleClosePermalink = () => {
        const {actions} = this.props;
        actions.selectFocusedPostId('');
        this.showingPermalink = false;
    };

    handlePermalinkPress = (postId, teamName) => {
        this.props.actions.loadChannelsByTeamName(teamName);
        this.showPermalinkView(postId, true);
    };

    handleHashtagPress = async (hashtag) => {
        await dismissModal();
        showSearchModal('#' + hashtag);
    };

    keyExtractor = (item) => item;

    previewPost = (post) => {
        Keyboard.dismiss();

        this.showPermalinkView(post.id, false);
    };

    renderEmpty = () => {
        const {formatMessage} = this.context.intl;
        const {theme} = this.props;

        return (
            <NoResults
                description={formatMessage({
                    id: 'mobile.flagged_posts.empty_description',
                    defaultMessage: 'Saved messages are only visible to you. Mark messages for follow-up or save something for later by long-pressing a message and choosing Save from the menu.',
                })}
                iconName='ios-bookmark-outline'
                title={formatMessage({id: 'mobile.flagged_posts.empty_title', defaultMessage: 'No Saved messages yet'})}
                theme={theme}
            />
        );
    };

    renderPost = ({item, index}) => {
        const {postIds, theme} = this.props;

        if (isDateLine(item)) {
            return (
                <DateHeader
                    date={getDateForDateLine(item)}
                    index={index}
                />
            );
        }

        let separator;
        const nextPost = postIds[index + 1];
        if (nextPost && !isDateLine(nextPost)) {
            separator = <PostSeparator theme={theme}/>;
        }

        return (
            <View>
                <ChannelDisplayName postId={item}/>
                <SearchResultPost
                    postId={item}
                    previewPost={this.previewPost}
                    highlightPinnedOrFlagged={false}
                    goToThread={this.goToThread}
                    onHashtagPress={this.handleHashtagPress}
                    onPermalinkPress={this.handlePermalinkPress}
                    managedConfig={mattermostManaged.getCachedConfig()}
                    showFullDate={false}
                    skipFlaggedHeader={true}
                    skipPinnedHeader={true}
                />
                {separator}
            </View>
        );
    };

    showPermalinkView = (postId, isPermalink) => {
        const {actions} = this.props;

        actions.selectFocusedPostId(postId);

        if (!this.showingPermalink) {
            const screen = 'Permalink';
            const passProps = {
                isPermalink,
                onClose: this.handleClosePermalink,
            };
            const options = {
                layout: {
                    backgroundColor: changeOpacity('#000', 0.2),
                },
            };

            this.showingPermalink = true;
            showModalOverCurrentContext(screen, passProps, options);
        }
    };

    retry = () => {
        this.getFlaggedPosts();
    };

    render() {
        const {postIds, theme} = this.props;
        const {didFail, isLoading} = this.state;

        let component;
        if (didFail) {
            component = (
                <FailedNetworkAction
                    onRetry={this.retry}
                    theme={theme}
                />
            );
        } else if (isLoading) {
            component = (
                <ChannelLoader channelIsLoading={true}/>
            );
        } else if (postIds.length) {
            component = (
                <FlatList
                    ref={this.setListRef}
                    contentContainerStyle={style.sectionList}
                    data={postIds}
                    keyExtractor={this.keyExtractor}
                    keyboardShouldPersistTaps='always'
                    keyboardDismissMode='interactive'
                    renderItem={this.renderPost}
                />
            );
        } else {
            component = this.renderEmpty();
        }

        return (
            <View style={style.container}>
                <StatusBar/>
                {component}
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
});
