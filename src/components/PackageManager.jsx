import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';

const availableGames = ['PUBG', 'Free Fire', 'PES']; // You can expand this list

const getUnitForGame = (game) => {
    switch (game) {
        case 'PUBG': return 'UC';
        case 'Free Fire': return 'Diamonds';
        case 'PES': return 'Coins';
        default: return '';
    }
};

const PackageManager = ({ packages, onSave, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPackage, setCurrentPackage] = useState({ game: 'PUBG', amount: '', price: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const unit = getUnitForGame(currentPackage.game);
        const name = `${currentPackage.amount} ${unit}`;
        
        const packageToSave = {
            id: currentPackage.id,
            game: currentPackage.game,
            name: name,
            price: Number(currentPackage.price),
        };
        
        onSave(packageToSave);
        resetForm();
    };

    const handleEdit = (pkg) => {
        setEditMode(true);
        const amount = pkg.name.split(' ')[0];
        setCurrentPackage({ ...pkg, amount });
        if (!isExpanded) setIsExpanded(true);
    };

    const resetForm = () => {
        setEditMode(false);
        setCurrentPackage({ game: 'PUBG', amount: '', price: '' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <button
                className="w-full flex justify-between items-center text-xl font-semibold text-gray-700 dark:text-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>Manage Packages</span>
                <FaChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] mt-6' : 'max-h-0'}`}>
                {/* Package Form */}
                <form onSubmit={handleFormSubmit} className="mb-8 p-4 border rounded-lg dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">{editMode ? 'Edit Package' : 'Add New Package'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={currentPackage.game}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, game: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            {availableGames.map(game => <option key={game} value={game}>{game}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Amount (e.g., 60)"
                            value={currentPackage.amount}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, amount: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={currentPackage.price}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {editMode ? 'Update Package' : 'Add Package'}
                        </button>
                        {editMode && (
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Package List */}
                <div className="space-y-4">
                    {packages && packages.length > 0 ? (
                        packages.map(pkg => (
                            <div key={pkg.id} className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <span className="font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                        {pkg.game}
                                    </span>
                                    <span className="font-semibold">{pkg.name}</span> - 
                                    <span className="text-gray-600 dark:text-gray-400"> EGP {pkg.price}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(pkg)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FaEdit /></button>
                                    <button onClick={() => onDelete(pkg.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"><FaTrash /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No packages yet. Add one above.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageManager; 