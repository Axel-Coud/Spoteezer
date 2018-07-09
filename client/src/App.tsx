import React from 'react'
import ReactDOM from 'react-dom'
// import Container from './components/Container'
import Login from './components/Login'
// import {Form} from 'antd'
import 'antd/dist/antd.css'
import Global from './global/Global'

ReactDOM.render(
    <Global>
        <Login/>
    </Global>,
    document.getElementById('root')
)
