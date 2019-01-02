import React, { Component } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import properties from '../components/properties';
import Icon from '../components/Icon';
import { Row, Column } from '../components/Table';

export default class Search extends Component {
    state = {
        value: ''
    }
    render() {

        return (
            <Row style={{
                borderWidth: 1,
                borderColor: properties.borderColor,
                height: 30, width: "100%",
                // , borderTopRightRadius: 50, borderBottomRightRadius: 50,
                borderRadius: 10,
                backgroundColor: properties.mainColor
            }}>
                <Column style={{ backgroundColor: "white", flex: 0.02 }}>
                </Column>

                <Column style={{ backgroundColor: "white", borderWidth: 0, justifyContent: "center" }}>
                    <TextInput
                        value={this.props.value}
                        ref={this.props.textRef}
                        placeholder={this.props.placeholder}
                        onChangeText={this.props.onChange}
                        style={{ ...styles.textStyle }}
                    />
                </Column>
                <Column style={{ alignItems: "flex-end", flex: 0.06 }}>
                    <TouchableOpacity
                        onPress={this.props.onPress}
                    >
                        <View
                            style={{
                                backgroundColor: properties.mainColor, width: 40, height: 30,
                                justifyContent: 'center', alignItems: 'center',
                                ...this.props.iconContainerStyle
                            }}
                        >
                            <Icon type="material" name="search" size={30} color={this.props.iconColor || 'white'} />
                        </View>
                    </TouchableOpacity>
                </Column>
            </Row>
        );
    }
}

const styles = StyleSheet.create({
    ...properties.styles
});