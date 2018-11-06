import React from 'react'
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
import { MenuItem } from '../components/Home'
import { GlobalContext } from '../global/Global'

export default class HomeContentRouter extends React.Component<{currentMenuIndex: number, menuItems: MenuItem[]}> {

    render() {

        const selectedMenuItem = this.props.menuItems.filter((menu) => {
            return menu.index === this.props.currentMenuIndex
        })[0]

        // ## Si jamais la on a pas de selectedMenuItem trouvé pour des raisons tel
        // que des problème de config ou juste un bug lambda on sécurise en détournant sur la page des musiques
        const routeToRedirect = '/' + (selectedMenuItem ? selectedMenuItem.name : 'musique')

        return (
            <GlobalContext.Consumer>
                {(global) => {
                    return(
                    <BrowserRouter>
                        <div style={{background: '#fff', minHeight: 360}}>
                            <Redirect to={routeToRedirect} />
                            {this.props.menuItems.map((menu, index) => {
                                // On utilise la pattern 'render' pour pouvoir envoyer des props, en l'occurence les informations du user
                                return <Route
                                path={`/${menu.name}`}
                                key={index}
                                render={(props) => <menu.component
                                                        {...props}
                                                        playlistId={menu.playlistId}
                                                        globalActions={global.globalActions}
                                                    />}
                                />
                            })}
                        </div>
                    </BrowserRouter>
                    )
                }}
            </GlobalContext.Consumer>
        )
    }
}
