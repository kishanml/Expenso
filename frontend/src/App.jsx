import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import WelcomePage from "./components/Home/WelcomePage";
import ExpenseTable from "./components/AddExpense/ExpenseTable";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />

        <Route
          path="welcome"
          element={
            <>
              <NavBar />
              <WelcomePage />
              {/* <Footer /> */}
            </>
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
