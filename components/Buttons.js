import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CGText from './CGText';
import properties from './properties';


const Button = (props) => {
    let buttonStyle = styles.buttonStyle;
    let buttonTextStyle = styles.buttonTextStyle;
    if (props.small) {
        buttonStyle = {
            ...buttonStyle,
            width: 50,
            height: 30
        }
        buttonTextStyle = {
            ...buttonTextStyle,
            fontSize: 10
        }
    } else if (props.medium) {
        buttonStyle = {
            ...buttonStyle,
            width: 100,
            height: 50
        }
        buttonTextStyle = {
            ...buttonTextStyle,
            fontSize: 20
        }
    };
    const textStyle = { ...buttonTextStyle, ...props.textStyle }

    return (<TouchableOpacity style={{
        ...buttonStyle,
        borderRadius: props.square ? 5 : buttonStyle.borderRadius,
        ...props.style,
    }}
        disabled={props.disabled}
        onPress={() => {
            if (!props.apiactive && props.onPress) {
                props.onPress();
            }
        }}>

        {!props.apiactive ?
            <CGText style={textStyle}>{props.children}</CGText>
            : <ActivityIndicator size="small" color={textStyle.color} />
        }

    </TouchableOpacity>);
};


export const TransparentButton = (props) => Button({
    ...props, style: {
        backgroundColor: "transparent",
        ...props.style
    }
});

export const SolidButton = (props) => Button({
    ...props, style: {
        backgroundColor: properties.mainColor,
        // borderColor: "#000",
        ...props.style
    },
    textStyle: {
        color: "#FFF",
        ...props.textStyle
    },
    square: true
});

export const Link = (props) => <CGText
    onPress={props.onPress}
    style={{
        ...styles.buttonTextStyle,
        color: "blue",
        fontSize: 15,
        ...props.style
    }}>{props.children}</CGText>

export default Button;

const styles = StyleSheet.create({
    ...properties.styles,
    "buttonStyle": {
        "backgroundColor": "#FFFFFF",
        "borderRadius": 30,
        "borderWidth": 1,
        "borderColor": "rgb(165,165,165)",
        "height": 35,
        "justifyContent": "center",
        "alignItems": "center"
    },
    "buttonTextStyle": {
        "color": "#000",
        "textAlign": "center",
        "fontSize": 18
    },

});