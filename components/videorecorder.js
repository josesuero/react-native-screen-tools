import React, { Component } from 'react';
import { View, TouchableHighlight, TouchableOpacity, Platform, PermissionsAndroid, StyleSheet } from 'react-native';

import Camera, { RNCamera } from 'react-native-camera';
import Icon from './Icon';
import CGText from './CGText';
import Page from './Page';
import { Row, Column } from './Table';
import Button, { SolidButton, } from './Buttons';

import Video from 'react-native-video';

var RNFS = require('react-native-fs');

const { CaptureMode, CaptureTarget } = Camera.constants;

export const cleanFiles = () => {
    return RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(result => {
            const promises = [];
            result.forEach(item => {
                if (item.name.endsWith(".mov")) {
                    promises.push(RNFS.unlink(item.path));
                }
            });
            return Promise.all(promises);
        })
        .then((result) => {
            console.debug('files deleted ', result.length);
        })
        .catch(console.error)


}


export default class VideoRecorder extends Component {

    state = {
        columnWidth: 0,
        isRecording: false,
        playback: false,
        timer: 15,
        video: null,
        cameraType: 'back',
        mirrorMode: false,
        captureAudio: true,
    };

    componentWillMount() {
        this.checkStorage();
    }

    componentDidUpdate() {
        const { timer, isRecording } = this.state;
        if (timer === 1) {
            clearInterval(this.interval);
        } else if (timer === 0 && isRecording) {
            this.stopCapture();
        }
    }

    async checkStorage() {
        if (Platform.OS === "android") {
            try {
                let granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        'title': 'Almacenamiento',
                        'message': 'Se requiere acceso al almacenamiento para guardar fotos y videos'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log("You can use write to the storage")
                } else {
                    // console.log("Storage permission denied")
                }
            } catch (err) {
                console.error(err)
            }
        }

    }

    startTimer() {
        console.log('starting timer');
        this.setState({ timer: 15 }, () => {
            this.interval = setInterval(
                () => {
                    this.setState((prevState) =>
                        ({ timer: prevState.timer - 1 })
                    )
                }, 1000);
        })
    }

    async getCameraRatio() {
        console.log('camera', this._camera);
        if (Platform.OS === "android") {
            const ratios = await this._camera.getSupportedRatiosAsync();
            console.log('ratios', ratios);
            this.setState({
                ratio: ratios[0]
            });
        }
    }


    onCapture() {
        const { isRecording } = this.state;

        if (isRecording) {
            this.stopCapture();
            return;
        }

        this.setState({ isRecording: true });
        this.startTimer();

        this._camera.recordAsync({
            quality: RNCamera.Constants.VideoQuality["4:3"],
            // videoBitrate: 5 * 1000 * 1000,
            orientation: "portrait",
        })
            .then((video) => {
                this.setState({ video, playback: true });
            })
            .catch((error) => console.log(error));

        // this._camera.capture({ mode: CaptureMode.video, totalSeconds: 15, mute: !this.state.captureAudio })
    }

    stopCapture() {
        console.log('stopping recording');
        this._camera.stopRecording();
        this.setState({ isRecording: false });
        clearInterval(this.interval);
    }

    renderPlayback() {

        const video = { ...this.state.video };
        console.log('video', video);
        const videoWidth = 640;
        const videoHeight = 480;
        const ratio = videoWidth / videoHeight;

        const width = this.state.columnWidth;
        let height = width;
        // if (video.width && video.height) {
        //     const ratio = video.width / video.height;
        //     // console.log('ratio', ratio);

        //     if (video.width < video.height) {
        //         height = (width * ratio);
        //     } else {
        //         height = (width / ratio);
        //     }
        // }
        // console.log("height", height);
        // console.log("width", width);

        let orientation;
        switch (video.videoOrientation) {
            case 1:
            case 2:
                video.orientation = "portrait"
                //portrait
                height = (width * ratio);
                break;
            case 3:
            case 4:
                video.orientation = "landscape"
                height = (width / ratio);
                break;
        }

        const videoStyle = { borderRadius: 10, width, height };

        return (<Page>
            <View onLayout={({ nativeEvent }) => {
                this.setState({ columnWidth: nativeEvent.layout.width })
            }}>

                <Video source={{ uri: video.uri }}   // Can be a URL or a local file.
                    // ref={this.props.videoRef}
                    // repeat={true}
                    // muted={true}
                    controls={true}
                    paused={this.state.paused}
                    style={videoStyle}
                // onLayout={this.handleVideoLayout}
                // onLoad={({ naturalSize }) => {
                //     const width = this.state.columnWidth;
                //     const ratio = naturalSize.width / naturalSize.height;

                //     if (naturalSize.orientation === "portrait") {
                //         const height = (width * ratio);
                //         this.setState({ videoStyle: { ...styles.portraitVideo, width, height } })
                //     } else {
                //         const height = (width / ratio);
                //         this.setState({ videoStyle: { ...styles.portraitVideo, width, height } })
                //     }
                //     this.handleScroll(0);
                // }}
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded

                />

                <Row>
                    <Column style={{ padding: 10 }}>
                        <Button square style={styles.button} onPress={() => {
                            this.cancel();
                        }}>Cancelar</Button>
                    </Column>
                    <Column style={{ padding: 10 }}>
                        <Button
                            square
                            styles={styles.button}
                            onPress={() => {
                                cleanFiles()
                                    .then(() => {
                                        this.setState({
                                            isRecording: false,
                                            playback: false,
                                            timer: 15,
                                            video: null,
                                        });
                                    });
                            }}
                        >Re-grabar</Button>
                    </Column>
                    <Column style={{ padding: 10 }}>
                        <SolidButton
                            styles={styles.button}
                            onPress={() => {
                                this.props.onChange(video);
                            }}
                        >Aceptar</SolidButton>
                    </Column>

                </Row>

            </View>

        </Page >)
    }

    cancel() {
        cleanFiles()
            .then(() => {
                this.props.onCancel();
            });
    }

    changeCameraType() {
        if (this.state.cameraType === 'back') {
            this.setState({
                cameraType: 'front',
                mirror: true
            });
        } else {
            this.setState({
                cameraType: 'back',
                mirror: false
            });
        }
    }

    render() {
        const { playback } = this.state;
        if (playback) {
            return this.renderPlayback();
        }
        return (
            <RNCamera
                ref={(ref) => {
                    this._camera = ref;
                }}
                style={{ flex: 1 }}
                // captureMode={CaptureMode.video}
                // captureTarget={CaptureTarget.disk}
                // ratio = "16:9"
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}

                // defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
                captureAudio={true}
                // mute={!this.state.captureAudio}
                ratio={this.state.ratio}
                type={this.state.cameraType}
                // onCameraReady={this.getCameraRatio.bind(this)}
                mirrorImage={this.state.mirrorMode}
                useCamera2Api
            >

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1 }}>

                        <Row style={{ alignItems: "center", }}>
                            <Column style={{ alignItems: "flex-start", marginLeft: 20 }}>

                            </Column>
                            <Column style={{ alignItems: "center" }}>
                                <CGText style={{ color: "#FFF", marginTop: 20, fontSize: 40 }}>{this.state.timer}</CGText>
                            </Column>
                            <Column style={{ alignItems: "flex-end", marginRight: 20 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState((prevState) => {
                                            return { captureAudio: !prevState.captureAudio }
                                        });
                                    }}
                                >
                                    {/* <Icon name={this.state.captureAudio ? "volume-up" : "volume-off"} /> */}
                                </TouchableOpacity>
                            </Column>
                        </Row>

                    </View>

                    <Row style={{ marginBottom: 20, justifyContent: "center" }}>
                        <Column style={{ alignItems: "flex-start", marginLeft: 20, justifyContent: "center" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.changeCameraType();
                                }}
                            >
                                <Icon name="md-reverse-camera" type="ion" size={30} />
                            </TouchableOpacity>
                        </Column>
                        <Column style={{ alignItems: "center" }}>
                            <TouchableHighlight
                                onPressIn={() => {
                                    this.onCapture();
                                }}
                                onPressOut={() => {
                                    this.stopCapture();
                                }}
                            >
                                <Icon
                                    name='circle' size={60}
                                />
                            </TouchableHighlight>
                        </Column>
                        <Column style={{ alignItems: "flex-end", marginRight: 20, justifyContent: "center" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.cancel();
                                }}
                            >
                                <Icon name="times" size={30} />
                            </TouchableOpacity>
                        </Column>
                    </Row>
                </View>
            </RNCamera >
        );
    }
}

const styles = StyleSheet.create({
    button: {
        fontSize: Platform.OS === "ios" ? 15 : 12
    }
})