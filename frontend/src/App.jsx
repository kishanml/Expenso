import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import WelcomePage from "./components/Home/WelcomePage";
import ExpenseTable from "./components/AddExpense/ExpenseTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<LoginPage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="add-expense" element={<ExpenseTable/>}/>
      </Routes>
    </BrowserRouter>
  );
}
