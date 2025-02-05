import React, { useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

const AddExpenseSidebar = ({ isopen, toggleSidebar }) => {
   const [formData, setFormData] = useState({
      expense_datetime: new Date().toISOString().slice(0, 16),
      type: "Debit",
      amount: "",
      payer: "",
      category: "",
      subcategory: "",
      document: "",
      remarks: ""
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
   };

   return (
      <>
         {isopen && <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={toggleSidebar}></div>}

         <aside className={`fixed top-0 right-0 z-40 w-[30%] h-screen transition-transform bg-white p-5 shadow-lg overflow-y-auto ${isopen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex justify-between items-center border-b pb-3 mb-5 ">
               <h1 className="text-2xl font-medium">Enter Transaction Details</h1>
               <button onClick={toggleSidebar}>
                  <IoIosCloseCircleOutline size={40} className="text-gray-400" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="flex flex-col">
                  <label className="text-lg font-medium">Transaction Type</label>
                  <small className="text-sm mb-2  text-gray-500">Select whether this is a debit or credit transaction.</small>
                  <select name="type" value={formData.type} onChange={handleChange} className="p-2 border rounded">
                     <option value="Debit">Debit</option>
                     <option value="Credit">Credit</option>
                  </select>
               </div>

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Transaction Amount</label>
                  <small className="text-sm mb-2 text-gray-500">Enter the transaction amount.</small>
                  <input type="number" name="amount" min="0"  value={formData.amount} onChange={handleChange} required className="p-2 border rounded" />
               </div>

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Transaction Datetime</label>
                  <small className="text-sm mb-2 text-gray-500">The date and time of the transaction.</small>
                  <input type="datetime-local" name="expense_datetime" value={formData.expense_datetime} onChange={handleChange} className="p-2 border rounded" required />
               </div>

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Payer Name</label>
                  <small className="text-sm mb-2 text-gray-500">Enter the name of the payer.</small>
                  <input type="text" name="payer" value={formData.payer} onChange={handleChange} required className="p-2 border rounded" />
               </div>

               {formData.type === "Credit" ? (
                  <div className="flex flex-col">
                     <label className="text-lg font-medium">Credit Category</label>
                     <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
                        <option value="Fixed">Fixed</option>
                        <option value="Variable">Variable</option>
                     <small className="text-sm mb-2 text-gray-500">Select the credit category.</small>
                     </select>
                  </div>
               ) : (
                  <div className="flex flex-col">
                     <label className="text-lg font-medium">Debit Category</label>
                     <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
                        <option value="Bills">Bills</option>
                        <option value="Wants">Wants</option>
                        <option value="Needs">Needs</option>
                     <small className="text-sm mb-2 text-gray-500">Select the debit category.</small>
                     </select>
                  </div>
               )}

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Subcategory</label>
                  <small className="text-sm mb-2 text-gray-500">Specify a subcategory for better classification.</small>
                  <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} className="p-2 border rounded" />
               </div>

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Documents or Proofs</label>
                  <small className="text-sm mb-2 text-gray-500">Attach any supporting documents.</small>
                  <input type="file" name="document" onChange={handleChange} className="p-2 border rounded" />
               </div>

               <div className="flex flex-col">
                  <label className="text-lg font-medium">Remarks</label>
                  <small className="text-sm mb-2 text-gray-500">Add any additional notes or remarks.</small>
                  <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="p-2 border rounded"></textarea>
               </div>

               <button type="submit" className="w-full bg-red-500 text-white p-3 rounded font-medium">Add Transaction</button>
            </form>
         </aside>
      </>
   );
};

export default AddExpenseSidebar;
