import React, { CSSProperties } from 'react'
import { Form, Input, Icon, Checkbox, Button, Row, Col } from 'antd'

export default class Login extends React.Component {

    public render() {
        const buttonStyle: CSSProperties = {
            margin: 10
        }

        return(
            <div style={{textAlign: "center"}}>
                <Row type="flex" justify="center">
                    <Col span={8}>
                        <Form className="spz-login-form">
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
                                <Checkbox>Se souvenir de moi ?</Checkbox><br/>
                                <a className="spz-login-forgot" href="#">Mot de passe oublié</a><br/>
                                <Button style={buttonStyle} size="large" type="primary" >Se connecter</Button><br/>
                                <Button style={buttonStyle} size="large" type="dashed">Créer un compte</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
