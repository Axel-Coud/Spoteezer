import React from 'react'
import { Form, Input, Icon, Upload, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { UploadProps } from 'antd/lib/upload'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import axios from 'axios'
import { GlobalContext } from '../../global/Global'

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

    // Cette fonction sert uniqument à ne pas déclencher de requête quand on ajoute un fichier dans le fileList(On fait les manipulation manuellement)
    beforeUpload = () => {
        return false
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
                        description: `Veuillez correctement remplir tout les champs`
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

    onClickUpload = async (userId: number): Promise<void> => {
        const formData = new FormData()

        const { getFieldsValue } = this.props.form

        const file = this.state.fileList[0]

        if (!this.isFormValid()) {
            return
        }

        // On cast en FormValues car c'est ce qui est retourné dans les fait
        const formValues = getFieldsValue() as FormValues
        const fileReader = new FileReader()

        fileReader.onloadend = async () => {

            const fileDuration = await this.getFileDuration(fileReader)

            formData.append('file', file.originFileObj!)
            formData.append('artist', formValues.artiste)
            formData.append('title', formValues.titre)
            formData.append('uploaderId', `${userId}`)
            formData.append('duration', fileDuration!)

            try {
                await axios({
                    method: 'post',
                    url: 'http://localhost:8889/musics/add',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    }
                })
                notification.success({
                    message: 'Musique ajouté avec succès',
                    description: '',
                    duration: 2
                })
            } catch (error) {
                notification.error({
                    message: 'Erreur interne',
                    description: error.response && error.response.data ? error.response.data : error.message
                })
            }
        }
        fileReader.readAsArrayBuffer(file.originFileObj!)

    }

    onChangeFile = (info: UploadChangeParam): void => {
        // Dans l'api ANTD, seul info.filelist possède la propriété originFileObj nécessaire à l'upload, pas info.file
        const file = info.fileList[info.fileList.length - 1]
        const newFile = info.file

        if (newFile.status === 'removed') {
            return this.setState({fileList: []})
        }

        // On souhaite filtré si le fichier n'est pas au format audio accepté (mp3, mp4 etc...)
        if (newFile.type !== "audio/mp3" && newFile.type !== "audio/mpeg") {
            notification.error({
                message: "Impossible d'uploader",
                description: "Ce n'est pas un fichier audio",
                duration: 2
            })

            return this.setState({fileList: []})
        }

        // On limite à 25MO la taille des fichier uploadable
        if (newFile.size > 26210000)  {
            notification.error({
                message: "Impossible d'uploader",
                description: "Dépasse le volume autorisé (max: 25MO)"
            })

            return this.setState({fileList: []})
        }

        // Si on ajoute un fichier celui ci devient la filelist entière car on en veut qu'un seul
        return this.setState({
            fileList: [file]
        })
    }

    getFileDuration = async (fileReader: FileReader): Promise<string> => {
        const audioDecoder = new AudioContext()
        let fileDuration: null | string = null

        const fileInfo = await audioDecoder.decodeAudioData(fileReader.result)
        const duration = fileInfo.duration / 60
        let minutes = duration.toString().split('.')[0]
        const secondsAsMinutePercentage = 0 + '.' + duration!.toString().split('.')[1]
        const unroundedSeconds = parseFloat(secondsAsMinutePercentage) * 60 / 100
        const roundedSeconds = Math.floor(unroundedSeconds * 100) / 100
        const seconds = roundedSeconds.toString().split('.')[1]

        if (minutes.length === 1) {
            minutes = `0${minutes}`
        }

        fileDuration = `${minutes}:${seconds}`

        return fileDuration
    }

    render() {

        const { getFieldDecorator } = this.props.form

        const uploadProps: UploadProps = {
            accept: "audio/*",
            onChange: this.onChangeFile,
            fileList: this.state.fileList,
            beforeUpload: this.beforeUpload
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
                                    }, {
                                        pattern: /^[a-zA-Z0-9&' ]*$/, message: `Seulement caractères issus de l'alphabet, nombres et espaces acceptés`
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
                                            <Icon type="upload"/>Sélectionner...
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
                                                            await context.actions.verifyCurrentUser()
                                                        } catch (error) {
                                                            notification.error({
                                                                message: 'Session utilisateur expiré',
                                                                description: 'Token invalide',
                                                                duration: 2
                                                            })
                                                        }
                                                        // @ts-ignore GetCurrentUser is 99% safe to not be null, since we need to be auth'd to be here
                                                        this.onClickUpload(context.actions.getCurrentUser().uti_id)
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
