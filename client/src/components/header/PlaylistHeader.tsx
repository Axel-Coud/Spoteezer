import React from 'react'
import { Playlist } from '../../../../server/controller/playlists/getUserPlaylists'
import { Button, notification, Popconfirm, Popover, Input } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { globalPlug, GlobalContext } from '../../global/Global'

const deleteButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '7px',
    top: '-10px'
}

const editButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '48px',
    top: '-10px'
}

const playButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '89px',
    top: '-10px'
}

interface Props extends GlobalContext {
    playlistId: number,
    launchPlaylist(): Promise<void>
}

interface State {
    playlist: Playlist | null,
    pllTitleInput: string
}

export default globalPlug(class PlaylistHeader extends React.Component<Props, State> {

    state: State = {
        playlist: null,
        pllTitleInput: ''
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

    onEditPllTitleInputChange = (inputValue: string): void => {
        this.setState({pllTitleInput: inputValue})
    }

    handleEditPll = async (): Promise<void> => {

        if (!this.state.pllTitleInput.length) {
            return notification.warn({
                message: "Veuillez donner un nouveau à la playlist",
                description: '',
                duration: 2
            })
        }

        const currentMenuItems = this.props.globalState.menuItems
        const playlistIndex = currentMenuItems.findIndex((menuItem) => menuItem.playlistId === this.props.playlistId)

        let updatedPlaylist: AxiosResponse<Playlist> | null = null
        try {
            updatedPlaylist = await axios.post('http://localhost:8889/playlists/editTitle', {
                playlistId: this.props.playlistId,
                playlistTitle: this.state.pllTitleInput
            })
        } catch (error) {
            return notification.error({
                message: "Erreur dans l'édition de la playlist",
                description: error.response && error.response.data ? error.response.data : error.message,
                duration: 4
            })
        }

        currentMenuItems[playlistIndex].name = updatedPlaylist.data.playlistTitle
        this.props.globalActions.setMenuItems(currentMenuItems)

    }

    render() {

        const playlist = this.state.playlist
        return (<div style={{textAlign: 'center', position: 'relative'}}>
            <span style={{fontWeight: 'bold'}}>{playlist ? playlist.playlistTitle : ''}</span>
            <Button style={playButtonStyle} onClick={this.props.launchPlaylist} type='primary' icon='play-circle' size='large' />
            <Popover
                placement='left'
                content={<>
                        <Input
                            placeholder='nom de la playlist'
                            onChange={(e) => this.onEditPllTitleInputChange(e.target.value)}
                            defaultValue={this.state.playlist ? this.state.playlist.playlistTitle : ''}
                            style={{width: '80%', marginRight: 10}}
                        />
                        <Button onClick={this.handleEditPll} icon='edit' />
                        </>}
                title='Renommer la playlist'
                trigger='click'
            >
                <Button style={editButtonStyle} type='primary' icon='edit' size='large' />
            </Popover>
            <Popconfirm placement="left" title={'Voulez vous vraiment détruire cette playlist'} onConfirm={() => this.deletePlaylist()} okText="Oui" cancelText="Non">
                <Button style={deleteButtonStyle} type='danger' icon='delete' size='large' />
            </Popconfirm>
        </div>)
    }
})
