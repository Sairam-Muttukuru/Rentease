import React from 'react';
import { ScrollText, ChevronRight } from 'lucide-react';
import { Card } from '../../ui/card';

const PropertyRules = ({ properties, isDarkMode }) => {
    // Filter properties that have guidelines
    const propertiesWithRules = properties.filter(p => p.guidelines && p.guidelines.trim() !== '');

    if (propertiesWithRules.length === 0) return null;

    return (
        <Card isDarkMode={isDarkMode} className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <ScrollText className="text-violet-500" size={24} />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Rules</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {propertiesWithRules.map((prop) => (
                    <div key={prop.id} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                            <h4 className={`font-bold text-sm uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {prop.name}
                            </h4>
                        </div>
                        <div className={`text-xs space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {prop.guidelines.split(/\r?\n/).filter(line => line.trim() !== '').map((line, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <span className="shrink-0 text-violet-500 font-bold">•</span>
                                    <span className="leading-relaxed">{line.startsWith('•') ? line.substring(1).trim() : line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PropertyRules;
