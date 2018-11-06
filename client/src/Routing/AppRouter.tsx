import React from 'react'
import Login from '../components/Login'
import Home from '../components/Home'
import LoadingScreen from '../components/LoadingScreen'
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
import {globalPlug, GlobalContext} from '../global/Global'

export default globalPlug(class AppRouter extends React.Component<GlobalContext> {

    render() {
        return(
            <BrowserRouter>
                <div style={{height: '100%'}}>
                    <Redirect to={this.props.globalState.loadingScreen ?
                        '/spin' : this.props.globalActions.getCurrentUser() ?
                        '/home' : '/login'} />
                    <Route path="/spin" component={LoadingScreen} />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                </div>
            </BrowserRouter>
        )
    }
})
