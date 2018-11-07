import React from 'react'
import { Layout, notification, Button, Tooltip } from 'antd'
import { GlobalContext, globalPlug } from '../../global/Global'

export default globalPlug(class Header extends React.Component<GlobalContext> {

    onClickDeco = async (): Promise<void> => {
        try {
            await this.props.globalActions.disconnectUser()
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
                    <audio className="spz-audio-reader" controls={true} ref={this.props.globalState.audioReader}>
                        <source src={this.props.globalState.audioSource} type='audio/mp3'></source>
                    </audio>
                    <Tooltip title="Se déconnecter">
                        <Button type="primary"
                        shape="circle"
                        icon="poweroff"
                        onClick={this.onClickDeco}
                        className='spz-logout-button'
                        />
                    </Tooltip>
                </div>
            </Layout.Header>
        )
    }
})
