import React from 'react'
import { Form, Input, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

export default Form.create()(class Import extends React.Component<FormComponentProps> {

    render() {

        const { getFieldDecorator } = this.props.form

        return (
            <>
                <h2 style={{ textAlign: 'center' }}>Importer une musique</h2>
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
                    </Form>
                </div>
            </>
        )
    }
})
