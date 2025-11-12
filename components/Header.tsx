import React from 'react';

const Header: React.FC = () => {
    const { Lucide } = (window as any);
    const Paintbrush = Lucide?.Paintbrush;

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-center">
                 {Paintbrush && <Paintbrush className="h-8 w-8 text-rose-500 mr-3" />}
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    AI Coloring Book Creator
                </h1>
            </div>
        </header>
    );
};

export default Header;
