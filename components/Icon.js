import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

import properties from './properties';

export default (props) => {
    let iconType = props.type || "fa";
    let IconObj;
    switch (iconType) {
        case "ion":
            IconObj = IonIcon
            break;
        case "material":
            IconObj = MatIcon
            break;
        case "fa":
        default:
            IconObj = Icon
            break;
    }

    return (<IconObj
        solid={props.solid || true}
        style={props.style}
        name={props.name}
        size={props.size || 22}
        color={props.color || properties.mainColor}
    />);

}
