import React from 'react'
import axios from 'axios'

interface GlobalState {
    currentUser: Partial<User> | null
    loadingScreen: boolean
}

interface GlobalActions {
    getCurrentUser(): Partial<User> | null
    setCurrentUser(): Promise<void>
    setLoadingScreen(): void
}

interface Context {
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

export const GlobalContext = React.createContext({} as Context)

export default class Global extends React.Component {
    state: GlobalState = {
        currentUser: null,
        loadingScreen: false
    }

    async componentDidMount() {

        try {
            // On set le loading screen pour ne pas avoir le component login d'afficher
            this.setLoadingScreen()

            await this.setCurrentUser()

        } catch (error) {
            console.log(error)
            this.setLoadingScreen()
        }

    }

    setCurrentUser = async () => {
    // On check la validité du token à l'initialisation de l'application
    let authentication: null | any = null

    authentication = await axios.get('http://localhost:8888/authenticate')
    this.setLoadingScreen()

    this.setState({currentUser: authentication.data.user})
    }

    getCurrentUser = (): Partial<User> | null => {
        return this.state.currentUser
    }

    setLoadingScreen = (): void => {
        this.setState({loadingScreen: !this.state.loadingScreen})
    }

    actions: GlobalActions = {
        getCurrentUser: this.getCurrentUser,
        setCurrentUser: this.setCurrentUser,
        setLoadingScreen: this.setLoadingScreen
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
