import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';


const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar show={true}/>

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;