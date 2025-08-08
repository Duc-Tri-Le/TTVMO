import React from 'react'
import Header from '../../component/Header/Header';
import SidebarUser from '../../component/SidebarUser/SidebarUser';
import "./ManagerUser.css";

const ManagerUser = ({ children }) => {
  return (
    <div className='manager-user-container'>
      <Header />
      <div className='manager-user-content'>
        <SidebarUser />
        <main className='manager-user-main'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ManagerUser
