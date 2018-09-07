import React from 'react'
import axios from 'axios'
import { Music } from '../../../../server/controller/musics/getAllMusic'

interface Props {
    uti_id: number
}

interface State {
    musicList: Music[]
}

export default class Musique extends React.Component<Props, State> {
    state: State = {
        musicList: []
    }

    async componentDidMount() {
        const musicList = await axios({
            method: 'get',
            url: 'http://localhost:8888/musics/all'
        })
        console.log(this.props)

        this.setState({ musicList: musicList.data })
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                {this.state.musicList.map((music, index) => {
                    return (
                        <div key={index}>

                            <span>{music.title} | {music.artist} | {music.duration}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
}
