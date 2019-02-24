import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
    let items;
    if (Array.isArray(props.items)) {
        if (Platform.OS === "android" && Array.isArray(props.items)) {
            items = [{ value: "", label: "Seleccionar..." }, ...props.items];
        } else {
            items = [...props.items];
        }


    } else {
        items = { ...items }
    }

    return (<Picker
        mode="dropdown"
        style={{ ...pickerStyle, ...props.style }}
        selectedValue={props.value}
        onValueChange={props.onChange}
        textStyle={{ ...styles.textStyle, ...props.textStyle }}
    >
        {Array.isArray(items) ?
            items.map(item => <Picker.Item key={item.value} label={item.label} value={item.value} />)
            :
            Object.keys(items).map(key => <Picker.Item key={key} label={items[key]} value={key} />)
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