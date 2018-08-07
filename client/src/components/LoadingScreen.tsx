import React from 'react'
import { Spin } from 'antd'

export default class LoadingScreen extends React.Component {

    render() {
        return(
            <div className="spz-loadscreen-container">
                <Spin size="large" />
            </div>
        )
    }
}
