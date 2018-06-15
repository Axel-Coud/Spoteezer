import React, { CSSProperties } from 'react'
import { Form, Input, Icon, Checkbox, Button, Row, Col } from 'antd'

export default class Login extends React.Component {

    public render() {
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
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                type="password"
                                placeholder="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>Se souvenir de moi</Checkbox>
                            <a className="spz-login-forgot" href="#">Mot de passe oublié</a><br/>
                            <Button style={buttonStyle} size="large" type="primary" >Se connecter</Button><br/>
                            <Button style={buttonStyle} size="large" type="dashed">Créer un compte</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}
