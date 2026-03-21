// /* --- ADD RESIDENT MODAL --- */
// const AddResidentModal = ({ isOpen, onClose, tenantId, onResidentAdded, isDarkMode }) => {
//     if (!isOpen) return null;

//     const [formData, setFormData] = useState({
//         full_name: "",
//         relation: "Other",
//         phone: "",
//         email: ""
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.full_name) return;
//         setIsSubmitting(true);
//         try {
//             const token = localStorage.getItem('token');
//             await axios.post(`api/tenants/${tenantId}/members`, {
//                 ...formData
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             onResidentAdded();
//             onClose();
//             showNotificationToast("Resident added successfully", "success");
//         } catch (error) {
//             console.error("Error adding resident:", error);
//             showNotificationToast("Failed to add resident", "error");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
//             <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl transform transition-all scale-100 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Resident</h3>
//                         <p className="text-sm text-slate-500 font-medium mt-1">Add a new member to this unit</p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="space-y-2">
//                         <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
//                         <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
//                             <User size={18} className="text-slate-400 mr-3" />
//                             <input
//                                 type="text"
//                                 placeholder="e.g. John Doe"
//                                 className="bg-transparent border-none outline-none w-full text-sm font-medium"
//                                 value={formData.full_name}
//                                 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Relation</label>
//                         <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
//                             <Users size={18} className="text-slate-400 mr-3" />
//                             <select
//                                 className={`bg-transparent border-none outline-none w-full text-sm font-medium appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
//                                 value={formData.relation}
//                                 onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
//                             >
//                                 <option value="Other">Other</option>
//                                 <option value="Wife">Wife</option>
//                                 <option value="Husband">Husband</option>
//                                 <option value="Son">Son</option>
//                                 <option value="Daughter">Daughter</option>
//                                 <option value="Father">Father</option>
//                                 <option value="Mother">Mother</option>
//                                 <option value="Brother">Brother</option>
//                                 <option value="Sister">Sister</option>
//                                 <option value="Friend">Friend</option>
//                             </select>
//                             <ChevronDown size={14} className="text-slate-400" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
//                             <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
//                                 <Phone size={18} className="text-slate-400 mr-3" />
//                                 <input
//                                     type="tel"
//                                     placeholder="Optional"
//                                     className="bg-transparent border-none outline-none w-full text-sm font-medium"
//                                     value={formData.phone}
//                                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                 />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
//                             <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
//                                 <Mail size={18} className="text-slate-400 mr-3" />
//                                 <input
//                                     type="email"
//                                     placeholder="Optional"
//                                     className="bg-transparent border-none outline-none w-full text-sm font-medium"
//                                     value={formData.email}
//                                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="flex-1 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
//                         >
//                             {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add Resident"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
