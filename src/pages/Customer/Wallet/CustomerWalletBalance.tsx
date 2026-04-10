import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerWalletBalance: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setBalance(1250.75);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Current Balance</h1>
                    {loading ? (
                        <div className="h-16 w-48 mx-auto bg-gray-200 animate-pulse rounded-lg"></div>
                    ) : (
                        <p className="text-5xl font-bold text-purple-600 my-4">
                            ${balance?.toFixed(2)}
                        </p>
                    )}
                    <div className="mt-6 flex justify-center gap-4">
                        <Link
                            to="/customer/wallet/add"
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            <ArrowUpRight className="h-4 w-4" /> Add Funds
                        </Link>
                        <Link
                            to="/customer/wallet/transactions"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <Clock className="h-4 w-4" /> History
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerWalletBalance;