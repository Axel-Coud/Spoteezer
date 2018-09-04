import React from 'react'
import { Form, Input, Icon, Upload, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { UploadProps } from 'antd/lib/upload'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import axios from 'axios'
import { GlobalContext } from '../../global/Global';

interface State {
    fileList: UploadFile[]
}

interface FormValues {
    fichier: UploadChangeParam,
    artiste: string,
    titre: string
}

export default Form.create()(class Import extends React.Component<FormComponentProps, State> {

    state: State = {
        fileList: []
    }

    isFormValid = (): boolean => {
        const { getFieldsError, validateFields } = this.props.form

        validateFields()
        const formErrors = getFieldsError()

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

        const fileList = this.state.fileList

        if (!fileList.length) {
            notification.error({
                message: 'Erreur dans le formulaire',
                description: " Veuillez associer un morceau de musique"
            })
            return false
        }

        return true
    }

    onClickUpload = async (): Promise<void> => {
        const formData = new FormData()

        const { getFieldsValue } = this.props.form

        const file = this.state.fileList[0]

        if (!this.isFormValid()) {
            return
        }

        // On cast en FormValues car c'est ce qui est retourné dans les fait
        const formValues = getFieldsValue() as FormValues

        formData.append('file', file.originFileObj!)
        formData.append('artiste', formValues.artiste)
        formData.append('titre', formValues.titre)

        try {
            const test = formData.entries()
            for (const [key, value] of test) {
                console.log(key, value);
              }
            const result = await axios({
                method: 'post',
                url: 'http://localhost:8888/musics/add',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            })
            console.log(result)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Erreur interne',
                description: error
            })
            return
        }
    }

    onChangeFile = (info: UploadChangeParam): void => {
        const file = info.file

        // On souhaite filtré si le fichier n'est pas au format audio accepté (mp3 etc...)
        if (file.type !== "audio/mp3") {
            notification.error({
                message: "Impossible d'uploader",
                description: "Ce n'est pas un fichier audio",
                duration: 2
            })

            return
        }

        // Si on ajoute un fichier celui devient la filelist entière car on en veut qu'un seul, sinon on remove
        const fileList = file.status === 'removed'  ? [] : [file]

        this.setState({
            fileList
        })
    }

    render() {

        const { getFieldDecorator } = this.props.form

        const uploadProps: UploadProps = {
            accept: "audio/*",
            onChange: this.onChangeFile,
            fileList: this.state.fileList
        }

        return (
            <>
                <h2 className="spz-text-centerer spz-import-title">Importer une musique</h2>
                <div className="spz-import-form-container">
                    <Form>
                        <Form.Item>
                            {
                                getFieldDecorator('titre', {
                                    rules: [{
                                        required: true, message: 'Le champs est vide'
                                    }, {
                                        max: 80, message: 'limité à 80 caractères'
                                    }]
                                })(
                                    <Input
                                        prefix={<Icon type="tag-o" className="spz-form-icon" />}
                                        placeholder="Titre"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('artiste', {
                                    rules: [{
                                        required: true, message: 'Le champs est vide'
                                    }, {
                                        max: 50, message: 'limité à 50 caractères'
                                    }]
                                })(
                                    <Input
                                    prefix={<Icon type="user" className="spz-form-icon" />}
                                    placeholder="Artiste"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item >
                            {
                                getFieldDecorator('fichier')(
                                    <Upload {...uploadProps} >
                                        <Button style={{width: '100%'}}>
                                            <Icon type="upload"/> Choisir le morceau
                                        </Button>
                                    </Upload>
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <GlobalContext.Consumer>
                                {
                                    (context) => {
                                        return <Button
                                                    type='primary'
                                                    onClick={async () => {
                                                        try {

                                                            await context.actions.setCurrentUser()
                                                        } catch (error) {

                                                            notification.error({
                                                                message: 'Session utilisateur expiré',
                                                                description: 'Token invalide',
                                                                duration: 2
                                                            })
                                                            return
                                                        }
                                                        this.onClickUpload()
                                                    }}
                                                >Uploader</Button>
                                    }
                                }
                            </GlobalContext.Consumer>
                        </Form.Item>
                    </Form>
                </div>
            </>
        )
    }
})
