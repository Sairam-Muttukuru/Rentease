import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card isDarkMode={isDarkMode} className="w-full max-w-sm p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-2 border-rose-500/20">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
                        <Trash2 size={32} className="text-rose-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                        <p className="text-slate-500 mt-2 text-sm max-w-[250px] mx-auto">{message}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <LandlordButton onClick={onClose} variant="secondary" className="justify-center" isDarkMode={isDarkMode}>Cancel</LandlordButton>
                    <LandlordButton onClick={onConfirm} className="bg-rose-500 hover:bg-rose-600 text-white justify-center border-none shadow-lg shadow-rose-500/20">Delete</LandlordButton>
                </div>
            </Card>
        </div>
    );
};

export default DeleteConfirmationModal;
