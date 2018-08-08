import React from 'react'
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
import { MenuItem } from '../components/Home';

export default class HomeContentRouter extends React.Component<{currentMenuIndex: number, menuItems: MenuItem[]}> {

    render() {

        const selectedMenuItem = this.props.menuItems.filter((menu) => {
            return menu.index === this.props.currentMenuIndex
        })[0]

        // ## Si jamais la on a pas de selectedMenuItem trouvé pour des raisons tel
        // que des problème de config ou juste un bug lambda on sécurise en détournant sur la page des musiques
        const routeToRedirect = '/' + (selectedMenuItem ? selectedMenuItem.name : 'musique')

        return (
            <BrowserRouter>
            <div>
                <Redirect to={routeToRedirect} />
                {this.props.menuItems.map((menu, index) => {
                    return <Route path={`/${menu.name}`} component={menu.component} playlistId={menu.playlistId} key={index} />
                })}
            </div>
            </BrowserRouter>
        )
    }
}
