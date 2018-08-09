import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import {GlobalContext} from '../global/Global'
import Header from './header/Header'
import { ClickParam } from 'antd/lib/menu'
import HomeContentRouter from '../Routing/HomeContentRouter'
import Musique from './content/Musique'

export interface MenuItem {
    index: number
    name: string
    component: React.ComponentClass
    playlistId?: number
}

interface HomeState {
    collapsed: boolean
    currentMenuIndex: number
    menuItems: MenuItem[]
}

const { Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

export default class Home extends React.Component<{}, HomeState> {
    state = {
        collapsed: true,
        currentMenuIndex: 1,
        menuItems: []
    }

    /**
     * Will need to add playlist by iteration someday
     */
    componentDidMount() {
        debugger
        this.setState({menuItems: [{
            index: 1,
            name: 'musique',
            component: Musique
        }, {
            index: 2,
            name: 'import',
            component: Musique
        }]})
    }

    onCollapse = (collapsed): void => {
        this.setState({ collapsed })
    }

    /**
     * Quand on click sur menu envoit la valeur de l'index au state local puis déclenche la callback pour swap d'UI dans content
     */
    onClickMenuItem = (e: ClickParam): void => {
        this.setState({currentMenuIndex: parseInt(e.key)})
    }

    render() {
        return (
        <Layout className="spz-layout" style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <img src="./images/spoteezerIcon.png" className="spz-sider-logo" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    onClick={(e) => this.onClickMenuItem(e)}
                    >
                    <Menu.Item key="1">
                        <Icon type="caret-right" className="spz-home-layout-icon" />
                        <span>Musique</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={<span><Icon type="folder" className="spz-home-layout-icon" /><span>Playlists</span></span>}
                    >
                        <Menu.Item key="3">chill</Menu.Item>
                        <Menu.Item key="4">electro</Menu.Item>
                        <Menu.Item key="5">funk</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="2">
                        <Icon type="cloud-upload-o" className="spz-home-layout-icon" />
                        <span>Import</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header/>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
                        <Breadcrumb.Item>Utilisateur</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <GlobalContext.Consumer>
                                {(global) => {
                                    const user = global.actions.getCurrentUser()
                                    return user ? user.uti_prenom : ''
                                }}
                            </GlobalContext.Consumer>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <HomeContentRouter currentMenuIndex={this.state.currentMenuIndex} menuItems={this.state.menuItems} />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Spoteezer ©2018
                </Footer>
            </Layout>
        </Layout>
        )
    }
}
