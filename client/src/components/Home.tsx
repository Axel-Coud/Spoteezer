import React from 'react'
import { Layout, Menu, Breadcrumb, Icon, notification, Modal, Input } from 'antd'
import {GlobalContext, globalPlug} from '../global/Global'
import Header from './header/Header'
import { ClickParam } from 'antd/lib/menu'
import HomeContentRouter from '../Routing/HomeContentRouter'
import Musique from './content/Musique'
import Import from './content/Import'
import Axios, { AxiosResponse } from 'axios'
import { Playlist } from '../../../server/controller/playlists/getUserPlaylists'

export interface MenuItem {
    index: number
    name: string
    // In fact not any but a react.component(for generic purposes i won't duck type it here, it would take too much time)
    component: any
    playlistId?: number
}

interface State {
    collapsed: boolean
    addPllModalVisible: boolean
    pllInput: string
}

const { Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

export default globalPlug(class Home extends React.Component<GlobalContext, State> {
    state: State = {
        collapsed: true,
        addPllModalVisible: false,
        pllInput: ''
    }

    /**
     * Will need to add playlist by iteration someday
     */
    async componentDidMount() {

        let userPlaylists: Playlist[] = []
        try {
            userPlaylists = await this.getUserPlaylists()
        } catch (error) {
            notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })
        }

        const menuItems: MenuItem[] = [{
            index: 1,
            name: 'musique',
            component: Musique
        }, {
            index: 2,
            name: 'import',
            component: Import
        }]

        // On push chaque playlist fetchés dans menuItems pour les afficher dans le submenu paylists
        for (let i = 0; i < userPlaylists.length; i++) {
            const playlist = userPlaylists[i]
            menuItems.push({
                // i + 4 car index 0 n'est pas une clé valide pour Menu.Item et index 1, 2 et 3 sont pris par Musique, Import et Ajouter
                index: i + 4,
                name: playlist.playlistTitle,
                component: Musique,
                playlistId: playlist.playlistId
            })
        }

        this.props.globalActions.setMenuItems(menuItems)
    }

    async getUserPlaylists(): Promise<Playlist[]> {

        const userPlaylistIds = await Axios.get<Playlist[]>('http://localhost:8889/playlists/allFromUser')

        return userPlaylistIds.data
    }

    onCollapse = (collapsed): void => {
        this.setState({ collapsed })
    }

    toggleAddPlaylistModal = (): void => {
        this.setState({addPllModalVisible: !this.state.addPllModalVisible})
    }

    pllInput = (e): void => {
        this.setState({pllInput: e.target.value})
    }

    handleAddPll = async (): Promise<void> => {

        const pllTitle = this.state.pllInput

        if (!pllTitle.length) {
            notification.error({
                message: 'Veuillez donner un nom à votre playlist',
                description: ''
            })
        }

        let addedPlaylist: AxiosResponse<Playlist> | null = null

        try {
            addedPlaylist = await Axios.post('http://localhost:8889/playlists/add', {
                pllTitle
            })
        } catch (error) {
            notification.error({
                message: 'Erreur interne',
                description: error.response && error.response.data ? error.response.data : error.message
            })

            return
        }

        const menuItems = this.props.globalState.menuItems
        // Length -2 car le dernier élément est toujours le menu 'ajouter playlist'
        const lastPlaylistIndex = menuItems[menuItems.length - 2].index

        const formattedAddedPlaylist: MenuItem = {
            index: lastPlaylistIndex + 2,
            name: addedPlaylist.data.playlistTitle,
            playlistId: addedPlaylist.data.playlistId,
            component: Musique
        }

        this.props.globalActions.setMenuItems(menuItems.concat(formattedAddedPlaylist))
        this.setState({
            addPllModalVisible: false
        })
    }

    /**
     * Quand on click sur menu envoit la valeur de l'index au state local puis déclenche la callback pour swap d'UI dans content
     */
    onClickMenuItem(e: ClickParam): void {
        if (e.key === '3') {
            this.toggleAddPlaylistModal()
        }

        this.props.globalActions.setCurrentMenuIndex(parseInt(e.key))
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
                    <Menu.Item key="2">
                        <Icon type="cloud-upload-o" className="spz-home-layout-icon" />
                        <span>Import</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={<span><Icon type="folder" className="spz-home-layout-icon" /><span>Playlists</span></span>}
                    >
                        {this.props.globalState.menuItems
                            .filter((menu) => (menu.index !== 1 && menu.index !== 2 && menu.index !== 3))
                            .map((menu) => <Menu.Item key={menu.index}>{menu.name}</Menu.Item>)
                            .concat(<Menu.Item key={3}><Icon type='folder-add'></Icon>Ajouter</Menu.Item>)
                        }

                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header/>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
                        <Breadcrumb.Item>Utilisateur</Breadcrumb.Item>
                        <Breadcrumb.Item>
                        { this.props.globalActions.getCurrentUser() ? this.props.globalActions.getCurrentUser()!.uti_prenom : ''}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <HomeContentRouter currentMenuIndex={this.props.globalState.currentMenuIndex} menuItems={this.props.globalState.menuItems} />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Spoteezer ©2018
                </Footer>
            </Layout>
            {/* Modal pour ajouter une playlist */}
            <Modal
                title="Ajouter une playlist"
                visible={this.state.addPllModalVisible}
                onOk={this.handleAddPll}
                onCancel={this.toggleAddPlaylistModal}
            >
                <Input
                    prefix={<Icon type="tag-o" className="spz-form-icon"/>}
                    placeholder="Titre"
                    onChange={(e) => this.pllInput(e)}
                />
            </Modal>
            {/* Modal pour ajouter une playlist */}
        </Layout>
        )
    }
})
