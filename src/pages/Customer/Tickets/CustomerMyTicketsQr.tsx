import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2 } from 'lucide-react';

const CustomerMyTicketsQr: React.FC = () => {
    const [searchParams] = useSearchParams();
    const ticketId = searchParams.get('ticketId');
    const [qrImage, setQrImage] = useState('');

    useEffect(() => {
        if (ticketId) {
            setTimeout(() => {
                setQrImage(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${ticketId}`);
            }, 500);
        }
    }, [ticketId]);

    if (!ticketId) {
        return <div className="p-8 text-center text-red-600">No ticket specified.</div>;
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]"
        >
            <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
                <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                    <QrCode className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Ticket QR Code</h1>
                <p className="text-gray-500 text-sm mb-6">Ticket ID: {ticketId}</p>

                {qrImage ? (
                    <motion.img
                        src={qrImage}
                        alt="Ticket QR Code"
                        className="w-48 h-48 mx-auto border rounded-xl shadow-md"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <div className="w-48 h-48 mx-auto bg-gray-100 animate-pulse rounded-xl"></div>
                )}

                <div className="mt-6 flex justify-center gap-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="h-4 w-4" /> Save
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                        <Share2 className="h-4 w-4" /> Share
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">Show this QR code at the venue entrance</p>
            </div>
        </motion.div>
    );
};

export default CustomerMyTicketsQr;