import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddExpenseSidebar from "./AddExpenseSidebar";
import { useSelector } from "react-redux";
import {
    useGetAllExpenseQuery,
    useDeleteExpenseMutation,
} from "../../services/expenseApi";
import EditExpenseSidebar from "./EditExpenseSidebar";

const ExpenseTable = () => {
    const { access_token } = useSelector((state) => state.auth);

    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [openNewExpenseSidebar, setopenNewExpenseSidebar] = useState(false);
    const [openEditExpenseSidebar, setopenEditExpenseSidebar] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [editDeleteExpenseId, setEditDeleteExpenseId] = useState(null);

    const { data, isSuccess } = useGetAllExpenseQuery({ access_token });
    const [deleteExpense, { isLoading, isDeleteSuccess, isError }] =
        useDeleteExpenseMutation();

    // console.log("edit side bar", openEditExpenseSidebar);

    const handleSelectAll = (event) => {
        const isSelected = event.target.checked;
        setSelectedExpenses(
            isSelected ? expenses.map((expense) => expense.id) : []
        );
    };

    const handleSelectExpense = (expense_id) => {
        setSelectedExpenses((prevSelected) =>
            prevSelected.includes(expense_id)
                ? prevSelected.filter((id) => id !== expense_id)
                : [...prevSelected, expense_id]
        );
    };

    const toggleSidebar = () => {
        setopenNewExpenseSidebar(!openNewExpenseSidebar);
        console.log(openNewExpenseSidebar);
    };
    const toggleEditSidebar = () => {
        setopenEditExpenseSidebar(!openEditExpenseSidebar);
    };

    const handleDeleteExpense = async () => {
        try {
            res = await deleteExpense({
                id: editDeleteExpenseId,
                access_token: access_token,
            }).unwrap();

            console.log("Deleted successfully", res);
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    useEffect(() => {
        if (data && isSuccess) {
            if (data.error === false) {
                setExpenses(data.data);
            }
        }
    }, [data, isSuccess]);

    return (
        <div className="w-full min-h-screen">
            <div className="flex flex-col mx-10">
                <h1 className="text-3xl p-5 font-medium">Expense Records</h1>

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
                            <button
                                onClick={toggleSidebar}
                                className="px-2 py-1 bg-[#c6252b] text-white rounded-lg"
                            >
                                Add Expense
                            </button>
                            <button className="px-2 py-1 bg-[#c6252b] text-white rounded-lg">
                                Move to Dashboard
                            </button>
                            <button className="px-2 py-1 bg-[#c6252b] text-white rounded-lg">
                                Bulk Delete
                            </button>
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
                                            checked={
                                                selectedExpenses.length ===
                                                expenses.length
                                            }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm"
                                        />
                                        <label
                                            htmlFor="checkbox-all-search"
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Expense ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Datetime
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Currency
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Payer
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sub-category
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Document
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Remarks
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b hover:bg-gray-50"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-table-search-${index}`}
                                                type="checkbox"
                                                checked={selectedExpenses.includes(
                                                    expense.id
                                                )}
                                                onChange={() =>
                                                    handleSelectExpense(
                                                        expense.id
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm"
                                            />
                                            <label
                                                htmlFor={`checkbox-table-search-${index}`}
                                                className="sr-only"
                                            >
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <th
                                        scope="row"
                                        className="px-6 py-4 text-gray-900"
                                    >
                                        {expense.id}
                                    </th>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.transaction_date}
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.transaction_type}
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.transaction_amount}
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        INR
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.user}
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.debit_category}
                                    </td>
                                    <td className="px-6 py-4  text-gray-900">
                                        {expense.sub_category}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            to={expense.document_id}
                                            className="p-2 rounded-lg bg-red-100"
                                        >
                                            View
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        {expense.remarks}
                                    </td>
                                    <td className="px-6 py-4 flex gap-x-2">
                                        <button
                                            onClick={() => {
                                                setEditDeleteExpenseId(
                                                    expense.id
                                                );
                                                toggleEditSidebar();
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <MdOutlineModeEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditDeleteExpenseId(
                                                    expense.id
                                                );
                                                handleDeleteExpense();
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
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
                <AddExpenseSidebar
                    isopen={openNewExpenseSidebar}
                    toggleSidebar={toggleSidebar}
                />
            )}{" "}
            {openEditExpenseSidebar && (
                <EditExpenseSidebar
                    id={editDeleteExpenseId}
                    isopen={openEditExpenseSidebar}
                    toggleSidebar={toggleEditSidebar}
                />
            )}{" "}
        </div>
    );
};

export default ExpenseTable;
