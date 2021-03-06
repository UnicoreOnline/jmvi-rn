import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native'

import styles from './styles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
import SafeAreaView from '../../component/SafeAreaView'
import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../../config/Colors';
// import { CachedImage } from 'react-native-cached-image';
import ProgressiveImage from '../../component/ProgressiveImage'
// import GallerySwiper from "react-native-gallery-swiper";
// import ImageZoom from 'react-native-image-pan-zoom';

class GallerySwiperViewController extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
        const { navigation } = this.props
        console.log('navigation>>>>>', navigation.getParam('arrGallery', []).length, ' initialPage ', navigation.getParam('initialPage', 0));
        this.state = {
            arrGallery: navigation.getParam('arrGallery', []),
            initialPage: navigation.getParam('initialPage', 0),
        }
    }

    componentDidMount() {
        let wait = new Promise((resolve) => setTimeout(resolve, 1000));  // Smaller number should work
        wait.then(() => {
            // this.refs.flatlist.scrollToIndex({ index: this.state.initialPage, animated: true });
            this.flatlist.scrollToIndex({ index: this.state.initialPage, animated: true });
        });
    }

    renderGalleryItem(rowData) {
        var galleryItem = rowData.item
        return (
            // <ImageZoom cropWidth={Dimensions.get('window').width}
            //     cropHeight={Dimensions.get('window').height}
            //     imageWidth={Utility.screenWidth}
            //     imageHeight={Utility.screenHeight}>
            <TouchableOpacity style={styles.flatlistContainer} activeOpacity={1}>
                <ProgressiveImage
                    resizeMode={"contain"}
                    style={styles.imgProfile}
                    placeholderStyle={styles.placeHolderPhotoStyle}
                    uri={galleryItem.photo_url != '' ? galleryItem.photo_url : null}
                    borderRadius={1}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }}
                />
                {/* <CachedImage
                    style={styles.imgProfile}
                    source={{
                        uri: galleryItem.url != '' ? galleryItem.url : null
                    }}
                    fallbackSource={Images.placeHolder}
                /> */}
            </TouchableOpacity>
            // </ImageZoom>
        )
    }
    render() {
        // console.log('this.state.arrGallery', this.state.arrGallery.length, ' initial ', this.state.initialPage)
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={{ flex: 1, marginHorizontal: 0, backgroundColor: Colors.white }}>
                    <FlatList
                        // style={{ backgroundColor: Colors.redColor }}
                        data={this.state.arrGallery}
                        horizontal={true}
                        extraData={this.state}
                        renderItem={this.renderGalleryItem.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ref={el => this.flatlist = el}
                        // initialScrollIndex={0}// Because if initialPage is 0 or 1 then not loading all data.
                        initialScrollIndex={this.state.initialPage > 2 ? this.state.initialPage : 0}// Because if initialPage is 0 or 1 then not loading all data.
                        // initialNumToRender={(Array.isArray(propertyDetails.photos) ? propertyDetails.photos : []).length}
                        // initialNumToRender={this.state.arrGallery.length}
                        // onViewableItemsChanged={this.onViewableItemsChanged }
                        // viewabilityConfig={{
                        //     itemVisiblePercentThreshold: 150
                        // }}
                        // ItemSeparatorComponent={this.flatListItemSeparator}
                        snapToInterval={Utility.screenWidth}
                        snapToAlignment={'center'}
                    />
                    {/* <FlatList
                        data={this.state.arrGallery}
                        horizontal={true}
                        extraData={this.state}
                        renderItem={this.renderGalleryItem.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ref={el => this.flatlist = el}
                        initialScrollIndex={this.state.initialPage > 2 ? this.state.initialPage : 2}// Because if initialPage is 0 or 1 then not loading all data.
                        initialNumToRender={this.state.arrGallery}
                        snapToInterval={Utility.screenWidth}
                        snapToAlignment={'center'}
                        getItemLayout={(data, index) => ({
                            length: Utility.screenWidth,
                            offset: Utility.screenWidth * index,
                            index
                        })}
                    // onEndReachedThreshold={0.4}
                    // onEndReached={this.handleLoadMore}
                    /> */}
                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'flex-end', paddingTop: 8, paddingEnd: 8 }} activeOpacity={0.7} onPress={() => this.onBackPressed(false)}>
                        <Image style={{ alignSelf: 'flex-end', width: 20, height: 20 }} source={Images.cancel}></Image>
                    </TouchableOpacity>
                </View>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        )
    }
    //Navigation
    onBackPressed(isSuccess) {
        // var params = {
        //     'isSuccess': isSuccess,
        //     to: this.props.navigation.state.params.to,
        // }
        // this.props.navigation.state.params.onNavigateBack(params);
        this.props.navigation.goBack();
    }
    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.Login:
                    break;
                default:
                    break;
            }

        }
    }

}
export default GallerySwiperViewController