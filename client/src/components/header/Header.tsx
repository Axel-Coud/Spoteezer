import React from 'react'
import { Layout, notification, Button, Tooltip } from 'antd'
import { GlobalContext } from '../../global/Global'

export default class Header extends React.Component {

    onClickDeco = async (global: GlobalContext): Promise<void> => {
        try {
            await global.globalActions.disconnectUser()
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
            <Layout.Header className="spz-header">
                <div style={{display: 'flex', position: 'relative'}}>

                    <GlobalContext.Consumer>
                        {(global) => {
                            return (
                                <>
                                    <audio className="spz-audio-reader" controls={true} ref={global.globalState.audioReader}>
                                        <source src={global.globalState.audioSource} type='audio/mp3'></source>
                                    </audio>
                                    <Tooltip title="Se déconnecter">
                                        <Button type="primary"
                                        shape="circle"
                                        icon="poweroff"
                                        onClick={() => this.onClickDeco(global)}
                                        className='spz-logout-button'
                                        />
                                    </Tooltip>
                                </>
                            )
                        }}
                    </GlobalContext.Consumer>
                </div>
            </Layout.Header>
        )
    }
}
