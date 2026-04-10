import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
}

const CustomerWalletTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

    useEffect(() => {
        const mock: Transaction[] = [
            { id: 'TR-001', date: '2025-04-01', description: 'Ticket: The Lion King', amount: 45, type: 'debit' },
            { id: 'TR-002', date: '2025-03-28', description: 'Wallet Top-up', amount: 100, type: 'credit' },
            { id: 'TR-003', date: '2025-03-25', description: 'Ticket: Hamilton', amount: 65, type: 'debit' },
            { id: 'TR-004', date: '2025-03-20', description: 'Referral Bonus', amount: 20, type: 'credit' },
        ];
        setTransactions(mock);
    }, []);

    const filtered = transactions.filter(t => filter === 'all' || t.type === filter);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                        <p className="text-gray-500 text-sm">All your wallet transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('credit')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Credits
                        </button>
                        <button
                            onClick={() => setFilter('debit')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'debit' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Debits
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">ID</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Description</th>
                                    <th className="text-right p-4 text-sm font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((tx, idx) => (
                                    <motion.tr
                                        key={tx.id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-sm text-gray-900">{tx.id}</td>
                                        <td className="p-4 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm text-gray-900">{tx.description}</td>
                                        <td className={`p-4 text-sm font-semibold text-right ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerWalletTransactions;