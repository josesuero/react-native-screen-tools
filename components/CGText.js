import React from 'react';
import { Text, StyleSheet } from 'react-native';
import properties from './properties';
import { format } from './Functions';

export default (props) => {
    let children = props.children;
    if (props.format) {
        children = format(children, props.format);
    }
    return (<Text
        style={{ ...styles.textStyle, ...props.style }}
        onPress={props.onPress}
    >{children}</Text>);
};

const styles = StyleSheet.create({
    ...properties.styles
});