import React from 'react'
import { Layout, notification } from 'antd'
import { GlobalContext } from '../../global/Global';

export default class Header extends React.Component {

    onClickDeco = async (global: GlobalContext): Promise<void> => {
        try {
            await global.actions.disconnectUser()
            notification.success({
                description: '',
                message: 'Deconnecté',
                duration: 2
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <Layout.Header style={{ background: '#fff', padding: 0 }}>
                <GlobalContext.Consumer>
                    {(global) => {
                return <a onClick={() => this.onClickDeco(global)}>Se déconnecter</a>
                    }}
                </GlobalContext.Consumer>
            </Layout.Header>
        )
    }
}
