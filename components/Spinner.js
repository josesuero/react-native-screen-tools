import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import properties from './properties'

export default (props) => {
    return <View style={{ borderWidth: 0, flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator size="large" color={properties.mainColor} />
    </View>
}