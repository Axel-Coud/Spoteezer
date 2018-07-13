import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

export default class Home extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        console.log(collapsed)
        this.setState({ collapsed })
    }

    render() {
        return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
                    <SubMenu
                        key="sub2"
                        title={<span><Icon type="team" className="spz-home-layout-icon" /><span>Test</span></span>}
                    >
                        <Menu.Item key="6">Test 1</Menu.Item>
                        <Menu.Item key="8">Test 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9">
                        <Icon type="cloud-upload-o" className="spz-home-layout-icon" />
                        <span>Import</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <h1>( ͡° ͜ʖ ͡°)</h1>
                        <h2>Work in Progress</h2>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Spoteezer ©2018
                </Footer>
            </Layout>
        </Layout>
        )
    }
}
