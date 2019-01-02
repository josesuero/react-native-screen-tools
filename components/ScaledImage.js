import React, { Component, } from "react";
import { Image } from "react-native";
import PropTypes from 'prop-types'

export default class ScaledImage extends Component {
    state = {}

    componentWillMount() {
        const { uri, width, height } = this.props;
        this.setState({ source: { uri }, width: width || height, height: height || width });
    }

    render() {
        return (
            <Image
                source={this.state.source}
                onLoad={(value) => {
                    const { height, width } = value.nativeEvent.source;
                    if (this.props.width && !this.props.height) {
                        this.setState({
                            width: this.props.width,
                            height: height * (this.props.width / width)
                        });
                    } else if (!this.props.width && this.props.height) {
                        this.setState({
                            width: width * (this.props.height / height),
                            height: this.props.height
                        });
                    } else {
                        this.setState({ width: width, height: height });
                    }

                }}
                style={{ height: this.state.height, width: this.state.width, ...this.props.style }}
            />
        );
    }
}

ScaledImage.propTypes = {
    uri: PropTypes.string.isRequired,
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
};