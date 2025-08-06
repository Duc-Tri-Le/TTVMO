import React from 'react'
import Header from '../../component/Header/Header'
import Sidebar from '../../component/Sidebar/Sidebar'
import Content from '../../component/Content/Content'

const Home = () => {
  return (
    <div className='home-container'>
      <div className='home-header'>
        <Header/>
      </div>
      <div className='home-sidebar-content'>
        <div className='home-sidebar'>
            <Sidebar/>
        </div>
        <div className='home-content'>
            <Content/>
        </div>
      </div>
    </div>
  )
}

export default Home
