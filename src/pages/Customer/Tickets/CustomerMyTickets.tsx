import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, Download } from 'lucide-react';

interface Ticket {
    id: string;
    eventName: string;
    date: string;
    venue: string;
    image?: string;
}

const CustomerMyTickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setTickets([
                { id: 'T1001', eventName: 'The Lion King', date: '2025-05-15', venue: 'Grand Theater', image: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=400&h=200&fit=crop' },
                { id: 'T1002', eventName: 'Hamilton', date: '2025-06-10', venue: 'City Cinema', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=200&fit=crop' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading your tickets...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tickets</h1>
                    <p className="text-gray-500">Your upcoming shows and passes</p>
                </div>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                        <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">You haven't booked any tickets yet.</p>
                        <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">Browse shows →</Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tickets.map((ticket, idx) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col sm:flex-row"
                            >
                                {ticket.image && (
                                    <img src={ticket.image} alt={ticket.eventName} className="sm:w-48 h-48 object-cover" />
                                )}
                                <div className="flex-1 p-5">
                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{ticket.eventName}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(ticket.date).toLocaleDateString()}
                                                <MapPin className="h-4 w-4 ml-2" />
                                                {ticket.venue}
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Confirmed</span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Link
                                            to={`/my-tickets/qr?ticketId=${ticket.id}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                                        >
                                            <QrCode className="h-4 w-4" /> Show QR
                                        </Link>
                                        <Link
                                            to={`/my-tickets/download?ticketId=${ticket.id}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                        >
                                            <Download className="h-4 w-4" /> Download PDF
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CustomerMyTickets;