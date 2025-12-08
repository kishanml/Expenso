import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import AddExpenseSidebar from "./AddExpenseSidebar";
import { useSelector } from "react-redux";
import { useUploadExpenseWithFileMutation } from "../../services/expenseApi";


import {
    // useGetAllExpenseQuery,
    useLazyGetAllExpenseQuery,
    useDeleteExpenseMutation,
} from "../../services/expenseApi";
import EditExpenseSidebar from "./EditExpenseSidebar";
import { format } from 'date-fns';
import { IoMdAdd } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa";
import { IoClose } from "react-icons/io5";



const ExpenseTable = () => {

    const { access_token } = useSelector((state) => state.auth);

    const [openNewExpenseSidebar, setopenNewExpenseSidebar] = useState(false);
    const [openEditExpenseSidebar, setopenEditExpenseSidebar] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);


    const [importModal, setImportModal] = useState(false);


    const [deleteModal, setDeleteModal] = useState(false);
    const [editDeleteExpenseId, setEditDeleteExpenseId] = useState(null);

    const [trigger, { data, isSuccess }] = useLazyGetAllExpenseQuery({ access_token });
    const [deleteExpense, { isLoading, isDeleteSuccess, isError }] = useDeleteExpenseMutation();


    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadExpenseWithFile] = useUploadExpenseWithFileMutation();

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        };

    const handleImport = (e) => {

        console.log('clicked')
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        console.log(selectedFile)

        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const access_token = localStorage.getItem("access_token");
            const response = uploadExpenseWithFile({ file: selectedFile, access_token }).unwrap();

            if (response.error) {
            alert("Error uploading file");
            } else {
            setImportModal(false);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsUploading(false);
        }
    };


    const handleSelectAll = (event) => {
        const isSelected = event.target.checked;
        setSelectedExpenses(
            isSelected ? expenses.map((expense) => expense.id) : []
        );
    };


    const deleteAll = (event) => {


    }

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

    const showImportModal = () => {
        setImportModal(!importModal)
    }

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
            const res = await deleteExpense({
                id: editDeleteExpenseId,
                access_token: access_token,
            }).unwrap();

            showDeleteModal()
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
                <h1 className="text-3xl p-5 font-medium">Transaction Log</h1>

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

                        {/* TODO : button with proper length */}
                        <div className="flex gap-x-2">
                            <button
                                className="bg-[#c6252b] text-white rounded-lg flex items-center px-2 py-1"
                                onClick={showImportModal}>
                                <CiImport className="text-white w-5 h-5" />
                                Import
                            </button>
                            <button
                                onClick={toggleSidebar}
                                className="bg-[#c6252b] text-white rounded-lg flex items-center px-2 py-1"
                            >
                                <IoMdAdd className="text-white w-5 h-5" />
                                Add
                            </button>
                            <button
                                className="bg-[#c6252b] text-white rounded-lg flex items-center px-2 py-1"
                                onClick={deleteAll}
                            >   
                                <MdOutlineDeleteForever className="text-white w-5 h-5" />
                                Clear All
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
                                    Txn Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sender/Receiver Name
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
                                    className={`bg-white border-b  ${expense.transaction_type === 'credit' ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
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


            {importModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-80 relative">
                  <button
                    className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setImportModal(false)}
                    disabled={isUploading}
                  >
                    <IoClose size={20} />
                  </button>
          
                  <h2 className="text-xl font-semibold mb-4 text-center">Import Expenses</h2>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Upload file with your expense records.
                  </p>
          

                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                      onClick={() => document.getElementById("file-upload").click()}
                      disabled={isUploading}
                    >
                      <span>
                        {selectedFile ? selectedFile.name : isUploading ? "Uploading..." : "Import"}
                      </span>
                    </button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImport}
                    />
                  </div>
                </div>
              </div>
            )}

        </div>
    );
};

export default ExpenseTable;
