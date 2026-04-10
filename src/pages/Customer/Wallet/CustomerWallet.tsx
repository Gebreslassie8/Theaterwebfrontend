import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Plus, History, Eye, EyeOff, TrendingUp, CreditCard } from 'lucide-react';

const CustomerWallet: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        setTimeout(() => setBalance(1250.75), 500);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wallet</h1>
                    <p className="text-gray-500 mt-1">Manage your funds and transactions</p>
                </div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl mb-8"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm">Total Balance</p>
                            <div className="flex items-center gap-3 mt-1">
                                <h2 className="text-3xl sm:text-4xl font-bold">
                                    {showBalance ? (balance !== null ? `$${balance.toFixed(2)}` : '---') : '•••••'}
                                </h2>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition"
                                >
                                    {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <Wallet className="h-10 w-10 text-white/40" />
                    </div>
                    <div className="mt-6 flex gap-4">
                        <Link
                            to="/customer/wallet/add"
                            className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl hover:bg-white/30 transition"
                        >
                            <Plus className="h-4 w-4" /> Add Funds
                        </Link>
                        <Link
                            to="/customer/wallet/transactions"
                            className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl hover:bg-white/30 transition"
                        >
                            <History className="h-4 w-4" /> History
                        </Link>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCardSmall
                        title="Total Spent (Lifetime)"
                        value="$342.00"
                        icon={TrendingUp}
                        color="bg-green-100 text-green-600"
                    />
                    <StatCardSmall
                        title="Last Transaction"
                        value="Dec 15, 2024"
                        icon={CreditCard}
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCardSmall
                        title="Reward Points"
                        value="1,250"
                        icon={TrendingUp}
                        color="bg-yellow-100 text-yellow-600"
                    />
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">Ticket Purchase</p>
                                    <p className="text-xs text-gray-500">Dec {15 - i}, 2024</p>
                                </div>
                                <p className="font-semibold text-red-600">-$45.00</p>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/customer/wallet/transactions"
                        className="mt-4 text-purple-600 text-sm hover:underline flex items-center gap-1"
                    >
                        View all transactions →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const StatCardSmall: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default CustomerWallet;