import React, { useContext } from 'react';
import "./StatisticsCourse.css";
import InstructorStatistic from '../../component/InstructorStatistic/InstructorStatistic';
import ManagerUser from '../ManagerUser/ManagerUser';
import { StoreContext } from '../../../context/StoreContext';
import StudentStatistic from '../../component/StudentStatistic/StudentStatistic';
const StatisticsCourse = () => {
  const{role, userId} = useContext(StoreContext); 
  
  return (
    <ManagerUser>
      <div className='statistics-course-container'>
      {role === "giang_vien" ? (
        <InstructorStatistic userId={userId}/>
      ): (
        <StudentStatistic userId={userId}/>
      )}
    </div>
    </ManagerUser>
  )
}

export default StatisticsCourse
