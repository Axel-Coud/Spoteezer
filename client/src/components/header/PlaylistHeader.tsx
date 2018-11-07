import React from 'react'
import { Playlist } from '../../../../server/controller/playlists/getUserPlaylists'
import { Button, notification, Popconfirm } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { globalPlug, GlobalContext } from '../../global/Global'

const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '7px',
    top: '-10px'
}

interface Props extends GlobalContext {
    playlistId: number
}

interface State {
    playlist: Playlist | null
}

export default globalPlug(class PlaylistHeader extends React.Component<Props, State> {

    state: State = {
        playlist: null
    }

    async componentDidMount() {

        let playlist: Playlist | null = null
        try {
            playlist = await this.getPlaylistInfos()
        } catch (error) {
            return notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }

        this.setState({playlist})
    }

    async getPlaylistInfos(): Promise<Playlist> {

        const playlist = await axios.get('http://localhost:8889/playlists/', {
            params: {
                playlistId: this.props.playlistId
            }
        })

        return playlist.data
    }

    deletePlaylist = async () => {

        const menuItems = this.props.globalState.menuItems
        let deleted: AxiosResponse<Playlist> | null = null
        try {
            await this.props.globalActions.verifyCurrentUser()
            deleted = await axios.delete('http://localhost:8889/playlists/delete', {
                params: {
                    playlistId: this.props.playlistId
                }
            })
        } catch (error) {
            return notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }

        const index = menuItems.findIndex((menuItem) => menuItem.playlistId === deleted!.data.playlistId)
        menuItems.splice(index, 1)

        // Une fois delete on retourne au menu des musiques
        this.props.globalActions.setMenuItems(menuItems)
        this.props.globalActions.setCurrentMenuIndex(1)
    }

    render() {

        const playlist = this.state.playlist
        return (<div style={{textAlign: 'center', position: 'relative'}}>
            <span>{playlist ? playlist.playlistTitle : ''}</span>
            <Popconfirm placement="left" title={'Voulez vous vraiment détruire cette playlist'} onConfirm={() => this.deletePlaylist()} okText="Oui" cancelText="Non">
                <Button style={buttonStyle} type='danger' icon='delete' size='large' color='red' />
            </Popconfirm>
        </div>)
    }
})
