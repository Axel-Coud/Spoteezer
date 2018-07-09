import React from 'react'

interface GlobalState {
    currentUser: User | null
}

interface GlobalActions {
    getCurrentUser(): User | null
}

interface Context {
    state: GlobalState | null
    actions: GlobalActions | null
}

interface User {
    uti_id: number
    uti_nom: string
    uti_prenom: string
    uti_email: string
    uti_pseudo: string
}

export const GlobalContext = React.createContext({} as Context)

export default class Global extends React.Component {
    state: GlobalState = {
        currentUser: null
    }

    getCurrentUser = () => {
        return this.state.currentUser
    }

    actions: GlobalActions = {
        getCurrentUser: this.getCurrentUser
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
