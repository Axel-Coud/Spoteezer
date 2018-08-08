import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './Routing/AppRouter'
import 'antd/dist/antd.css'
import Global from './global/Global'

ReactDOM.render(
    <Global>
        <AppRouter />
    </Global>,
    document.getElementById('root')
)
