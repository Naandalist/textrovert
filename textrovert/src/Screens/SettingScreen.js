import React, {Component} from 'react';
import {StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {
  Icon,
  View,
  NavigationBar,
  Title,
  Heading,
  Caption,
  Subtitle,
  Row,
  Image,
  TextInput,
  Screen,
  Spinner,
  Divider,
  Text,
  TouchableOpacity,
  Lightbox,
  ImageBackground,
  Overlay,
  Button,
} from '@shoutem/ui';
import {connect} from 'react-redux';
import {authenticate} from '../Redux/Actions/Auth';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      status: '',
      isLoading: false,
      progress: 0,
    };
  }

  componentDidMount() {
    this.setState({
      fullname: this.props.auth.user.fullname,
      status: this.props.auth.user.status,
    });
  }

  async updateProfile() {
    let userRef = '/users/' + this.props.auth.user.username;
    await firebase
      .database()
      .ref(userRef)
      .update({
        fullname: this.state.fullname,
        status: this.state.status,
      });

    await this.saveToCache();
    ToastAndroid.show('Profile successfully updated!', ToastAndroid.SHORT);
  }

  async saveToCache() {
    const cacheUserToStorage = {
      uid: this.props.auth.user.uid,
      email: this.props.auth.user.email,
      emailVerified: this.props.auth.user.emailVerified,
      fullname: this.state.fullname,
      phone: this.state.phone,
      status: this.state.status,
      username: this.props.auth.user.username,
      avatar: this.props.auth.user.avatar,
      token: this.props.auth.user.token,
    };

    await AsyncStorage.setItem('@user', JSON.stringify(cacheUserToStorage));
    await this.props.dispatch(authenticate(cacheUserToStorage));
  }

  __renderProfilePic() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Image source={{uri: this.props.auth.user.avatar}} styleName="large" />
      </View>
    );
  }

  __renderButtonSave() {
    if (this.state.isLoading) {
      return (
        <>
          <View
            style={{
              height: 3,
              backgroundColor: '#000',
              width: `${this.state.progress}%`,
            }}
          />
          <Spinner style={{marginTop: 16}} />
        </>
      );
    } else {
      return (
        <Button
          styleName=""
          style={styles.btnSave}
          onPress={() => this.updateProfile()}>
          <Text style={{color: 'white'}}>SAVE CHANGES</Text>
        </Button>
      );
    }
  }

  render() {
    return (
      <>
        <Screen>
          <Lightbox renderContent={() => this.__renderProfilePic()}>
            <ImageBackground
              source={{uri: this.props.auth.user.avatar}}
              styleName="large">
              <Overlay styleName="fill-parent image-overlay">
                <NavigationBar
                  styleName="clear"
                  leftComponent={
                    <Button onPress={() => this.props.navigation.goBack(null)}>
                      <Icon name="back" style={{color: '#fff'}} />
                    </Button>
                  }
                />
                <Heading styleName="sm-gutter-horizontal">
                  {this.props.auth.user.fullname}
                </Heading>
                <Subtitle>@{this.props.auth.user.username}</Subtitle>
              </Overlay>
            </ImageBackground>
          </Lightbox>

          <ScrollView>
            <View
              styleName="horizontal"
              style={{paddingHorizontal: 12, marginVertical: 12}}>
              <View>
                <Subtitle>Status</Subtitle>
                <Text>{this.props.auth.user.status}</Text>
              </View>

              <Icon
                style={styles.takepic}
                name="take-a-photo"
                onPress={() => alert('Update Avatar still Up Coming')}
              />
            </View>

            <View style={styles.container}>
              <TextInput
                style={styles.inputForm}
                placeholder={'Fullname'}
                value={this.state.fullname}
                onChangeText={val => this.setState({fullname: val})}
              />

              <TextInput
                style={styles.inputForm}
                placeholder={'Status'}
                value={this.state.status}
                onChangeText={val => this.setState({status: val})}
              />
              {this.__renderButtonSave()}
            </View>
          </ScrollView>
        </Screen>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  inputForm: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  btnSave: {
    marginTop: 12,
    backgroundColor: '#2C3A47',
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
  },
  takepic: {
    marginLeft: 150,
  },
});

const mapStateToProps = state => {
  return {
    auth: state.Auth,
  };
};

export default connect(mapStateToProps)(SettingScreen);
