import React from 'react'
import { Modal, Form, Input, Icon, Col, notification } from 'antd'
// FormComponentProps est un type nécessaire pour le component avec son HOC
import {FormComponentProps, ValidationRule} from 'antd/lib/form/Form'
import axios from 'axios'

interface FormFields {
    username: string
    email: string
    password: string
    passwordVerif: string
    prenom: string
    nom: string
    [key: string]: string
}

export default Form.create()(class SignUp extends React.Component<{
    toggleSignUpVisibility(): void,
    isSignUpVisible: boolean,
    } & FormComponentProps> {

    signUpRef = React.createRef<Modal>()

    /**
     * Check la conformité des inputs du formulaire et envoit au serveur pour générer un compte utilisateur
     */
    handleSubmit = async (): Promise<void> => {

        if (!this.isFormValid()) {
            return
        }

        // @ts-ignore Object type returned by getFieldsValue() can't be set as an interface even though the interface is right
        const values: FormFields = this.props.form.getFieldsValue()
        try {
            await axios({
                method: 'post',
                url: 'http://localhost:8888/users/add',
                data: {
                    email: values.email,
                    pseudo: values.username,
                    prenom: values.prenom,
                    nom: values.nom,
                    password: values.password
                }
            })

            notification.success({
                message: 'Succès',
                description: 'Compte créé, veuillez vous connectez'
            })

            this.props.form.resetFields()
            this.props.toggleSignUpVisibility()

        } catch (error) {
            notification.error({
                message: error.response.data ,
                description: ''
            })
        }
    }

    /**
     * Détermine si le formulaire est valide si c'est le cas, si ce n'est pas le cas signale à l'UI les erreurs et renvoit false
     */
    isFormValid = (): boolean => {

        const { validateFields, getFieldsError } = this.props.form

        validateFields()
        // @ts-ignore Object type returned by getFieldsError() can't be set as an interface even though the interface is right
        const formErrors: FormFields = getFieldsError()

        // On vérifie qu'il n'y ai pas d'erreur dans aucuns champs du formulaire
        for (const key in formErrors) {
            if (getFieldsError().hasOwnProperty(key)) {

                if (formErrors[key]) {
                    notification.error({
                        message: 'Erreur dans le formulaire',
                        description: `Veuillez remplir tout les champs`
                    })
                    return false
                }
            }
        }

        return true
    }

    verifyPassword: ValidationRule["validator"] = (_, value, cb): void => {
        // @ts-ignore Object type returned by getFieldsError() can't be set as an interface even though the interface is right
        const passwords = this.props.form.getFieldValue('password')

        if (passwords === value) {
            cb()
        } else {
            cb(false)
        }
    }

    render() {

        const { getFieldDecorator, resetFields } = this.props.form

        return(
            <Modal
                ref={this.signUpRef}
                visible={this.props.isSignUpVisible}
                title={<Icon type="user-add" style={{fontSize: 20}} >Créez votre compte</Icon>}
                onCancel={() => {
                    resetFields()
                    this.props.toggleSignUpVisibility()
                }}
                onOk={() => this.handleSubmit()}
                okText="Créer le compte"
                cancelText="Annuler"
                style={{display: 'flex', justifyContent: 'center'}}
                className="spz-signup-modal"
            >
                <Form>
                    <Form.Item>
                        {
                            getFieldDecorator('email', {
                                rules: [{required: true, message: 'Champ vide', }]
                            })(
                                <Input
                                prefix={<Icon type="mail" className="spz-form-icon"/>}
                                placeholder="Email"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Champ vide' }]
                            })(
                                <Input
                                    prefix={<Icon type="user" className="spz-form-icon" />}
                                    placeholder="Pseudonyme"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                        message: "Doit contenir au moins 8 lettres ou chiffre dont un des deux.",
                                        required: true
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="lock" className="spz-form-icon" />}
                                    placeholder="Mot de passe"
                                    type="password"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('passwordVerif', {
                                rules: [
                                    {required: true, message: 'champs vides'},
                                    {validator: this.verifyPassword, message: 'les mot de passes ne sont pas égaux', required: true}
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="lock" className="spz-form-icon" />}
                                    placeholder="Retapez votre mot de passe"
                                    type="password"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Col span={10}>
                            <Form.Item>
                                {
                                    getFieldDecorator('prenom', {
                                        rules: [{required: true, message: 'Champ vide', }]
                                    })(
                                        <Input
                                            prefix={<Icon type="idcard" className="spz-form-icon" />}
                                            placeholder="Prénom"
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={2}/>
                        <Col span={12}>
                            <Form.Item>
                                {
                                    getFieldDecorator('nom', {
                                        rules: [{required: true, message: 'Champ vide', }]
                                    })(
                                        <Input
                                            prefix={<Icon type="idcard" className="spz-form-icon" />}
                                            placeholder="Nom"
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
})
