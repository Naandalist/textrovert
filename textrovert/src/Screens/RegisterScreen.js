import React, { Component } from 'react'
import {
    View,
    DrawerLayoutAndroid,
    ScrollView,
    Dimensions,
    StyleSheet
} from 'react-native'
import {
    Icon,
    Caption,
    Row,
    Image,
    Screen,
    Text,
    Heading,
    TextInput,
    Spinner,
    Button
} from '@shoutem/ui'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import PushNotification from 'react-native-push-notification'

const SCREEN_WIDTH = Dimensions.get('window').width

class RegisterScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fullname: '',
            username: '',
            email: '',
            phone: '',
            status: 'Hi there, im using textrovert',
            password: '',
            confirm_password: '',
            isLoading: false
        }
    }

    async registerAccount(){

        try {

            // check username format
            const validateUsername = /^[a-zA-Z0-9_]+$/
            if (!this.state.username.match(validateUsername)) {
                return alert("Username not valid, must be a - z, A - Z, with _ underscore")
            }

            // check username is already in use
            firebase.database().ref(`users/${this.state.username}`).once('value', (snapshot) => {
                if (snapshot.val()) {
                    return alert('Username already exists')
                }
            })

            //check if password match
            if (this.state.password !== this.state.confirm_password) {
                return alert("Password doesn't match")
            }

            this.setState({
                isLoading: true
            })

            const registerUser = await firebase.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password);


            const currentUser = firebase.auth().currentUser
            await currentUser.updateProfile({
                displayName: this.state.username
            })

            let userDetail = "/users/" + this.state.username
            const avatar = "https://ui-avatars.com/api/?size=256&name=" + this.state.fullname

            await PushNotification.configure({
                onRegister: async (token) => {
                    
                    await firebase.database().ref(userDetail).set({
                        fullname: this.state.fullname,
                        username: this.state.username,
                        phone: this.state.phone,
                        status: this.state.status,
                        avatar: avatar,
                        token
                    })

                    const cacheUserToStorage = {
                        uid: currentUser.uid,
                        email: this.state.email,
                        emailVerified: currentUser.emailVerified,
                        fullname: this.state.fullname,
                        phone: this.state.phone,
                        status: this.state.status,
                        username: this.state.username,
                        avatar: avatar,
                        token
                    }
        
                    await AsyncStorage.setItem('@user', JSON.stringify(cacheUserToStorage))

                }
            })

            this.setState({
                isLoading: false
            })

            console.log("Account created");
    
            // Navigate to the Login
            this.props.navigation.replace('Login')
    
        } catch (error) {
            console.log(error.toString())
            alert(error.toString())
            this.setState({
                isLoading: false
            })
        }
    }

    __renderButtonRegister(){
        if (this.state.isLoading) {
            return(
                <Spinner style={{ marginTop: 12 }} />
            )
        }else{
            return(
                <Button styleName="" style={{ marginTop: 12, backgroundColor:'#2C3A47', borderRadius:10, }} onPress={() => this.registerAccount()}>
                    <Text style={{color:'white'}}>REGISTER</Text>
                </Button>
            )
        }
    }

    render() {
        return (
            <Screen style={{ backgroundColor: '#fff' }}>
                <ScrollView>
                    <Image
                        source={require('../Assets/Images/login.png')}
                        style={styles.imageHeader}
                    />
                    <View style={styles.container}>
                        <View style={styles.alignCenter}>
                            <Heading>textrovert</Heading>
                            <Caption styleName="h-center">stay connect throught texts</Caption>
                        </View>

                        <View style={styles.authInput}>
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Fullname'}
                                value={this.state.fullname}
                                onChangeText={(val) => this.setState({ fullname: val })}
                            />
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Username'}
                                value={this.state.username}
                                onChangeText={(val) => this.setState({ username: val })}
                            />
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Email'}
                                value={this.state.email}
                                onChangeText={(val) => this.setState({ email: val })}
                            />
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Phone number'}
                                value={this.state.phone}
                                onChangeText={(val) => this.setState({ phone: val })}
                            />
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Password'}
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(val) => this.setState({ password: val })}
                            />
                            <TextInput
                                style={styles.inputForm}
                                placeholder={'Confirm password'}
                                secureTextEntry
                                value={this.state.confirm_password}
                                onChangeText={(val) => this.setState({ confirm_password: val })}
                            />
                            
                            {this.__renderButtonRegister()}

                            <Button styleName="clear" style={{ marginTop: 6 }} onPress={() => this.props.navigation.replace('Login')}>
                                <Text>Already have account ? sign in</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </Screen>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        marginTop: 12
    },
    imageHeader: {
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_WIDTH * 0.45,
        marginTop: 12, alignSelf: 'center'
    },
    alignCenter: {
        alignItems: 'center',
    },
    authInput: {
        marginTop: 12,
        padding: 18,
        backgroundColor: 'white',
        borderRadius:15,
    },
    inputForm:{
        borderBottomWidth:1,
        borderColor:'#eee',
    }
})

const mapStateToProps = state => {
    return {
        auth: state.Auth
    }
}

export default connect(mapStateToProps)(RegisterScreen)