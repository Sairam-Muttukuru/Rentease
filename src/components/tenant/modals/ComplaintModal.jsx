import React from 'react';
import { X, Camera } from 'lucide-react';
import Button from '../ui/Button';

const ComplaintModal = ({
    isDarkMode,
    setShowComplaintModal,
    handleSubmitComplaint,
    handleImageChange,
    complaintImages,
    handleRemoveImage,
    isUploading,
    t
}) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

            <div className={`p-6 border-b flex justify-between items-center transition-colors duration-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>New Complaint</h3>
                <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Issue Title</label>
                        <input required name="title" type="text" placeholder="e.g. Broken Lock" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'}`} />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
                        <select name="category" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                            <option>Plumbing</option>
                            <option>Electrical</option>
                            <option>HVAC</option>
                            <option>Appliance</option>
                            <option>Pest Control</option>
                            <option>Structural Issue</option>
                            <option>Noise Complaint</option>
                            <option>Security Concern</option>
                            <option>General</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Priority Level</label>
                    <select name="priority_level" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                    <textarea required name="description" rows="4" placeholder="Please describe the issue in detail..." className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'}`}></textarea>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload Images</label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer hover:bg-opacity-50 mb-4 ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="complaint-images" />
                        <label htmlFor="complaint-images" className="cursor-pointer flex flex-col items-center gap-2">
                            <Camera size={24} className="text-violet-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Click to upload photos
                            </span>
                        </label>
                    </div>

                    {/* Uploaded Images Grid */}
                    {complaintImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {complaintImages.map((url, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden h-20 border border-slate-200 dark:border-slate-700">
                                    <img src={url} alt="Proof" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowComplaintModal(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Submit Complaint"}
                    </Button>
                </div>
            </form>
        </div>
    </div>
);

export default ComplaintModal;
