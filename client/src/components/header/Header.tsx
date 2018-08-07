import { Component } from 'react'
import { Layout } from 'antd'

export default class Header extends Component {

    render() {
        return (
            <Layout.Header style={{ background: '#fff', padding: 0 }}>
                <a>Se déconnecter</a>
            </Layout.Header>
        )
    }
}
