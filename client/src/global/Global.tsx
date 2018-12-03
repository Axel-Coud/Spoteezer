import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { MenuItem } from '../components/Home'
import { Music } from '../../../server/controller/musics/getOneMusic'
import { notification } from 'antd'

interface GlobalState {
    currentUser: Partial<User> | null
    loadingScreen: boolean
    audioSource: string
    audioReader: React.RefObject<HTMLAudioElement>
    currentMenuIndex: number
    menuItems: MenuItem[]
    musicQueue: Music[]
    currentMusicQueueIndex: number
}

export interface GlobalActions {
    getCurrentUser(): Partial<User> | null
    verifyCurrentUser(): Promise<void>
    setLoadingScreen(): void
    disconnectUser(): Promise<void>
    setAudioSource(audioSource: string, audioReader: HTMLAudioElement, isLaunchedFromPlaylist: boolean): void
    getAudioReader(): React.RefObject<HTMLAudioElement>
    setCurrentMenuIndex(index: number): void
    setMenuItems(menuItems: MenuItem[]): void
    setMusicQueue(musicQueue: Music[]): void
    playTrack(musId: number, isLaunchedFromPlaylist: boolean): Promise<void>
}

export interface GlobalContext {
    globalState: GlobalState
    globalActions: GlobalActions
}

interface User {
    uti_id: number
    uti_nom: string
    uti_prenom: string
    uti_email: string
    uti_username: string
}

export const globalPlug = (Component) => (props) => {
    return <GlobalContext.Consumer>{(ctx) =>
        <Component {...ctx}{...props}/>
    }</GlobalContext.Consumer>
}

export const GlobalContext = React.createContext({} as GlobalContext)

export default class Global extends React.Component<{}, GlobalState> {
    state: GlobalState = {
        currentUser: null,
        loadingScreen: false,
        audioSource: '',
        audioReader: React.createRef<HTMLAudioElement>(),
        currentMenuIndex: 1,
        menuItems: [],
        musicQueue: [],
        currentMusicQueueIndex: -1
    }

    async componentDidMount() {

        try {
            // On set le loading screen pour ne pas avoir le component login d'afficher
            this.setLoadingScreen()
            await this.verifyCurrentUser()
            this.setLoadingScreen()

        } catch (error) {
            console.log(error)
            this.setLoadingScreen()
        }

    }

    /**
     * On check la validité du token tout en prenant
     * grâce au dit token les informations de l'utilisateur car
     * token contient le userId qui permet de les prendres
     */
    verifyCurrentUser = async (): Promise<void> => {
        let authentication: null | any = null
        try {
            authentication = await axios.get('http://localhost:8889/auth')
            this.setState({currentUser: authentication.data.user})
        } catch (error) {
            this.setState({currentUser: error.response.data.user})
            throw new Error(`Utilisateur non authentifié`)
        }
    }

    getCurrentUser = (): Partial<User> | null => {
        return this.state.currentUser
    }

    setLoadingScreen = (): void => {
        this.setState({loadingScreen: !this.state.loadingScreen})
    }

    disconnectUser = async (): Promise<void> => {
        await axios.get<void>('http://localhost:8889/endSession')
        this.setState({currentUser: null})
    }

    playTrack = async (musId: number, isLaunchedFromPlaylist: boolean): Promise<void> => {

        let music: null | AxiosResponse<Buffer> = null

        try {
            await this.verifyCurrentUser()
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
                duration: 4
            })
        }
        const audioReader = this.getAudioReader()
        const url = URL.createObjectURL(music.data)
        if (audioReader.current) {

            if (isLaunchedFromPlaylist) {
                this.setAudioSource(url, audioReader.current, true)
            } else {
                this.setState({musicQueue: [], currentMusicQueueIndex: -1}, () => {
                    this.setAudioSource(url, audioReader.current!, false)
                })
            }
        }
    }

    /**
     * Update l'audio reader avec une nouvelle musique et la joue
     * @param audioSource blobUrl built with URL.createObjectUrl(blob)
     * @param audioReader
     */
    setAudioSource = (audioSource: string, audioReader: HTMLAudioElement, isLaunchedFromPlaylist: boolean): void => {
        this.setState({
            audioSource
        }, () => {
            audioReader.pause()
            audioReader.load()
            audioReader.play()
            if (isLaunchedFromPlaylist) {
                audioReader.onended = (_) => {
                    const nextIndex = this.state.currentMusicQueueIndex + 1
                    const isEndOfQueue = nextIndex > (this.state.musicQueue.length - 1)

                    if (isEndOfQueue) {
                        return
                    } else {
                        const nextMusic = this.state.musicQueue[nextIndex]
                        this.setState({ currentMusicQueueIndex: nextIndex }, () => {
                            this.playTrack(nextMusic.musId, true)
                        })
                    }
                }
            }
        })
    }

    getAudioReader = () => {
        return this.state.audioReader
    }

    setCurrentMenuIndex = (index: number): void => {
        return this.setState({currentMenuIndex: index})
    }

    setMenuItems = (menuItems: MenuItem[]): void => {
        return this.setState({menuItems})
    }

    setMusicQueue = (musicQueue: Music[]): void => {
        return this.setState({
            musicQueue,
            currentMusicQueueIndex: 0
        }, async () => {

            this.playTrack(musicQueue[0].musId, true)
        })
    }

    actions: GlobalActions = {
        getCurrentUser: this.getCurrentUser,
        verifyCurrentUser: this.verifyCurrentUser,
        setLoadingScreen: this.setLoadingScreen,
        disconnectUser: this.disconnectUser,
        setAudioSource: this.setAudioSource,
        getAudioReader: this.getAudioReader,
        setCurrentMenuIndex: this.setCurrentMenuIndex,
        setMenuItems: this.setMenuItems,
        setMusicQueue: this.setMusicQueue,
        playTrack: this.playTrack
    }

    render() {

        return (
            <GlobalContext.Provider value={{
                globalState: {...this.state},
                globalActions: {...this.actions}
            }}>
                {this.props.children}
            </GlobalContext.Provider>
        )
    }
}
