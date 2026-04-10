import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Bell, Lock, Save, CheckCircle } from 'lucide-react';

interface Profile {
    name: string;
    email: string;
    phone: string;
    notifications: boolean;
}

const CustomerSettings: React.FC = () => {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        email: '',
        phone: '',
        notifications: true,
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setProfile({
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                notifications: true,
            });
            setLoading(false);
        }, 500);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 500);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500">Manage your profile and preferences</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 border-b pb-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 border-b pb-3">
                                <Bell className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                            </div>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={profile.notifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-purple-600 rounded"
                                />
                                <span className="text-gray-700">Receive email updates about new shows and offers</span>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 border-b pb-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                            </div>
                            <button
                                type="button"
                                className="text-purple-600 text-sm hover:underline"
                            >
                                Change Password →
                            </button>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition"
                            >
                                <Save className="h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle className="h-5 w-5" /> Settings saved!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default CustomerSettings;