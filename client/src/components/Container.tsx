import React from 'react'
import {Button} from 'antd'

export default class Container extends React.Component {

    render() {
        return (
            <div>
                <h1 className="pouet">Nous sommes dans le container</h1>
                <Button type="primary" size="large" >Ant-design est bien loadé</Button>
            </div>
        )
    }
}