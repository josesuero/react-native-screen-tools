import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';


import Button from './Buttons';
import { Row } from './Table';
import properties from './properties';

export default (props) => {
    let { data } = props;
    let pages = 0;

    const onChange = (page) => {
        if (props.onChange) props.onChange(page);
    }

    if (props.paging) {
        const size = props.size || 10;
        const page = props.page || 1;
        const max = (size * page);
        pages = Math.ceil(data.length / size);
        data = [...data].splice((max - size), size);
    }

    return (<View>
        <FlatList
            data={data}
            renderItem={props.renderItem}
            keyExtractor={props.keyExtractor}
            horizontal={props.horizontal}
            numColumns={props.numColumns}
            onEndReached={props.onEndReached}
        />
        {props.paging ?
            <Row style={{ height: 35, marginTop: 10 }}>
                {props.page > 1 ?
                    <Button square
                        onPress={(() => {
                            onChange(props.page - 1)
                        })}
                        textStyle={styles.pagerTextStyle}
                        style={styles.pagerButtonStyle}>Anterior</Button>
                    : null}
                {[...Array(pages).keys()].map(page => {
                    page = page + 1;
                    return (
                        <Button key={`list-key-${page}`} square
                            onPress={(() => {
                                props.onChange(page)
                            })}
                            textStyle={styles.pagerTextStyle}
                            style={{
                                ...styles.pagerButtonStyle,
                                backgroundColor: props.page === (page) ? properties.borderColor : null,
                            }}>{page}</Button>
                    )
                }
                )}
                {props.page < pages ?
                    < Button square
                        onPress={(() => {
                            props.onChange(props.page + 1)
                        })}
                        textStyle={styles.pagerTextStyle}
                        style={styles.pagerButtonStyle}>Siguiente</Button> : null
                }

            </Row>
            : null
        }
    </View >)
}

const styles = StyleSheet.create({
    pagerButtonStyle: {
        flex: 0.2, borderWidth: 1,
        borderColor: properties.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    pagerTextStyle: {
        fontSize: 12,
    }
})