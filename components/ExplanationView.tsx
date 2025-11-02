
import React, { useState, useMemo } from 'react';
import { AdvancedExplanation, ExplanationLevel } from '../types';
import { ICONS } from '../constants';
import usePdfExporter, { exportToPdf } from '../hooks/usePdfExporter';
import Loading from './Loading';

interface LevelBadgeProps {
    level: ExplanationLevel;
    active: boolean;
    onClick: () => void;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, active, onClick }) => {
    const levelConfig = {
        [ExplanationLevel.ELI5]: { label: "ELI5", color: "bg-[#6affb8]", textColor: "text-green-900" },
        [ExplanationLevel.Intermediate]: { label: "Intermediate", color: "bg-[#6ea8ff]", textColor: "text-blue-900" },
        [ExplanationLevel.Advanced]: { label: "Advanced", color: "bg-[#9b8cff]", textColor: "text-indigo-900" },
        [ExplanationLevel.Technical]: { label: "Technical", color: "bg-[#ff6ea8]", textColor: "text-pink-900" },
    };
    const { label, color, textColor } = levelConfig[level];

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${active
                    ? `${color} ${textColor} shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-[#0b0d10] ring-white/50`
                    : 'text-slate-300 bg-white/5 hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );
};

const SectionCard: React.FC<{ title: string; content: React.ReactNode; icon: React.ReactNode; }> = ({ title, content, icon }) => (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-6 transition-all hover:bg-white/[.06] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{content}</div>
    </div>
);

const ListCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; }> = ({ title, items, icon }) => (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-6">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <ul className="space-y-3">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6ea8ff] mt-2" />
                    <span className="flex-1">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const GlossaryCard: React.FC<{ glossary: AdvancedExplanation['glossary']; icon: React.ReactNode; }> = ({ glossary, icon }) => (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-6">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-100">Glossary</h3>
        </div>
        <div className="space-y-4">
            {glossary.map((item, i) => (
                <div key={i} className="border-l-2 border-[#6ea8ff] pl-4">
                    <h4 className="text-sm font-semibold text-[#6ea8ff] mb-1">{item.term}</h4>
                    <p className="text-sm text-slate-400">{item.definition}</p>
                </div>
            ))}
        </div>
    </div>
);


interface ExplanationViewProps {
  explanation: AdvancedExplanation;
  onReset: () => void;
  rawTranscript: string;
}

const ExplanationView: React.FC<ExplanationViewProps> = ({ explanation, onReset, rawTranscript }) => {
    const [activeLevel, setActiveLevel] = useState<ExplanationLevel>(ExplanationLevel.Intermediate);
    const pdfReady = usePdfExporter();

    const currentExplanation = useMemo(() => {
        switch (activeLevel) {
            case ExplanationLevel.ELI5: return explanation.eli5;
            case ExplanationLevel.Intermediate: return explanation.intermediate;
            case ExplanationLevel.Advanced: return explanation.advanced;
            case ExplanationLevel.Technical: return explanation.technicalDepth;
            default: return explanation.intermediate;
        }
    }, [activeLevel, explanation]);

    const handleExport = () => {
        if(pdfReady) {
            exportToPdf(explanation, rawTranscript);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{explanation.subject}</h1>
                    <p className="mt-2 text-base text-slate-400 max-w-2xl">{explanation.coreMessage}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                     <button
                        onClick={handleExport}
                        disabled={!pdfReady}
                        className="px-4 py-2 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {pdfReady ? 'Export to PDF' : <Loading className="w-4 h-4" />}
                    </button>
                    <button onClick={onReset} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors">
                        New Topic
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl border border-white/10 bg-white/[.04]">
                        <h2 className="text-xl font-bold mb-4 text-slate-100">Multi-Level Explanation</h2>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {(Object.values(ExplanationLevel) as ExplanationLevel[]).map(level => (
                                <LevelBadge
                                    key={level}
                                    level={level}
                                    active={activeLevel === level}
                                    onClick={() => setActiveLevel(level)}
                                />
                            ))}
                        </div>
                        <p className="text-slate-300 leading-relaxed transition-opacity duration-300">{currentExplanation}</p>
                    </div>

                    <SectionCard title="Analogy" content={explanation.analogy} icon={ICONS.lightbulb} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <SectionCard title="Example" content={explanation.example} icon={ICONS.check} />
                       <SectionCard title="Counter-Example" content={explanation.counterExample} icon={ICONS.cross} />
                    </div>
                     <SectionCard title="Practical Exercise" content={explanation.practicalExercise} icon={ICONS.pencil} />
                </div>

                {/* Sidebar Column */}
                <div className="md:col-span-1 space-y-6">
                    <GlossaryCard glossary={explanation.glossary} icon={ICONS.book} />
                    <ListCard title="Use Cases" items={explanation.useCases} icon={ICONS.target} />
                    <SectionCard title="Real-World Implementation" content={explanation.realWorldImplementation} icon={ICONS.rocket} />
                </div>
                
                {/* Full Width Section */}
                 <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard title="Historical Context" content={explanation.historicalContext} icon={ICONS.history} />
                    <SectionCard title="Future Implications" content={explanation.futureImplications} icon={ICONS.forward} />
                 </div>
                 <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ListCard title="Common Misconceptions" items={explanation.commonMisconceptions} icon={ICONS.lightbulbOff} />
                    <ListCard title="Related Concepts" items={explanation.relatedConcepts} icon={ICONS.link} />
                </div>
            </main>
        </div>
    );
};

export default ExplanationView;
