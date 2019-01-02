import React from 'react';
import { StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box'

import properties from '../components/properties';

export default (props) => {
    let borderColor = properties.borderColor;
    if (props.error) {
        borderColor = "red"
    }
    return (<CheckBox
        style={{ flex: 1, padding: 10 }}
        checkBoxColor={borderColor}
        onClick={props.onChange}
        isChecked={props.value}
        rightText={props.label}
    />);
}

const style = StyleSheet.create({
    ...properties.style
});