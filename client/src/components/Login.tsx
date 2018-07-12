import React, { CSSProperties } from 'react'
import { Form, Input, Icon, Button, Row, Col, notification } from 'antd'
import SignUp from './SignUp'
import axios from 'axios'

// interface Inputs {
//     usernameInput: string
//     passwordInput: string
// }

export default class Login extends React.Component {
    state = {
        usernameInput: '',
        passwordInput: '',
        isSignUpVisible: false
        // rememberCb: false
    }

    isLoginValid = (username: string, password: string): boolean => {
        if (!username.length || !password.length) {
            notification.error({
                message: 'Erreur',
                description: 'Les champs ne peuvent pas être vides'
            })
            return false
        }
        return true
    }

    login = async (): Promise<void> => {

        const [ username, password ] = [ this.state.usernameInput, this.state.passwordInput ]
        if (!this.isLoginValid(username, password)) {
            return
        }

        try {
            const { data } = await axios({
                method: 'post',
                url: 'http://localhost:8888/login',
                data: {
                    username,
                    password
                }
            })
            notification.success({
                description: '',
                message: data
            })

            // On fait en sorte de sortir la page principale de l'application(Router qui switch de login à autre chose ?)
            // Check les cookie pour jwt ?

        } catch (error) {
            notification.error({
                message: 'Erreur serveur',
                description: error.response.data
            })
        }
    }

    toggleSignUpVisibility = () => {
        this.setState({isSignUpVisible: !this.state.isSignUpVisible})
    }

    render() {
        const buttonStyle: CSSProperties = {
            marginTop: 10
        }

        return(
            <Row className="spz-login-page" type="flex" justify="center">
                <Col xs={20} sm={18} md={14} lg ={10}>
                    <Form className="spz-login-form">
                        <img
                            src="./images/spoteezerIcon.png"
                            alt="icône du site"
                            style={{width: "80px", height: "80px", marginBottom: 10}}
                        />
                        <Form.Item>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                placeholder="Pseudonyme"
                                onChange={(e) => this.setState({usernameInput: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                type="password"
                                placeholder="Mot de passe"
                                onChange={(e) => this.setState({passwordInput: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item>
                            {/* <Checkbox>Se souvenir de moi</Checkbox> */}
                            <a className="spz-login-forgot" href="#">forgot password ?</a><br/>
                            <Button style={buttonStyle}
                            size="large"
                            type="primary"
                            onClick={this.login}>Sign In</Button><br/>
                            <Button style={buttonStyle}
                                size="large"
                                type="dashed"
                                onClick={() => this.setState({isSignUpVisible: true})}
                            >Sign Up</Button>

                            {/* Formulaire de création de compte */}
                            <SignUp
                                toggleSignUpVisibility={this.toggleSignUpVisibility}
                                isSignUpVisible={this.state.isSignUpVisible}
                            />

                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}
