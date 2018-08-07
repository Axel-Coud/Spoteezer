import React from 'react'
import { Layout } from 'antd'

export default class Header extends React.Component {

    render() {
        return (
            <Layout.Header style={{ background: '#fff', padding: 0 }}>
                <a>Se déconnecter</a>
            </Layout.Header>
        )
    }
}