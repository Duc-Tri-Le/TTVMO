import React from 'react'
import Header from '../component/Header/Header'
import Footer from '../component/Footer/Footer'
import "./DefaultLayout.css"

const DefaultLayout = ({children}) => {
  return (
    <div className='wrapper'>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="content-wrapper">
        {children}
      </div>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  )
}

export default DefaultLayout
