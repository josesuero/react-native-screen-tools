import React from 'react';
import { View, StyleSheet } from 'react-native';
import CGText from './CGText';
import properties from './properties';

export const Table = (props) => {
    return (<View
        style={{ ...styles.tableStyle, ...props.style }}
    >{props.children}</View>);
};

export const Row = (props) => {
    return (<View
        style={{ ...styles.tableRowStyle, ...props.style }}
    >{props.children}</View>);
};

export const Column = (props) => {
    let children = props.children;
    let style = 'tableDataStyle';
    if (props.header || props.data) {
        if (props.header && props.data) {
            throw new Error("Column can't be both header and data");
        }
        if (props.header) {
            style = "tableHeaderStyle"
        }
        children = <CGText style={Object.assign({}, styles[style], props.textStyle)} format={props.format}>{props.children}</CGText>
    }
    return (<View
        style={{ ...styles.tableColumnStyle, ...props.style }}
        onLayout={props.onLayout}
    >{children}</View>)
}

const styles = StyleSheet.create({
    ...properties.styles,
    "tableStyle": {
        "borderWidth": 0,
        "borderRadius": 10,
        "padding": 0,
        "margin": 0
    },
    "tableRowStyle": {
        "flexDirection": "row",
        "overflow": "hidden",
        "padding": 0,
    },
    "tableColumnStyle": {
        "flexDirection": "column",
        "flex": 1
    },
    "tableHeaderStyle": {
        "fontWeight": "bold",
        fontSize: 16
    },
    "tableDataStyle": {
        "fontWeight": "normal",
        fontSize: 16
    }
});