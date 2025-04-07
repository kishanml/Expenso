import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAddExpenseMutation } from "../../services/expenseApi";
import { useSelector } from "react-redux";
import {getCurrentDateTimeLocal} from "../../constants/constant"


const AddExpenseSidebar = ({ isopen, toggleSidebar }) => {
    const { access_token } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        transaction_date: new Date().toISOString().slice(0, 20),
        transaction_type: "Debit",
        transaction_amount: "",
        payer_name: "",
        debit_category: "Bills",
        sub_category: "",
        documents_location: [],
        remarks: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [addExpense, { isAddingExpenseLoading }] = useAddExpenseMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();

        formData.transaction_type = formData.transaction_type.toLowerCase();
        formData.debit_category = formData.debit_category.toLowerCase();

        const res = await addExpense({ expenseData: formData, access_token });

        if (res.data.error === false) {
            toggleSidebar();
        }

        console.log(res);
    };

    return (
        <>
            {isopen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside
                className={`fixed top-0 right-0 z-40 w-[30%] h-screen transition-transform bg-white p-5 shadow-lg overflow-y-auto ${
                    isopen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center border-b pb-3 mb-5 ">
                    <h1 className="text-2xl font-medium">
                        Enter Transaction Details
                    </h1>
                    <button onClick={toggleSidebar}>
                        <IoIosCloseCircleOutline
                            size={40}
                            className="text-gray-400"
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Transaction Type
                        </label>
                        <small className="text-sm mb-2  text-gray-500">
                            Select whether this is a debit or credit
                            transaction.
                        </small>
                        <select
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        >
                            <option value="Debit">Debit</option>
                            <option value="Credit">Credit</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Transaction Amount
                        </label>
                        <small className="text-sm mb-2 text-gray-500">
                            Enter the transaction amount.
                        </small>
                        <input
                            type="number"
                            name="transaction_amount"
                            min="0"
                            value={formData.transaction_amount}
                            onChange={handleChange}
                            required
                            className="p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Transaction Datetime
                        </label>
                        <small className="text-sm mb-2 text-gray-500">
                            The date and time of the transaction.
                        </small>
                        <input
                            type="datetime-local"
                            name="transaction_date"
                            value={formData.transaction_date}
                            onChange={handleChange}
                            max={getCurrentDateTimeLocal()}
                            className="p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Payer Name
                        </label>
                        <small className="text-sm mb-2 text-gray-500">
                            Enter the name of the payer.
                        </small>
                        <input
                            type="text"
                            name="payer_name"
                            value={formData.payer_name}
                            onChange={handleChange}
                            required
                            className="p-2 border rounded"
                        />
                    </div>

                    {formData.type === "Credit" ? (
                        <div className="flex flex-col">
                            <label className="text-lg font-medium">
                                Credit Category
                            </label>
                            <select
                                name="category"
                                value={formData.debit_category}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            >
                                <option value="Fixed">Fixed</option>
                                <option value="Variable">Variable</option>
                                <small className="text-sm mb-2 text-gray-500">
                                    Select the credit category.
                                </small>
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <label className="text-lg font-medium">
                                Debit Category
                            </label>
                            <select
                                name="debit_category"
                                value={formData.debit_category}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            >
                                <option value="Bills">Bills</option>
                                <option value="Wants">Wants</option>
                                <option value="Needs">Needs</option>
                                <small className="text-sm mb-2 text-gray-500">
                                    Select the debit category.
                                </small>
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Subcategory
                        </label>
                        <small className="text-sm mb-2 text-gray-500">
                            Specify a subcategory for better classification.
                        </small>
                        <input
                            type="text"
                            name="sub_category"
                            value={formData.sub_category}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">
                            Documents or Proofs
                        </label>
                        <small className="text-sm mb-2 text-gray-500">
                            Attach any supporting documents.
                        </small>
                        <input
                            type="file"
                            name="documents_location"
                            onChange={handleChange}
                            className="p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-medium">Remarks</label>
                        <small className="text-sm mb-2 text-gray-500">
                            Add any additional notes or remarks.
                        </small>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white p-3 rounded font-medium"
                    >
                        Add Transaction
                    </button>
                </form>
            </aside>
        </>
    );
};

export default AddExpenseSidebar;
