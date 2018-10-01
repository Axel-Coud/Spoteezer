import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { Music } from '../../../../server/controller/musics/getAllMusic'
import { Table, Icon, Divider, notification } from 'antd'
import { GlobalActions } from '../../global/Global'
import { ColumnProps } from 'antd/lib/table'

interface Props {
    globalActions: GlobalActions
}

interface State {
    musicList: Music[]
}

export default class Musique extends React.Component<Props, State> {
    state: State = {
        musicList: []
    }

    async componentDidMount() {

        let musicList: null | AxiosResponse<any> = null
        try {
            await this.props.globalActions.verifyCurrentUser()
            musicList = await axios({
                method: 'get',
                url: 'http://localhost:8889/musics/all'
            })
        } catch (error) {

            notification.error({
                message: "Erreur",
                description: error.message,
                duration: 2
            })
            return
        }

        // Ce map est uniquement là pour mettre des prorpiétés 'key' par conventions de antd à chaque data
        const test = musicList.data.map((item, index) => {
            return { ...item, key: index }
        })

        this.setState({ musicList: test })
    }

    render() {
        const columns: ColumnProps<Music>[] = [{
            title: '',
            key: 'play',
            render: () => {
                return (<span>
                    <Icon type="play-circle" />
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
            key: 'duration'
        }, {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {

            const deleteElement =
                (<span>
                    <Divider type="vertical" />
                    <a onClick={this.placeholder}><Icon type="close" /></a>
                </span>)

            return (
                <span>
                    <a onClick={this.doShit}><Icon type="download" /></a>
                    {this.props.globalActions.getCurrentUser()!.uti_id ? deleteElement : ''}
                </span>)
            }
        }]

        return <Table columns={columns} dataSource={this.state.musicList} />
    }
}
