import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// services
import { useSelector } from "react-redux";
import {
    // useGetAllExpenseQuery,
    useLazyGetAllExpenseQuery,
    useDeleteExpenseMutation,
} from "../../services/expenseApi";
import { useUploadExpenseWithFileMutation } from "../../services/expenseApi";

// icons
import { format } from 'date-fns';
import { Plus, X, Upload, Trash2, Edit, Loader2 } from 'lucide-react'; 


// pages
import AddExpenseSidebar from "./AddExpenseSidebar";
import EditExpenseSidebar from "./EditExpenseSidebar";




// Component for the delete confirmation modal
const DeleteConfirmationModal = ({ show, onCancel, onDelete, isDeleting, title, message }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
                <p className="mb-6 text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className={`px-5 py-2 rounded-lg text-white transition duration-150 ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-[#c6252b] hover:bg-red-700'}`}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="animate-spin inline mr-2 w-5 h-5" />
                                Deleting...
                            </>
                        ) : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ExpenseTable = () => {

    const { access_token } = useSelector((state) => state.auth);

    const [openNewExpenseSidebar, setopenNewExpenseSidebar] = useState(false);
    const [openEditExpenseSidebar, setopenEditExpenseSidebar] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);


    const [importModal, setImportModal] = useState(false);


    const [deleteModal, setDeleteModal] = useState(false);
    const [editDeleteExpenseId, setEditDeleteExpenseId] = useState(null);

     const [triggerGetAll, { data, isSuccess }] = useLazyGetAllExpenseQuery({ access_token });
    const [deleteExpense, { isLoading: isSingleDeleting }] = useDeleteExpenseMutation();
    const [uploadExpenseWithFile] = useUploadExpenseWithFileMutation();

    // Import State
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [importError, setImportError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Fixed items per page for visual demo
    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    // --- Utility Functions ---

    const formatDate = (dateString) => {
            try {
                const date = new Date(dateString);
                return format(date, 'dd-MM-yyyy HH:mm');
            } catch (error) {
                console.error("Error formatting date:", error);
                return dateString;
            }
        }

    // --- Handlers ---

    const toggleSidebar = () => setopenNewExpenseSidebar(prev => !prev);
    const toggleEditSidebar = () => setopenEditExpenseSidebar(prev => !prev);
    const showImportModal = () => {
        setImportModal(prev => !prev);
        if (importModal) { // Reset state when closing
            setSelectedFile(null);
            setImportError(null);
        }
    }
    const showDeleteModal = (isBatch = false) => {
        setEditDeleteExpenseId(isBatch ? 'BATCH_DELETE' : null); // Sentinel value for batch delete
        setDeleteModal(prev => !prev);
    };

    // --- Selection Handlers ---

    const handleSelectAll = (event) => {
        const isSelected = event.target.checked;
        // Only select items currently on the page if you are implementing true server-side pagination
        // For client-side, select all visible items
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

    // --- Delete Handlers ---

    const handleSingleDeleteExpense = async () => {
        if (!editDeleteExpenseId || editDeleteExpenseId === 'BATCH_DELETE') return;

        try {
            await deleteExpense({
                id: editDeleteExpenseId,
                access_token: access_token,
            });
            
            // Optimistically update UI
            setExpenses(prev => prev.filter(e => e.id !== editDeleteExpenseId));
            setDeleteModal(false);
            setEditDeleteExpenseId(null);
            setSelectedExpenses(prev => prev.filter(id => id !== editDeleteExpenseId)); // Update batch selection if deleted
            
        } catch (error) {
            console.error("Failed to delete single expense:", error);
        }
    };

    const handleBatchDelete = async () => {
        if (selectedExpenses.length === 0) {
            setDeleteModal(false);
            return;
        }

        try {
            // In a real app, send a single request for batch deletion for efficiency.
            // Here, we simulate by iterating over single delete for demonstration.
            const successfulDeletions = [];
            for (const id of selectedExpenses) {
                try {
                    await deleteExpense({ id, access_token });
                    successfulDeletions.push(id);
                } catch (error) {
                    console.error(`Failed to delete expense ${id} in batch:`, error);
                }
            }

            // After successful deletion of all selected, clear state
            setExpenses(prev => prev.filter(e => !successfulDeletions.includes(e.id)));
            setSelectedExpenses([]);
            setDeleteModal(false);

        } catch (error) {
            console.error("Failed to batch delete:", error);
            setDeleteModal(false);
        }
    };

    const handleDeleteExpense = () => {
        if (editDeleteExpenseId === 'BATCH_DELETE') {
            handleBatchDelete();
        } else {
            handleSingleDeleteExpense();
        }
    };

    // --- Import Handlers ---

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImportError(null);
        }
    };

    const handleImportSubmit = async () => {
        if (!selectedFile) {
            setImportError("Please select a file to upload.");
            return;
        }

        setIsUploading(true);
        setImportError(null);

        try {
            const response = await uploadExpenseWithFile({ file: selectedFile, access_token });

            if (response.error) {
                setImportError("Error uploading file. Please check the file format.");
            } else {
                setImportModal(false);
                setSelectedFile(null);
                // Trigger refetch to show new data
                triggerGetAll({ access_token });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            setImportError("An unexpected error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };


    // --- Pagination Logic ---

    // const indexOfLastExpense = currentPage * itemsPerPage;
    // const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
    // const currentExpenses = useMemo(() => 
    //     expenses.slice(indexOfFirstExpense, indexOfLastExpense),
    //     [expenses, indexOfFirstExpense, indexOfLastExpense]
    // );

    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

     const indexOfLastExpense = currentPage * itemsPerPage;
    const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
    const currentExpenses = useMemo(() => 
        expenses.slice(indexOfFirstExpense, indexOfLastExpense),
        [expenses, indexOfFirstExpense, indexOfLastExpense]
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Dynamic Pages Calculation for limited view (max 5 pages)
    const pagesToRender = useMemo(() => {
        const maxPagesToShow = 5;
        let startPage, endPage;
        
        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const half = Math.floor(maxPagesToShow / 2); // 2
            
            // Try to center the current page
            startPage = currentPage - half;
            endPage = currentPage + half;

            // Handle shifting for the start boundary (ensure start is not less than 1)
            if (startPage < 1) {
                startPage = 1;
                endPage = maxPagesToShow;
            }

            // Handle shifting for the end boundary (ensure end is not greater than totalPages)
            if (endPage > totalPages) {
                endPage = totalPages;
                // Shift start back to ensure maxPagesToShow pages are visible
                startPage = totalPages - maxPagesToShow + 1;
            }

            // Final check to prevent startPage going below 1 after adjusting for end boundary
            if (startPage < 1) startPage = 1; 
        }

        // Create an array from startPage to endPage
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }, [totalPages, currentPage]);

    // --- Effects ---

    useEffect(() => {
        // In a real app, you would use RTK Query's 'data' and 'isSuccess' state directly
        if (isSuccess && data && data.data) {
            if (data.error === false) {
                setExpenses(data.data); 
            }
        }
    }, [data, isSuccess]);

    useEffect(() => {
        // Trigger fetch on initial load and after data manipulation
        triggerGetAll({ access_token });
    }, [access_token, openNewExpenseSidebar, openEditExpenseSidebar, deleteModal, triggerGetAll]);
    
    // Ensure current page is valid after data changes
    useEffect(() => {
        const newTotalPages = Math.ceil(expenses.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (expenses.length > 0 && currentPage === 0) {
             setCurrentPage(1); // Set to 1 if it somehow became 0
        }
    }, [expenses.length, itemsPerPage, currentPage]);

    // Determine which modal message to show
    const isBatchDelete = editDeleteExpenseId === 'BATCH_DELETE';
    const deleteTitle = isBatchDelete ? 'Confirm Batch Delete' : 'Confirm Delete';
    const deleteMessage = isBatchDelete 
        ? `Are you sure you want to delete the ${selectedExpenses.length} selected entries? This action cannot be undone.`
        : 'Are you sure you want to delete this entry? This action cannot be undone.';
    const isDeleting = isSingleDeleting; 

    return (
      <div className="w-full min-h-screen font-sans">
            {/* Expanded the container size to max-w-screen-2xl */}
            <div className="flex flex-col mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Transaction Log</h1>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-100">
                        <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
                            <input
                                type="text"
                                className="block p-3 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-red-500 focus:border-red-500 transition duration-150"
                                placeholder="Search records by name, category, or amount..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {selectedExpenses.length > 0 && (
                                <button
                                    className="bg-red-500 text-white rounded-lg flex items-center px-4 py-2 text-sm font-medium hover:bg-red-600 transition duration-150 shadow-md"
                                    onClick={() => showDeleteModal(true)}
                                >
                                    <Trash2 className="w-5 h-5 mr-1" />
                                    Delete ({selectedExpenses.length})
                                </button>
                            )}
                            <button
                                className="bg-blue-600 text-white rounded-lg flex items-center px-4 py-2 text-sm font-medium hover:bg-blue-700 transition duration-150 shadow-md"
                                onClick={showImportModal}>
                                <Upload className="w-5 h-5 mr-1" />
                                Import
                            </button>
                            <button
                                onClick={toggleSidebar}
                                className="bg-green-600 text-white rounded-lg flex items-center px-4 py-2 text-sm font-medium hover:bg-green-700 transition duration-150 shadow-md"
                            >
                                <Plus className="w-5 h-5 mr-1" />
                                Add Expense
                            </button>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500"> {/* Removed table-fixed for a more flexible layout */}
                            <thead className="text-xs text-white uppercase bg-[#c6252b]/90">
                                <tr>
                                    {/* Using relative percentage widths */}
                                    <th scope="col" className="p-4 rounded-tl-lg w-[3%]">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={expenses.length > 0 && selectedExpenses.length === expenses.length}
                                            className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th scope="col" className="px-4 py-3 w-[12%]">Txn Date</th>
                                    <th scope="col" className="px-4 py-3 w-[6%]">Type</th>
                                    <th scope="col" className="px-4 py-3 w-[8%]">Amount</th>
                                    <th scope="col" className="px-4 py-3 w-[15%]">Sender/Receiver</th>
                                    <th scope="col" className="px-4 py-3 w-[10%]">Category</th>
                                    <th scope="col" className="px-4 py-3 w-[10%]">Sub-category</th>
                                    <th scope="col" className="px-4 py-3 w-[8%]">Document</th>
                                    <th scope="col" className="px-4 py-3 w-auto">Remarks</th> {/* w-auto takes up the remaining space */}
                                    <th scope="col" className="px-4 py-3 rounded-tr-lg w-[8%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentExpenses.length > 0 ? (
                                    currentExpenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className={`border-b transition duration-150 ${expense.transaction_type === 'credit' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
                                        >
                                            {/* Applying matching percentage widths to data cells */}
                                            <td className="w-[3%] p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExpenses.includes(expense.id)}
                                                    onChange={() => handleSelectExpense(expense.id)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4 w-[12%] text-gray-900 whitespace-nowrap">{formatDate(expense.transaction_date)}</td>
                                            <td className={`px-4 py-4 w-[6%] font-semibold ${expense.transaction_type === 'credit' ? 'text-green-700' : 'text-red-700'}`}>
                                                {expense.transaction_type.charAt(0).toUpperCase() + expense.transaction_type.slice(1)}
                                            </td>
                                            <td className="px-4 py-4 w-[8%] font-bold text-gray-900">Rs {expense.transaction_amount.toFixed(2)}</td>
                                            <td className="px-4 py-4 w-[15%] text-gray-700">{expense.payer_name}</td>
                                            <td className="px-4 py-4 w-[10%] text-gray-700">{expense.debit_category}</td>
                                            <td className="px-4 py-4 w-[10%] text-gray-700">{expense.sub_category}</td>
                                            <td className="px-4 py-4 w-[8%]">
                                                <a href={expense.document_id} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">View Doc</a>
                                            </td>
                                            <td className="px-4 py-4 w-auto text-gray-600">{expense.remarks}</td>
                                            <td className="px-4 py-4 w-[8%] flex gap-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditDeleteExpenseId(expense.id);
                                                        toggleEditSidebar();
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700 transition duration-150 p-1 rounded-full hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditDeleteExpenseId(expense.id);
                                                        showDeleteModal(false);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-full hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center py-8 text-gray-500">
                                            No expenses found. (Please replace placeholder data/hooks with your actual API calls.)
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>            
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-end items-center pt-4 mt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-700 mr-4">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                                >
                                    Previous
                                </button>
                                
                                {/* Render starting ellipsis if pages are skipped */}
                                {pagesToRender[0] > 1 && (
                                    <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
                                )}

                                {pagesToRender.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => paginate(pageNumber)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${currentPage === pageNumber
                                                ? 'bg-[#c6252b] text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                
                                {/* Render ending ellipsis if pages are skipped */}
                                {pagesToRender[pagesToRender.length - 1] < totalPages && (
                                    <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
                                )}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </div>

            {/* Sidebar Mounts */}
            {openNewExpenseSidebar && <AddExpenseSidebar isopen={openNewExpenseSidebar} toggleSidebar={toggleSidebar} />}
            {openEditExpenseSidebar && <EditExpenseSidebar id={editDeleteExpenseId} isopen={openEditExpenseSidebar} toggleSidebar={toggleEditSidebar} />}

            {/* Delete Modal Mount */}
            <DeleteConfirmationModal 
                show={deleteModal}
                onCancel={() => setDeleteModal(false)}
                onDelete={handleDeleteExpense}
                isDeleting={isDeleting}
                title={deleteTitle}
                message={deleteMessage}
            />

            {/* Import Modal */}
            {importModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative transform transition-all">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition"
                            onClick={showImportModal}
                            disabled={isUploading}
                        >
                            <X size={24} />
                        </button>
                
                        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Import Expenses</h2>
                        <p className="text-sm text-gray-600 mb-6 text-center">
                            Upload a spreadsheet (CSV/Excel) file.
                        </p>
                
                        <div 
                            className={`border-2 border-dashed p-6 rounded-lg mb-4 text-center cursor-pointer transition ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                            onClick={() => document.getElementById("file-upload").click()}
                        >
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            {selectedFile 
                                ? <p className="text-sm font-medium text-green-700 truncate">{selectedFile.name}</p>
                                : <p className="text-sm text-gray-500">Click to select file or drag here</p>
                            }
                        </div>

                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />

                        {importError && (
                            <p className="text-red-500 text-xs mt-2 mb-4 text-center">{importError}</p>
                        )}
                
                        <div className="flex justify-center">
                            <button
                                className={`w-full px-6 py-3 rounded-lg text-white font-semibold transition duration-150 ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={handleImportSubmit}
                                disabled={isUploading || !selectedFile}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin inline mr-2 w-5 h-5" />
                                        Uploading...
                                    </>
                                ) : 'Start Import'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;