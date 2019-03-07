import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

import PropTypes from 'prop-types';

import { Row, Column } from './Table';
import Button, { Link } from './Buttons';
import properties from './properties';

export default class Tabs extends Component {
    getStyle(type, current, i) {
        switch (type) {
            case "column":
                if (this.props.buttons) {
                    return { padding: 3 }
                } else {
                    return current === i ? styles.columnSelected : styles.column
                }
            case "tab":
                break;
            case "button":
                break;
            case "buttonText":
                break;

        }
    }

    onChange(i) {
        if (this.props.onChange) {
            this.props.onChange(i, this.props.sections[i]);
        }
    }

    render() {
        const { sections, value } = this.props;
        current = this.props.value;
        return (<View>
            <Row style={{
                marginBottom: 10
            }}>
                {sections.map((section, i) => (<Column key={section}
                    style={this.getStyle("column", current, i)}
                >
                    {this.props.buttons ?
                        <Button
                            style={current === i ? { ...styles.buttonSelected, ...this.props.buttonStyle, ...this.props.selectedButtonStyle } : { ...styles.button, ...this.props.buttonStyle }}
                            textStyle={current === i ? { ...styles.buttonTextSelected, ...this.props.textStyle, ...this.props.selectedTextStyle } : { ...styles.buttonText, ...this.props.textStyle }}
                            onPress={() => this.onChange(i)}
                        >{section}</Button>
                        :
                        <Link
                            style={current === i ? styles.menuSelected : styles.menu}
                            onPress={() => this.onChange(i)}
                        >{section}</Link>
                    }
                </Column>)
                )}
            </Row>
            {this.props.renderSection ? this.props.renderSection(current) : null}
        </View >);
    }
}

Tabs.propTypes = {
    renderSection: PropTypes.func,
    sections: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.number.isRequired,
    initial: PropTypes.number,
}

const styles = StyleSheet.create({
    menu: {
        color: "#999999",
    },
    menuSelected: {
        color: properties.mainColor,
    },
    column: {
        borderBottomWidth: 0,
    },
    columnSelected: {
        borderBottomWidth: 2,
        borderBottomColor: properties.mainColor
    },
    buttonSelected: {
        backgroundColor: properties.mainColor
    },
    button: {
        backgroundColor: "#6666FF",
    },
    buttonTextSelected: {
        fontSize: 14,
        color: "#FFFFFF",
    },
    buttonText: {
        fontSize: 14
    },
});