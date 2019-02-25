import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Stripe from 'react-native-stripe-api';

import PropTypes from 'prop-types';

import Icon from './Icon';
import { Row, Column } from './Table';
import properties from './properties';


export default class Input extends Component {
    currentOnChange = (value) => {
        this.props.onChange(value)
    }
    onChange(value) {

    }

    render() {
        let multiline = false;
        let { inputStyle, inputBoxStyle } = styles;
        if (this.props.multiline) {
            multiline = true;
            inputStyle = { ...styles.textArea }
            inputBoxStyle = Object.assign({}, inputBoxStyle, styles.textArea);
        }
        if (this.props.error) {
            inputBoxStyle = {
                ...inputBoxStyle,
                borderWidth: 2,
                borderColor: "red"
            };
        }
        return (
            <View
                style={{ ...inputBoxStyle, ...this.props.containerStyle }}
            >
                <TextInput
                    style={{ ...inputStyle, ...this.props.style }}
                    underlineColorAndroid="transparent"
                    placeholder={this.props.placeholder}
                    placeholderTextColor="#CCC"
                    numberOfLines={10}
                    value={this.props.value}
                    multiline={multiline}
                    secureTextEntry={this.props.secureTextEntry}
                    onChangeText={this.props.onChange}
                    keyboardType={this.props.type}
                    autoCapitalize={this.props.autoCapitalize}
                    ref={this.props.inputRef}
                    editable={this.props.editable}
                    key={this.props.inputKey}
                    blurOnSubmit={this.props.blurOnSubmit}
                ></TextInput>
                {this.props.icon ?
                    <Icon
                        type={this.props.iconType}
                        style={this.props.iconStyle}
                        name={this.props.icon}
                        size={this.props.iconSize || 22}
                        color={properties.mainColor}
                    /> : <View />}
            </View>
        );
    };
}

Input.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,

    multiline: PropTypes.bool,
    placeholder: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    type: PropTypes.string,
    autoCapitalize: PropTypes.bool,
    inputRef: PropTypes.func,
    editable: PropTypes.bool,
    blurOnSubmit: PropTypes.bool,

    containerStyle: PropTypes.object,
    style: PropTypes.object,

    error: PropTypes.bool,

    icon: PropTypes.string,
    iconType: PropTypes.string,
    iconStyle: PropTypes.object,
    iconSize: PropTypes.number,
}

const styles = StyleSheet.create({
    ...properties.styles,
    "inputBoxStyle": {
        "flexDirection": "row",
        alignItems: "center",
        "flex": 2,
        "height": 44,
        "borderWidth": 1,
        "borderColor": properties.borderColor,
        "borderRadius": 5,
        "backgroundColor": "white",
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 5,

    },
    "inputStyle": {
        "backgroundColor": "white",
        "flex": 1,
        "height": 35,
        "backgroundColor": "white",
        "padding": 0,
    },
    textArea: {
        borderColor: properties.borderColor,
        padding: 5,
        height: 75,
        flex: 1,
        justifyContent: "flex-start",
        textAlignVertical: "top",
    }
});


