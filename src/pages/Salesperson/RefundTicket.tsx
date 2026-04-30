// src/pages/Salesperson/RefundTicket.tsx
import React, { useState } from 'react';
import { Search, RefreshCw, AlertTriangle } from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';

const RefundTicket: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<any>(null);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState(0);

  const handleSearch = () => {
    if (ticketId === 'T123') setTicket({ id: 'T123', event: 'Summer Concert', amount: 80, seats: 'VIP 12' });
    else alert('Ticket not found');
  };

  const handleRefund = () => {
    const refundAmount = refundType === 'full' ? ticket.amount : partialAmount;
    alert(`Refund processed: $${refundAmount}. Seats ${ticket.seats} are now available.`);
    setTicket(null);
    setTicketId('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cancel / Refund Ticket</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-2 mb-4"><input type="text" placeholder="Ticket ID" value={ticketId} onChange={e => setTicketId(e.target.value)} className="flex-1 p-2 border rounded" /><ReusableButton onClick={handleSearch} icon={Search}>Search</ReusableButton></div>
        {ticket && (<div className="border p-4 rounded-lg"><p><strong>Ticket:</strong> {ticket.id} - {ticket.event}</p><p><strong>Seats:</strong> {ticket.seats}</p><p><strong>Original Amount:</strong> ${ticket.amount}</p><div className="mt-3"><label className="block font-medium">Refund Type</label><select value={refundType} onChange={e => setRefundType(e.target.value as any)} className="w-full p-2 border rounded"><option value="full">Full Refund</option><option value="partial">Partial Refund</option></select>{refundType === 'partial' && <><label className="block mt-2">Partial Amount</label><input type="number" value={partialAmount} onChange={e => setPartialAmount(Number(e.target.value))} className="w-full p-2 border rounded" /></>}</div><div className="mt-4 flex justify-end"><ReusableButton variant="danger" onClick={handleRefund} icon={RefreshCw}>Confirm Refund</ReusableButton></div></div>)}
      </div>
    </div>
  );
};

export default RefundTicket;