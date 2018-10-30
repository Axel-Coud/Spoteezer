import React from 'react'
import axios from 'axios'

interface GlobalState {
    currentUser: Partial<User> | null
    loadingScreen: boolean
    audioSource: string
    audioReader: React.RefObject<HTMLAudioElement>
}

export interface GlobalActions {
    getCurrentUser(): Partial<User> | null
    verifyCurrentUser(): Promise<void>
    setLoadingScreen(): void
    disconnectUser(): Promise<void>
    setAudioSource(audioSource: string, audioReader: HTMLAudioElement): void
    getAudioReader(): React.RefObject<HTMLAudioElement>
}

export interface GlobalContext {
    state: GlobalState
    actions: GlobalActions
}

interface User {
    uti_id: number
    uti_nom: string
    uti_prenom: string
    uti_email: string
    uti_username: string
}

export const GlobalContext = React.createContext({} as GlobalContext)

export default class Global extends React.Component {
    state: GlobalState = {
        currentUser: null,
        loadingScreen: false,
        audioSource: '',
        audioReader: React.createRef<HTMLAudioElement>()
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

    /**
     * Update l'audio reader avec une nouvelle musique et la joue
     * @param audioSource blobUrl built with URL.createObjectUrl(blob)
     * @param audioReader
     */
    setAudioSource = (audioSource: string, audioReader: HTMLAudioElement): void => {
        this.setState({
            audioSource
        }, () => {
            audioReader.pause()
            audioReader.load()
            audioReader.play()
            audioReader.onended = (_) => {
                console.log("la musique s'est finie");
            }
        })
    }

    getAudioReader = () => {
        return this.state.audioReader
    }

    actions: GlobalActions = {
        getCurrentUser: this.getCurrentUser,
        verifyCurrentUser: this.verifyCurrentUser,
        setLoadingScreen: this.setLoadingScreen,
        disconnectUser: this.disconnectUser,
        setAudioSource: this.setAudioSource,
        getAudioReader: this.getAudioReader
    }

    render() {

        return (
            <GlobalContext.Provider value={{
                state: {...this.state},
                actions: {...this.actions}
            }}>
                {this.props.children}
            </GlobalContext.Provider>
        )
    }
}
