import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from 'react-native-picker-dropdown';

export default (props) => {
    if (!props.items) {
        return <View />
    }
    let { pickerStyle } = styles;
    if (props.error) {
        pickerStyle = {
            ...pickerStyle,
            borderWidth: 2,
            borderColor: "red"
        };
    }

    return (<Picker
        mode="dropdown"
        style={{ ...pickerStyle, ...props.style }}
        selectedValue={props.value}
        onValueChange={props.onChange}
        textStyle={{ ...styles.textStyle, ...props.textStyle }}
    >
        {Array.isArray(props.items) ?
            props.items.map(item => <Picker.Item key={item.value} label={item.label} value={item.value} />)
            :
            Object.keys(props.items).map(key => <Picker.Item key={key} label={props.items[key]} value={key} />)
        }
    </Picker>);
}

const styles = StyleSheet.create({
    pickerStyle: {
        "flex": 1,
        "height": 40,
        "textAlign": "center",
        "borderWidth": 1,
        "borderColor": "rgb(165,165,165)",
        "borderRadius": 5,
    }
})