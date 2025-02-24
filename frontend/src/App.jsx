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



export default function App() {


  const { access_token } = getToken();
  
console.log("access_token", access_token)
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={access_token === "undefined" || !access_token ? <LoginPage /> :  <Navigate to ={"/welcome"}/>}>
          <Route index element={<Login />} /> 
          <Route path="login" element={<Login />} /> 
          <Route path="reset-password" element={<ForgotPassword/>}/>
          <Route path="create-account" element={<CreateAccount/>}/>
          <Route path="verify-email" element={<CreateAccount/>}/>


        </Route>

        <Route
          path="welcome"
          element={
            access_token !== "undefined" ?
            (<>
            
              <NavBar />
              <WelcomePage />
              {/* <Footer /> */}
            </>) : <Navigate to ={"/"}/>
          }
        />

        <Route
          path="add-expense"
          element={
            <>
              <NavBar />
              <ExpenseTable />
              {/* <Footer /> */}
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
