// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {LinearGradient} from 'expo-linear-gradient';
import React, {useRef, useState, type ReactNode} from 'react';
import {useIntl} from 'react-intl';
import {Dimensions, type EventSubscription, type LayoutChangeEvent, Platform, type ScaledSize, ScrollView, type StyleProp, TouchableOpacity, View, type ViewStyle} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {CELL_MAX_WIDTH, CELL_MIN_WIDTH} from '@components/markdown/markdown_table_cell';
import {Screens, Device} from '@constants';
import useDidMount from '@hooks/did_mount';
import {usePreventDoubleTap} from '@hooks/utils';
import {goToScreen} from '@screens/navigation';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

const MAX_HEIGHT = 300;
const MAX_PREVIEW_COLUMNS = 5;

type MarkdownTableState = {
    cellWidth: number;
    containerWidth: number;
    contentHeight: number;
    maxPreviewColumns: number;
}

type MarkdownTableInputProps = {
    children: ReactNode;
    numColumns: number;
    theme: Theme;
}

interface TableRowProps {
    children: ReactNode;
    [key: string]: unknown;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            maxHeight: MAX_HEIGHT,
        },
        expandButton: {
            height: 34,
            width: 34,
        },
        iconContainer: {
            maxWidth: '100%',
            alignItems: 'flex-end',
            paddingTop: 8,
            paddingBottom: 4,
            ...Platform.select({
                ios: {
                    paddingRight: 14,
                },
            }),
        },
        iconButton: {
            backgroundColor: theme.centerChannelBg,
            marginTop: -32,
            marginRight: -6,
            borderWidth: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
            width: 34,
            height: 34,
        },
        icon: {
            fontSize: 14,
            color: theme.linkColor,
            ...Platform.select({
                ios: {
                    fontSize: 13,
                },
            }),
        },
        displayFlex: {
            flex: 1,
        },
        table: {
            width: '100%',
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
            borderWidth: 1,
        },
        tablePadding: {
            paddingRight: 10,
        },
        moreBelow: {
            bottom: Platform.select({
                ios: 34,
                android: 33.75,
            }),
            height: 20,
            position: 'absolute',
            left: 0,
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
        },
        moreRight: {
            maxHeight: MAX_HEIGHT,
            position: 'absolute',
            top: 0,
            width: 20,
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
            borderRightWidth: 1,
        },
    };
});

const MarkdownTable = ({children, numColumns, theme}: MarkdownTableInputProps) => {
    const intl = useIntl();
    const [state, setState] = useState<MarkdownTableState>({
        containerWidth: 0,
        contentHeight: 0,
        cellWidth: 0,
        maxPreviewColumns: 0,
    });
    const rowsSlicedRef = useRef<boolean>(false);
    const colsSlicedRef = useRef<boolean>(false);
    const dimensionsListenerRef = useRef<EventSubscription | undefined>(undefined);

    useDidMount(() => {
        dimensionsListenerRef.current = Dimensions.addEventListener('change', setMaxPreviewColumns);

        const window = Dimensions.get('window');
        setMaxPreviewColumns({window});
    });

    useDidMount(() => {
        return () => {
            dimensionsListenerRef.current?.remove();
        };
    });

    const setMaxPreviewColumns = ({window}: {window: ScaledSize}) => {
        const maxPreviewColumns = Math.floor(window.width / CELL_MIN_WIDTH);
        setState((prev) => ({...prev, maxPreviewColumns}));
    };

    const getTableWidth = (isFullView = false) => {
        const maxPreviewColumns = state.maxPreviewColumns || MAX_PREVIEW_COLUMNS;
        const columns = Math.min(numColumns, maxPreviewColumns);

        return (isFullView || columns === 1) ? columns * CELL_MAX_WIDTH : columns * CELL_MIN_WIDTH;
    };

    const handlePress = usePreventDoubleTap(() => {
        const screen = Screens.TABLE;
        const title = intl.formatMessage({
            id: 'mobile.routes.table',
            defaultMessage: 'Table',
        });
        const passProps = {
            renderAsFlex: shouldRenderAsFlex(true),
            renderRows,
            width: getTableWidth(true),
        };

        goToScreen(screen, title, passProps);
    });

    const handleContainerLayout = (e: LayoutChangeEvent) => {
        // Read the event synchronously: React may run the state updater after
        // the synthetic event has been nullified (RN 0.83 / Fabric).
        const {width} = e.nativeEvent.layout;
        setState((prev) => ({
            ...prev,
            containerWidth: width,
        }));
    };

    const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
        setState((prev) => ({
            ...prev,
            contentHeight,
        }));
    };

    const renderPreviewRows = (isFullView = false) => {
        return renderRows(isFullView, true);
    };

    const shouldRenderAsFlex = (isFullView = false) => {
        const {height, width} = Dimensions.get('window');
        const isLandscape = width > height;

        // render as flex in the channel screen, only for mobile phones on the portrait mode,
        // and if tables have 2 ~ 4 columns
        if (!isFullView && numColumns > 1 && numColumns < 4 && !Device.IS_TABLET) {
            return true;
        }

        // render a 4 column table as flex when in landscape mode only
        // otherwise it should expand beyond the device's full width
        if (!isFullView && isLandscape && numColumns === 4) {
            return true;
        }

        // render as flex in full table screen, only for mobile phones on portrait mode,
        // and if tables have 3 or 4 columns
        if (isFullView && numColumns >= 3 && numColumns <= 4 && !Device.IS_TABLET) {
            return true;
        }

        return false;
    };

    const getTableStyle = (isFullView: boolean) => {
        const style = getStyleSheet(theme);
        const tableStyle: StyleProp<ViewStyle> = [style.table];

        const renderAsFlex = shouldRenderAsFlex(isFullView);
        if (renderAsFlex) {
            tableStyle.push(style.displayFlex);
            return tableStyle;
        }

        tableStyle.push({width: getTableWidth(isFullView)});
        return tableStyle;
    };

    const renderRows = (isFullView = false, isPreview = false) => {
        const tableStyle = getTableStyle(isFullView);

        let rows = React.Children.toArray(children) as Array<React.ReactElement<TableRowProps>>;

        if (!rows.length) {
            return null;
        }

        if (isPreview) {
            const {maxPreviewColumns} = state;
            const prevRowLength = rows.length;

            const prevColLength = React.Children.toArray(rows[0].props.children).length;

            rows = rows.slice(0, maxPreviewColumns).map((row) => {
                const rowProps = row.props as TableRowProps;
                const childElements = React.Children.toArray(rowProps.children).slice(0, maxPreviewColumns);
                return {
                    ...row,
                    props: {
                        ...rowProps,
                        children: childElements,
                    },
                };
            });

            if (!rows.length) {
                return null;
            }

            rowsSlicedRef.current = prevRowLength > rows.length;
            colsSlicedRef.current = prevColLength > React.Children.toArray((rows[0].props as TableRowProps).children).length;
        }

        // Add an extra prop to the last row of the table so that it knows not to render a bottom border
        // since the container should be rendering that
        rows[rows.length - 1] = React.cloneElement(rows[rows.length - 1], {
            isLastRow: true,
        });

        // Add an extra prop to the first row of the table so that it can have a different background color
        rows[0] = React.cloneElement(rows[0], {
            isFirstRow: true,
        });

        return (
            <View style={tableStyle}>
                {rows}
            </View>
        );
    };

    const {containerWidth, contentHeight} = state;
    const style = getStyleSheet(theme);
    const tableWidth = getTableWidth();
    const renderAsFlex = shouldRenderAsFlex();
    const previewRows = renderPreviewRows();

    let leftOffset;
    if (renderAsFlex || tableWidth > containerWidth) {
        leftOffset = containerWidth - 20;
    } else {
        leftOffset = tableWidth - 20;
    }
    let expandButtonOffset = leftOffset;
    if (Platform.OS === 'android') {
        expandButtonOffset -= 10;
    }

    // Renders when the columns were sliced, or the table width exceeds the container,
    // or if the columns exceed maximum allowed for previews
    let moreRight = null;
    if (colsSlicedRef.current ||
        (containerWidth && tableWidth > containerWidth && !renderAsFlex) ||
        (numColumns > MAX_PREVIEW_COLUMNS)) {
        moreRight = (
            <LinearGradient
                colors={[
                    changeOpacity(theme.centerChannelColor, 0.0),
                    changeOpacity(theme.centerChannelColor, 0.1),
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[style.moreRight, {height: contentHeight, left: leftOffset}]}
            />
        );
    }

    let moreBelow = null;
    if (rowsSlicedRef.current || contentHeight > MAX_HEIGHT) {
        const width = renderAsFlex ? '100%' : Math.min(tableWidth, containerWidth);

        moreBelow = (
            <LinearGradient
                colors={[
                    changeOpacity(theme.centerChannelColor, 0.0),
                    changeOpacity(theme.centerChannelColor, 0.1),
                ]}
                style={[style.moreBelow, {width}]}
            />
        );
    }

    let expandButton = null;
    if (expandButtonOffset > 0) {
        expandButton = (
            <TouchableOpacity
                onPress={handlePress}
                style={[style.expandButton, {left: expandButtonOffset}]}
                testID='markdown_table.expand.button'
            >
                <View style={[style.iconContainer, {width: getTableWidth()}]}>
                    <View style={style.iconButton}>
                        <CompassIcon
                            name='arrow-expand'
                            style={style.icon}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={style.tablePadding}
            onPress={handlePress}
            testID='markdown_table'
        >
            <ScrollView
                onContentSizeChange={handleContentSizeChange}
                onLayout={handleContainerLayout}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                style={style.container}
            >
                {previewRows}
            </ScrollView>
            {moreRight}
            {moreBelow}
            {expandButton}
        </TouchableOpacity>
    );
};

export default MarkdownTable;
