import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { ListMusic } from '../../../../server/controller/musics/getAllMusic'
import { Table, Icon, Divider, notification, Tooltip } from 'antd'
import { GlobalActions } from '../../global/Global'
import { ColumnProps } from 'antd/lib/table'

interface Props {
    globalActions: GlobalActions
}

interface State {
    musicList: ListMusic[],
    audioSource: string
}

export default class Musique extends React.Component<Props, State> {
    state: State = {
        musicList: [],
        audioSource: ''
    }

    audioRef = React.createRef<HTMLAudioElement>()

    async componentDidMount() {

        let musicList: null | AxiosResponse<any> = null
        try {
            await this.props.globalActions.verifyCurrentUser()
            const currentUser = this.props.globalActions.getCurrentUser()
            musicList = await axios({
                method: 'get',
                url: 'http://localhost:8889/musics/all',
                params: {
                    userId: currentUser!.uti_id
                }
            })
        } catch (error) {

            notification.error({
                message: "Erreur",
                description: error.message,
                duration: 2
            })
            return
        }

        // Ce map est uniquement là pour mettre des propriétés 'key' par conventions de antd à chaque data
        const list = musicList.data.map((item) => {
            return { ...item, key: item.musId }
        })

        this.setState({ musicList: list })
    }

    async playTrack(musId: number): Promise<void> {

        let music: null | AxiosResponse<Buffer> = null

        try {
            music = await axios.get('http://localhost:8889/musics/', {
                params: {
                    musId
                },
                responseType: 'blob'
            })
        } catch (error) {
            return notification.error({
                message: 'Erreur interne',
                description: error.message,
                duration: 2
            })
        }
        const audioReader = this.props.globalActions.getAudioReader()
        const url = URL.createObjectURL(music.data)
        if (audioReader.current) {
            this.props.globalActions.setAudioSource(url, audioReader.current)
        }
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

    render() {
        const columns: ColumnProps<ListMusic>[] = [{
            title: '',
            key: 'play',
            fixed: 'left',
            width: 50,
            render: (_, record) => {
                return (<span>
                    <a onClick={() => this.playTrack(record.musId)}><Icon type="play-circle" /></a>
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

            const deleteElement =
            (<>
                <Divider type="vertical" />
                <a onClick={() => this.deleteTrack(record.musId)}><Icon type="close" /></a>
            </>)

            const likeElement =
            (<>
                <Divider type='vertical' />
                <Tooltip placement='top' title={record.likes ? `${record.likes} likes` : '0 likes'} >
                    <a onClick={() => this.toggleLike(record.musId, currentUser!.uti_id!)} >
                        <Icon type="like" style={{color: record.likedByUser ? '#f94f50' : '#000000a6'}} />
                    </a>
                </Tooltip>
            </>)

            return (
                <span>
                    <a onClick={() => this.downloadTrack(record.musId)}><Icon type="download" /></a>
                    {likeElement}
                    {currentUser && currentUser.uti_id === record.uploaderId ? deleteElement : ''}
                </span>)
            }
        }]

        return (<>
        <Table columns={columns} dataSource={this.state.musicList} scroll={{ x: 580}} />
        </>)
    }
}
