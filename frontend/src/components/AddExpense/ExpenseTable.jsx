import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddExpenseSidebar from './AddExpenseSidebar';


const ExpenseTable = () => {
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [openNewExpenseSidebar, setopenNewExpenseSidebar] = useState(false);

  const expenses = [
    { expense_id: "01", expense_datetime: "05/02/2025 15:10 PM", type: "Debit", amount: "10,000", currency: "INR", user: "Kishan Mishra", category: "Bills", subcategory: "Rent", document_id: "www.google.com", remarks: "Paid to rental owner" },
    { expense_id: "02", expense_datetime: "06/02/2025 14:12 PM", type: "Credit", amount: "1,00,000", currency: "INR", user: "Haber", category: "Fixed", subcategory: "Salary", document_id: "www.google.com", remarks: "-" },
    { expense_id: "03", expense_datetime: "06/02/2025 11:12 AM", type: "Credit", amount: "8200.54", currency: "INR", user: "X", category: "Variable", subcategory: "Freelance", document_id: "www.google.com", remarks: "Prosquad website" },
  ];

  const handleSelectAll = (event) => {
    const isSelected = event.target.checked;
    setSelectedExpenses(isSelected ? expenses.map((expense) => expense.expense_id) : []);
  };

  const handleSelectExpense = (expense_id) => {
    setSelectedExpenses((prevSelected) =>
      prevSelected.includes(expense_id)
        ? prevSelected.filter((id) => id !== expense_id)
        : [...prevSelected, expense_id]
    );
  };

  const toggleSidebar = () => {

    setopenNewExpenseSidebar(!openNewExpenseSidebar)
    console.log(openNewExpenseSidebar)
  }
  return (
    <div className='w-full min-h-screen'>
      <div className='flex flex-col mx-10'>
        <h1 className='text-3xl p-5 font-medium'>Expense Records</h1>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex flex-row gap-x-4 items-center justify-between pb-4">
            <div className="relative w-full flex">
              <input
                type="text"
                id="table-search"
                className="block p-2 text-sm ml-5 text-gray-900 border border-gray-300 rounded-lg w-[500px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search records"
              />
            </div>

            <div className="flex gap-x-2">
              <button onClick={toggleSidebar} className='px-2 py-1 bg-[#c6252b] text-white rounded-lg'>Add Expense</button>
              <button className='px-2 py-1 bg-[#c6252b] text-white rounded-lg'>Move to Dashboard</button>
              <button className='px-2 py-1 bg-[#c6252b] text-white rounded-lg'>Bulk Delete</button>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#c6252b]">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedExpenses.length === expenses.length}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">Expense ID</th>
                <th scope="col" className="px-6 py-3">Datetime</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Currency</th>
                <th scope="col" className="px-6 py-3">Payer</th>

                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Sub-category</th>

                <th scope="col" className="px-6 py-3">Document</th>
                <th scope="col" className="px-6 py-3">Remarks</th>
                <th scope="col" className='px-6 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${index}`}
                        type="checkbox"
                        checked={selectedExpenses.includes(expense.expense_id)}
                        onChange={() => handleSelectExpense(expense.expense_id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm"
                      />
                      <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="px-6 py-4 text-gray-900">{expense.expense_id}</th>
                  <td className="px-6 py-4  text-gray-900">{expense.expense_datetime}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.type}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.amount}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.currency}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.user}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.category}</td>
                  <td className="px-6 py-4  text-gray-900">{expense.subcategory}</td>

                  <td className="px-6 py-4"><Link to={expense.document_id} className="p-2 rounded-lg bg-red-100">View</Link></td>
                  <td className="px-6 py-4">{expense.remarks}</td>
                  <td className="px-6 py-4 flex gap-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <MdOutlineModeEdit className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <MdOutlineDeleteForever className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <BsThreeDotsVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openNewExpenseSidebar && (
        <AddExpenseSidebar isopen={openNewExpenseSidebar} toggleSidebar={toggleSidebar} />)}    </div>
  );
};

export default ExpenseTable;
