import React, { useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext.jsx'

const CourseList = () => {
  const {listCourse} = useContext(StoreContext)
  return (
    <div>
      CourseList 
    </div>
  )
}

export default CourseList
