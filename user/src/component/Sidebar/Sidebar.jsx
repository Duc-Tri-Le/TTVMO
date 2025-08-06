import React, { useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext.jsx'

const Sidebar = () => {

  const {listCourse} = useContext(StoreContext)

  return (
    <div className='sidebar-container'>
      Sidebar
    </div>
  )
}

export default Sidebar
