import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Lock } from 'lucide-react';

const CustomerWalletAdd: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setMessage(`$${amount} added successfully!`);
            setAmount(0);
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <div className="text-center mb-6">
                        <div className="inline-flex p-3 bg-green-100 rounded-full mb-3">
                            <PlusCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Funds</h1>
                        <p className="text-gray-500 text-sm">Add money to your wallet securely</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                min="1"
                                step="1"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter amount"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 text-xs text-gray-500">
                            <Lock className="h-3 w-3" />
                            Secure payment via Stripe (simulated)
                        </div>
                        <button
                            type="submit"
                            disabled={loading || amount <= 0}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : `Add $${amount || 0}`}
                        </button>
                    </form>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm"
                        >
                            {message}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerWalletAdd;