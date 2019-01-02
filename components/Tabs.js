import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';

import { Row, Column } from './Table';
import Button, { Link } from './Buttons';
import properties from './properties';

export default class Tabs extends Component {
    state = {
        current: 0,
    }

    renderButtons(sections) {
        return (<View>
            <Row style={{
                marginBottom: 20
            }}>
                {sections.map((section, i) => (<Column key={section}
                    style={{ padding: 3 }
                        // this.state.current === i ? styles.columnSelected : styles.column
                    }
                >
                    <Button
                        style={this.state.current === i ? styles.buttonSelected : styles.button}
                        textStyle={this.state.current === i ? styles.buttonTextSelected : styles.buttonText}
                        onPress={() => {
                            this.setState({ current: i });
                            if (this.props.onChange) {
                                this.props.onChange(this.props.sections[i]);
                            }
                        }}
                    >{section}</Button>
                </Column>)
                )}
            </Row>
            {this.props.renderSection(this.state.current)}
        </View>);

    }

    renderTabs(sections) {
        return (<View>
            <Row style={{
                marginBottom: 20
            }}>
                {sections.map((section, i) => (<Column key={section}
                    style={this.state.current === i ? styles.columnSelected : styles.column}
                >
                    <Link
                        style={this.state.current === i ? styles.menuSelected : styles.menu}
                        onPress={() => {
                            this.setState({ current: i });
                            if (this.props.onChange) {
                                this.props.onChange(this.props.sections[i]);
                            }
                        }}
                    >{section}</Link>
                </Column>)
                )}
            </Row>
            {this.props.renderSection(this.state.current)}
        </View>);
    }

    render() {
        const sections = this.props.sections;
        if (this.props.buttons) {
            return this.renderButtons(sections);
        }

        return this.renderTabs(sections);
    }
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