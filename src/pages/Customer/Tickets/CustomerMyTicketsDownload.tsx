import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';

const CustomerMyTicketsDownload: React.FC = () => {
    const [searchParams] = useSearchParams();
    const ticketId = searchParams.get('ticketId');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ticketId) {
            setTimeout(() => {
                setDownloadUrl(`/api/tickets/${ticketId}/download.pdf`);
                setReady(true);
            }, 1000);
        }
    }, [ticketId]);

    if (!ticketId) {
        return <div className="p-8 text-center text-red-600">No ticket specified.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]"
        >
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
                <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Download Ticket</h1>
                <p className="text-gray-500 text-sm mb-6">Ticket ID: {ticketId}</p>

                {!ready ? (
                    <div className="space-y-3">
                        <div className="animate-pulse flex justify-center">
                            <div className="h-2 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <p className="text-sm text-gray-400">Preparing your ticket...</p>
                    </div>
                ) : (
                    <motion.a
                        href={downloadUrl}
                        download
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Download className="h-5 w-5" /> Download PDF
                    </motion.a>
                )}

                {ready && (
                    <div className="mt-4 text-green-600 text-sm flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Ready to download
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CustomerMyTicketsDownload;