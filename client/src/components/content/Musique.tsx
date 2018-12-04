import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { ListedTrack } from '../../../../server/controller/musics/getAllMusic'
import { Table, Icon, Divider, notification, Tooltip, Popover, message } from 'antd'
import { GlobalContext, globalPlug } from '../../global/Global'
import { ColumnProps } from 'antd/lib/table'
import PlaylistHeader from '../header/PlaylistHeader'

interface Props extends GlobalContext {
    playlistId?: number
}

interface State {
    musicList: ListedTrack[],
    audioSource: string
}

export default globalPlug(class Musique extends React.Component<Props, State> {
    state: State = {
        musicList: [],
        audioSource: ''
    }

    audioRef = React.createRef<HTMLAudioElement>()

    async componentDidMount() {

        let musicList: null | ListedTrack[] = null
        const isComponentDisplayingPlaylist = this.props.playlistId

        try {

            await this.props.globalActions.verifyCurrentUser()
            musicList = isComponentDisplayingPlaylist ? await this.getPlaylistTracks() : await this.getAllMusic()
        } catch (error) {

            notification.error({
                message: "Erreur",
                description: error.message,
                duration: 4
            })
            return
        }

        // Ce map est uniquement là pour mettre des propriétés 'key' par conventions de antd à chaque data
        const list = musicList.map((item) => {
            return { ...item, key: item.musId }
        })

        this.setState({ musicList: list })
    }

    async getPlaylistTracks(): Promise<ListedTrack[]> {

        let result: AxiosResponse<ListedTrack[]> | null = null
        try {
            result = await axios.get('http://localhost:8889/playlists/tracks', {
                params: {
                    playlistId: this.props.playlistId
                }
            })
        } catch (error) {
            notification.error({
                message: 'Impossible de charger la playlist',
                description: error.response && error.response.data ? error.response.data : error.message
            })

            return []
        }

        return result.data
    }

    async getAllMusic(): Promise<ListedTrack[]> {

        const result = await axios.get('http://localhost:8889/musics/all')

        return result.data
    }

    /**
     * Download une musique depuis le serveur en fonction de l'id envoyée en paramètre
     * @param musId Id de la musique à télécharger
     */
    async downloadTrack(musId: number): Promise<void> {
        try {
            await this.props.globalActions.verifyCurrentUser()
            window.open('http://localhost:8889/musics/download?musId=' + musId)
        } catch (error) {
            return notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }
    }

    /**
     * Supprime une musique dans la base de donnée en fonction de l'id envoyée en paramètre
     * @param musId Id de la musique à supprimer
     */
    async deleteTrack(musId: number): Promise<void> {
        try {
            await this.props.globalActions.verifyCurrentUser()
            await axios.delete('http://localhost:8889/musics/delete', {
                params: {
                    musId
                }
            })
        } catch (error) {
            return notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }

        const updatedMusicList = this.state.musicList.filter((item) => {
            return item.musId !== musId
        })

        notification.success({
            message: 'Musique supprimée avec succès',
            description: ''
        })

        this.setState({musicList: updatedMusicList})
    }

    /**
     * Toggle on/off du like sur une musique donnée
     * @param trackId Identifiant de la musique
     * @param userId Identifiant de l'utilisateur
     */
    async toggleLike(trackId: number, userId: number): Promise<void> {

        let toggled: null | AxiosResponse<'liked' | 'unliked'>
        try {
            await this.props.globalActions.verifyCurrentUser()
            toggled = await axios.post('http://localhost:8889/musics/toggleLike', {
                trackId,
                userId
            })

        } catch (error) {
            notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }

        const updatedMusicList = this.state.musicList.map((music) => {
            if (music.musId === trackId) {
                return {
                    ...music,
                    likedByUser: !music.likedByUser,
                    likes: toggled!.data === 'liked' ? ++music.likes : --music.likes
                }
            }
            return music
        })

        return this.setState({musicList: updatedMusicList})
    }

    async addTrackToPlaylist(musId: number, playlistId: number): Promise<void> {

        try {
            await this.props.globalActions.verifyCurrentUser()
            await axios.post('http://localhost:8889/playlists/addTrack', {
                musId,
                playlistId
            })
        } catch (error) {
            return notification.error({
                message: 'Erreur',
                description: error.response && error.response.data ? error.response.data : error.message,
                duration: 4
            })
        }

        message.success('Morceau ajoutée à la playlist')
    }

    async removeFromPlaylist(musId: number, playlistId: number): Promise<void> {

        let removedTrack: AxiosResponse<number> | null = null
        try {
            await this.props.globalActions.verifyCurrentUser()
            removedTrack = await axios.delete('http://localhost:8889/playlists/removeTrackFromPlaylist', {
                params: {
                    musId,
                    playlistId
                }
            })
        } catch (error) {
            return notification.error({
                message: 'Erreur',
                description: error.response && error.response.data ? error.response.data : error.message,
            })
        }

        const updatedMusicList = this.state.musicList.filter((track) => track.musId !== removedTrack!.data)

        this.setState({musicList: updatedMusicList}, () => {
            message.success('Morceau supprimée de la playlist')
        })
    }

    launchPlaylist = async (): Promise<void> => {
        const musics = this.state.musicList
        this.props.globalActions.setMusicQueue(musics)
    }

    render() {
        const playlists = this.props.globalState.menuItems.filter((menuItem) => menuItem.playlistId)

        const columns: ColumnProps<ListedTrack>[] = [{
            title: '',
            key: 'play',
            fixed: 'left',
            width: 50,
            render: (_, record) => {
                return (<span>
                    <a onClick={() => this.props.globalActions.playTrack(record.musId, false)}><Icon type="play-circle" /></a>
                </span>)
            }
        }, {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: 'Artiste',
            dataIndex: 'artist',
            key: 'artist'
        }, {
            title: <Icon type='clock-circle' />,
            dataIndex: 'duration',
            key: 'duration',
            align: 'center'
        }, {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 110,
            render: (_, record) => {

                const currentUser = this.props.globalActions.getCurrentUser()

                const removeFromPlaylistButton =
                (<>
                    <Tooltip placement='top' title={'Retirer de la playlist'} >
                        <a onClick={() => this.removeFromPlaylist(record.musId, this.props.playlistId!)}><Icon type="close" /></a>
                    </Tooltip>
                    <Divider type="vertical" />
                </>)

                const addToPlaylistList =
                (<>
                    {playlists.map((playlist) =>
                        <span key={playlist.playlistId!}><a onClick={() => this.addTrackToPlaylist(record.musId, playlist.playlistId!)}>{playlist.name}</a><br></br></span>
                    )}
                </>)

                const addToPlaylistButton =
                (<>
                    <Popover placement="right" title="Ajouter à une playlist" content={addToPlaylistList} trigger="click" >
                        <a><Icon type="file-add" /></a>
                    </Popover>
                    <Divider type="vertical" />
                </>)

                const deleteElement =
                (<>
                    <Divider type="vertical" />
                    <a onClick={() => this.deleteTrack(record.musId)}><Icon type="delete" /></a>
                </>)

                const likeElement =
                (<>
                    <Tooltip placement='top' title={record.likes ? `${record.likes} likes` : '0 likes'} >
                        <a onClick={() => this.toggleLike(record.musId, currentUser!.uti_id!)} >
                            <Icon type="like" style={{color: record.likedByUser ? '#f94f50' : '#000000a6'}} />
                        </a>
                    </Tooltip>
                    <Divider type='vertical' />
                </>)

                const isNotInPlaylist = !this.props.playlistId
                const actionBar =
                (<span>
                {this.props.playlistId ? removeFromPlaylistButton : addToPlaylistButton}
                <a onClick={() => this.downloadTrack(record.musId)}><Icon type="download" /></a>
                { isNotInPlaylist && currentUser && currentUser.uti_id === record.uploaderId ? deleteElement : ''}
                </span>)

                return (
                    <>
                        {likeElement}
                        <Popover placement="right" content={actionBar} trigger="click">
                            <Icon type="ellipsis" />
                        </Popover>
                    </>
                )
            }
        }]

        const playlistId = this.props.playlistId
        if (playlistId) {
            return (
                <Table
                    columns={columns}
                    dataSource={this.state.musicList}
                    scroll={{ x: 580}}
                    title={() => <PlaylistHeader launchPlaylist={this.launchPlaylist} playlistId={playlistId} />}
                />
            )
        } else {
            return <Table
                columns={columns}
                dataSource={this.state.musicList}
                scroll={{ x: 580}}
            />
        }
    }
})
