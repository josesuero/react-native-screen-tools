import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Stripe from 'react-native-stripe-api';

import Icon from './Icon';
import { Row, Column } from './Table';
import properties from './properties';


export default class Input extends Component {
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
                    placeholderTextColor="grey"
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
export class CreditCard extends React.Component {
    state = {
        ready: false,
        stripeError: false,
        numberError: false,
        expError: false,
        cvcError: false,
        error: "",
        number: "",
        exp: "",
        cvc: "",
        token: {},
    }
    constructor() {
        super();
        this.stripe = new Stripe(properties.stripeApiKey);
    }

    componentWillMount() {
        if (this.props.value) {
            this.setState({ ...this.props.value });
        }
    }

    setError(code, order) {
        let { error, stripeError, numberError,
            expError,
            cvcError,
        } = this.state;
        switch (code) {
            case "incorrect_number":
                stripeError = true;
                error = "Número de tarjeta inválido";
                break;
            case "EXP_NOT_VALID":
                if (this.state.exp.length > 0) {
                    error = "Fecha expiración inválida";
                }
                expError = true;
                this.exp.getElement().focus();
                break;
        }
        this.setState({
            stripeError,
            numberError,
            expError,
            cvcError,
            error
        });
    }

    numberIsValid() {
        return this.number.isValid() && this.state.number.length > 0
    }

    getToken() {
        const exp = this.state.exp.split("/");
        this.stripe.createToken({ number: this.state.number, exp_month: exp[0], exp_year: exp[1], cvc: this.state.cvc }).then(token => {
            if (token.error) {
                this.setError(token.error.code, 5);
            } else {
                this.setState({
                    ready: true,
                    token,
                    stripeError: false
                }, () => {
                    this.onChange();
                });
            }
        });
    }

    verify() {
        if (!this.numberIsValid()) {
            this.number.getElement().focus();
        } else if (!this.exp.isValid()) {
            this.setError("EXP_NOT_VALID", 1);
        } else if (!this.cvc.isValid()) {
            this.cvc.getElement().focus();
        } else {
            this.getToken();
        }
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    }
    render() {
        let borderColor = properties.borderColor;
        if (this.props.error) {
            borderColor = "red"
        }

        let { stripeError, numberError, expError, cvcError, error } = this.state;
        if (!numberError && !expError && !cvcError && !stripeError) {
            error = "";
        }
        return (<Column style={{
            width: "100%",
        }}>
            <Row style={{
                "borderWidth": 1,
                "borderColor": borderColor,
                "borderRadius": 5,
                "backgroundColor": "white",
                paddingTop: 5,
                paddingRight: 10,
                paddingBottom: 5,
                paddingLeft: 0,
                ...this.props.style
            }}>
                <Column style={{ flex: 2 }}>
                    <TextInputMask
                        ref={(ref) => this.number = ref}
                        type={'credit-card'}
                        keyboardType="number-pad"
                        placeholder={'Numero de tarjeta'}
                        options={{
                            obfuscated: this.state.ready
                        }}
                        value={this.state.number}
                        onChangeText={(item) => {
                            this.setState({ number: this.number.getRawValue().join(""), ready: false }, () => {
                                this.onChange();
                                if (this.numberIsValid()) {
                                    if (!this.exp.isValid()) {
                                        this.setError("EXP_NOT_VALID", 2);
                                    } else if (!this.cvc.isValid()) {
                                        this.cvc.getElement().focus();
                                    } else {
                                        this.verify();
                                    }
                                }
                            }
                            );
                        }}
                    />
                </Column>
                <Column style={{ flex: 0.5 }}>
                    <TextInputMask
                        ref={(ref) => this.exp = ref}
                        type={'custom'}
                        keyboardType="number-pad"
                        placeholder="MM/AA"
                        value={this.state.exp}
                        onChangeText={(item) => {
                            this.setState({ exp: this.exp.getRawValue(), ready: false }, () => {
                                this.onChange();
                                if (this.exp.isValid()) {
                                    this.setState({ expError: false }, () => {
                                        if (!this.cvc.isValid()) {
                                            this.cvc.getElement().focus();
                                        } else if (!this.numberIsValid()) {
                                            this.number.getElement().focus();
                                        } else {
                                            this.verify();
                                        }
                                    })
                                }
                            });
                        }}
                        options={{
                            validator: ((value, settings) => {
                                const parts = value.split('/');
                                const result = (parts.length > 1 && parseInt(parts[0]) < 13 && parseInt(parts[1]) > 17);
                                if (!result && value.length === 5) {
                                    this.setError("EXP_NOT_VALID", 3);
                                }
                                return result;
                            }).bind(this),
                            mask: '99/99'
                        }}
                    />

                </Column>
                <Column style={{ flex: 0.5 }}>
                    <TextInputMask
                        ref={(ref) => this.cvc = ref}
                        type={'custom'}
                        keyboardType="number-pad"
                        placeholder="CVC"
                        value={this.state.cvc}
                        onChangeText={(item) => {
                            this.setState({ cvc: this.cvc.getRawValue(), ready: false });
                            this.onChange();
                            if (this.cvc.isValid()) {
                                if (!this.numberIsValid()) {
                                    this.number.getElement().focus();
                                } else if (!this.exp.isValid()) {
                                    this.setError("EXP_NOT_VALID", 4);
                                } else {
                                    this.verify();
                                }
                            }
                        }}
                        options={{
                            validator: function (value, settings) {
                                return value.length === 3
                            },
                            mask: '999'
                        }}
                    />
                </Column>
            </Row>
            <Row style={{ justifyContent: "center" }}>
                <Text style={{
                    color: "red",
                    fontSize: 10,
                }}>{error}</Text>
            </Row>
        </Column>)
    }
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
    },
    textArea: {
        borderColor: properties.borderColor,
        padding: 5,
        height: 75,
        flex: 1,
        justifyContent: "flex-start"
    }
});


