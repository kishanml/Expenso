import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddExpenseSidebar from "./AddExpenseSidebar";
import { useSelector } from "react-redux";
import {
    // useGetAllExpenseQuery,
    useLazyGetAllExpenseQuery,
    useDeleteExpenseMutation,
} from "../../services/expenseApi";
import EditExpenseSidebar from "./EditExpenseSidebar";
import { format } from 'date-fns';
import { IoMdAdd } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { IoPieChart } from "react-icons/io5";




const ExpenseTable = () => {
    const { access_token } = useSelector((state) => state.auth);

    const [openNewExpenseSidebar, setopenNewExpenseSidebar] = useState(false);
    const [openEditExpenseSidebar, setopenEditExpenseSidebar] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);


    const [deleteModal, setDeleteModal] = useState(false);
    const [editDeleteExpenseId, setEditDeleteExpenseId] = useState(null);

    const [trigger, { data, isSuccess }] = useLazyGetAllExpenseQuery({ access_token });
    const [deleteExpense, { isLoading, isDeleteSuccess, isError }] = useDeleteExpenseMutation();

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
    };
    const toggleEditSidebar = () => {
        setopenEditExpenseSidebar(!openEditExpenseSidebar);
    };

    const showDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd-MM-yyyy HH:mm');
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    }


    const handleDeleteExpense = async () => {
        try {
            console.log(editDeleteExpenseId)
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

    useEffect(() => {
        trigger({ access_token })
    }, [openNewExpenseSidebar, openEditExpenseSidebar, deleteModal]);

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
                                className="bg-[#c6252b] text-white rounded-lg flex items-center gap-2 px-4 py-2"
                            >
                                <CiImport className="text-white w-5 h-5" />
                                Import
                            </button>
                            <button
                                onClick={toggleSidebar}
                                className="bg-[#c6252b] text-white rounded-lg flex items-center gap-2 px-4 py-2"
                            >
                                <IoMdAdd className="text-white w-5 h-5" />
                                Add
                            </button>
                            <button
                                className="bg-[#c6252b] text-white rounded-lg flex items-center gap-2 px-4 py-2"
                            >
                                <MdOutlineDeleteForever className="text-white w-5 h-5" />
                                Delete
                            </button>
                            <button
                                className="bg-[#c6252b] text-white rounded-lg flex items-center gap-2 px-4 py-2"
                            >   
                                <IoPieChart className="text-white w-5 h-5" />
                                Analysis
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
                                className={`bg-white border-b  ${
                                    expense.transaction_type === 'credit' ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
                                }`}
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
                                        {formatDate(expense.transaction_date)}
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
                                        {expense.payer_name}
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
                                            className="p-2 rounded-lg bg-neutral-200"
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
                                            <MdOutlineModeEdit className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditDeleteExpenseId(
                                                    expense.id
                                                );
                                                showDeleteModal();

                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <MdOutlineDeleteForever className="w-6 h-6" />
                                        </button>
                                        {/* <button className="text-gray-500 hover:text-gray-700">
                                            <BsThreeDotsVertical className="w-5 h-5" />
                                        </button> */}
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
            )}
            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this entry?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={showDeleteModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteExpense}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;
