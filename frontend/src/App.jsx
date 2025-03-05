import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import WelcomePage from "./components/Home/WelcomePage";
import ExpenseTable from "./components/AddExpense/ExpenseTable";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Authentication/Login";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import CreateAccount from "./components/Authentication/CreateAccount";
import { getToken } from "./services/LocalStorage";
import VerifyEmail from "./components/Authentication/VerifyEmail";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "./features/authSlice";

export default function App() {


  const {access_token } = useSelector((state) => state.auth)
  console.log(access_token)

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();


   // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(isAuthenticated,'auth')
  
  useEffect(() => {
      if (access_token && access_token !== "undefined" && access_token !== null && access_token.access_token!==null && access_token.refresh_token!==null) 
        setIsAuthenticated(true); 
      else
        setIsAuthenticated(false)
      
  },[access_token]); 

  useEffect(() => {
    let { access_token } = getToken(); 
    if (access_token)
      dispatch(setUserToken({ access_token: access_token }));
  }, [])

  console.log(isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/welcome" /> : <LoginPage />}
        >
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ForgotPassword />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Route>

        <Route path="verify-email" element={
          <>
            <NavBar show={false} />
            <VerifyEmail />
          </>
        } />
        <Route
          path="/welcome"
          element={isAuthenticated ? (
            <>
              <NavBar show={true} />
              <WelcomePage />
              <Footer />
            </>
          ) : (
            <Navigate to="/" />
          )}
        />

        <Route
          path="add-expense"
          element={isAuthenticated ? (
            <>
              <NavBar show={true} />
              <ExpenseTable />
              <Footer />
            </>
          ) : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
