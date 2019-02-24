import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import properties from './properties';
import Picker from './Picker';
import { Row, Column } from './Table';
import CGText from './CGText';
import Input from './Input';
import { Object } from 'core-js';


export class Field extends Component {
    constructor() {
        super();
        this.focus = this.focus.bind(this);
    }
    focus() {
        if (this.input) {

        }
    }
    render() {
        const props = this.props;
        let children = props.children;
        if (!children) {
            switch (props.type) {
                case "picker":
                    children = (<Picker
                        textStyle={{ ...styles.textStyle, fontSize: 16, ...props.inputStyle }}
                        items={props.items}
                        value={props.value}
                        onChange={props.onChange}
                        error={props.error}
                    />)
                    break;
                default:
                    children = (<Input
                        value={props.value}
                        onChange={props.onChange}
                        type={props.inputType}
                        style={props.inputStyle}
                        ref={ref => this.input = ref}
                        placeholder={props.placeholder}
                        error={props.error}
                        multiline={props.multiline}
                        editable={props.editable}
                        secureTextEntry={props.secureTextEntry}
                        autoCapitalize={props.autoCapitalize}
                    ></Input>
                    )
                    break;
            }
        }

        return (<View>
            <Row>
                <Column>
                    <CGText style={{ ...styles.loginTextStyle, fontSize: 16, ...props.labelStyle }}>{props.label}</CGText>
                </Column>
            </Row>
            <Row style={{ ...props.style }}>
                {children}
            </Row>
            <Row style={{ padding: 5 }} />
        </View>);
    }
}

//FORM
export default class Form extends Component {
    state = {}
    constructor() {
        super();
        this.count = 0;
        // this.refs = {};
    }
    willValidate(props) {
        return (props.required || props.validator)
    }

    cloneChildren(children, validate) {
        const result = {
            children: [],
            errors: [],
            status: true
        };
        children.forEach(child => {
            let grandChildren;
            if (child.props.children) {
                if (Array.isArray(child.props.children)) {
                    grandChildren = this.cloneChildren(child.props.children).children
                } else {
                    grandChildren = this.cloneChildren([child.props.children]).children;
                }
            }
            const refId = this.count++;
            const options = {
                key: refId
            };
            if (grandChildren) options.children = grandChildren;



            if (this.willValidate(child.props)) {
                const ref = React.createRef();
                this.refs[refId] = ref;

                options.value = this.props.children[0].props.value;

                options.ref = ref;
                options.refId = refId;
                options.error = null;
                if (validate) {
                    if (child.props.validator) {
                        //validate
                    } else if ((!child.props.value || child.props.value === "")) {
                        result.status = false;
                        options.error = `El campo es requerido`;
                        result.errors.push(child);
                    }
                }
            }
            const newChild = React.cloneElement(child, Object.assign({}, child.props, { options: options, oldValue: child.props.value }));
            result.children.push(newChild);
        });
        return result;
    }

    // findChildren(children) {
    //     let items = [];
    //     children.forEach(child => {
    //         const validate = false;
    //         if (this.willValidate(child.props)) {
    //             items.push(child);
    //         }
    //         if (child.props.children) {
    //             if (Array.isArray(child.props.children)) {
    //                 items = items.concat(this.findChildren(child.props.children))
    //             } else {
    //                 items = items.concat(this.findChildren([child.props.children]))
    //             }
    //         }
    //     });
    //     return items;
    // }
    validate() {
        const clones = this.cloneChildren(this.props.children, true)
        this.setState({
            children: clones.children
        });
        return {
            errors: clones.errors,
            status: clones.status
        }
        // const children = this.state.children;
        // const items = this.findChildren(children);

        // let result = {
        //     status: true,
        //     errors: []
        // };
        // items.forEach(item => {
        //     if (item.props.validator) {
        //         //validate
        //     } else if ((!item.props.value || item.props.value === "")) {
        //         result.status = false;
        //         item.props.error = `El campo es requerido`;
        //         result.errors.push(item);
        //     }
        // });
        // this.setState({ children });
        // return result;
    }
    componentWillMount() {
        const clones = this.cloneChildren(this.props.children);
        this.setState({
            children: clones.children
        })

    }
    render() {

        // const children = clones.children;
        return this.state.children;
    }
}

const styles = StyleSheet.create({
    ...properties.styles
})