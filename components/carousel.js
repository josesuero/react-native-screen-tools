import React, { Component } from 'react';
import { View, Dimensions, Image } from 'react-native';
import SnapCarousel from 'react-native-snap-carousel';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';


// import CustomComponent from '...'
// import data from '...'
import picture from './images/picture.png';

export default class Carousel extends Component {
    state = {
        currentIndex: 0,
        imageWidth: 0,
        itemStyle: {},
    };
    componentWillMount() {
        let currentIndex = 0
        const { width } = Dimensions.get('window');
        const imageWidth = this.props.imageWidth || width;
        const contentOffset = 0;//(width - imageWidth - 75) / 2;

        if (this.props.index) {
            currentIndex = this.props.index;
        }

        this.setState({ currentIndex, imageWidth, contentOffset, width });
    }

    renderItem(value) {
        const { index, item } = value
        let image = picture;
        if (item.src) {
            image = { uri: item.src }
        }
        let imageWidth = this.state.imageWidth - 25;
        if (this.props.selectedWidth && (index === this.state.currentIndex)) {
            imageWidth = this.props.selectedWidth;
        }
        return (
            <View style={{ padding: 5, margin: 10, }}>
                <Image source={image} style={{ width: imageWidth, height: imageWidth }} />


                {/*<Image
                    source={image}
                    onLoad={(value) => {
                        console.log('loaded');
                        const { height: imgHeight, width: imgWidth } = value.nativeEvent.source;
                        const width = imageWidth;
                        const ratio = imgWidth / imgHeight;
                        const portrait = imgWidth < imgHeight;

                        let height;
                        if (portrait) {
                            height = (width / ratio);
                        } else {
                            height = (width * ratio);
                        }
                        const itemStyle = { ...this.state.itemStyle };
                        itemStyle[index] = { width, height };
                        console.log('itemStyle', itemStyle);
                        this.setState({ itemStyle });
                    }}
                    style={this.state.itemStyle[index] || { width: imageWidth, height: imageWidth }}
                />*/}
            </View>
        );
    }
    render = () => {
        let data = this.props.data;
        if (!data || data.length === 0) {
            data = []
        }
        return (
            <SnapCarousel
                data={data}
                renderItem={this.props.renderItem || this.renderItem.bind(this)}
                sliderWidth={this.state.width}
                itemWidth={this.state.imageWidth}
                autoplay={this.props.static ? false : true}
                loop={true}
                autoplayDelay={500}
                autoplayInterval={3000}
                style={{ borderWidth: 1 }}
            // onBeforeSnapToItem={(currentIndex) => {
            //     this.setState({ currentIndex })
            // }}
            />
        )
        // return (
        //     <SideSwipe
        //         index={this.state.currentIndex}
        //         itemWidth={this.state.imageWidth}
        //         style={{ width: this.state.width }}
        //         data={data}
        //         contentOffset={this.state.contentOffset}
        //         onIndexChange={index =>
        //             this.setState(() => ({ currentIndex: index }))
        //         }
        //         renderItem={this.props.renderItem || this.renderItem.bind(this)}
        //     />
        // );
    };
}

reactMixin(Carousel.prototype, TimerMixin);