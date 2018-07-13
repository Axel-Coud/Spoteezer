import React from 'react'
import ReactDOM from 'react-dom'
import Router from './Routing/Router'
import 'antd/dist/antd.css'
import Global from './global/Global'

ReactDOM.render(
    <Global>
        <Router />
    </Global>,
    document.getElementById('root')
)
