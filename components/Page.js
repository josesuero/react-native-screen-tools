import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CGText from './CGText';
import properties from './properties';

export default class Page extends Component {
    state = {
        refreshing: false,
    }

    _onRefresh = () => {
        if (this.props.refresh) {
            this.setState({ refreshing: true });
            this.props.refresh().then(() => {
                this.setState({ refreshing: false });
            })
        }
    }

    render() {
        return (<KeyboardAwareScrollView
            style={{
                flex: 1, backgroundColor: "white",
                ...this.props.scrollStyle
            }}
            innerRef={this.props.scrollRef}
            scrollEventThrottle={this.props.scrollEventThrottle || 50}
            onScroll={this.props.onScroll}
            scrollEnabled={this.props.scrollEnabled}

            enableOnAndroid

            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
            }
            contentContainerStyle={Object.assign({}, { flexGrow: 1, backgroundColor: 'white' })}
        >
            <View style={{ margin: 5, ...this.props.style }}>
                {this.props.title ? <CGText style={styles.titleStyle}>{this.props.title}</CGText> : null}

                {this.props.children}
            </View>
        </KeyboardAwareScrollView>);

    }
}

const styles = StyleSheet.create({
    ...properties.styles
});