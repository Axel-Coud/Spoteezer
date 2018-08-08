import React from 'react'
import Login from '../components/Login'
import Home from '../components/Home'
import LoadingScreen from '../components/LoadingScreen'
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
import {GlobalContext} from '../global/Global'

export default class AppRouter extends React.Component {

    render() {
        return(
            <BrowserRouter>
                <div style={{height: '100%'}}>
                    <GlobalContext.Consumer>
                        {
                            (global) => {
                                return <Redirect to={global.state.loadingScreen ?
                                    '/spin' : global.actions.getCurrentUser() ?
                                    '/home' : '/login'} />
                            }
                        }
                    </GlobalContext.Consumer>
                    <Route path="/spin" component={LoadingScreen} />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                </div>
            </BrowserRouter>
        )
    }
}
