// src/pages/Salesperson/mockdata/mockdatayReportOfSlaes.tsx

export interface Seat {
  seatId: string;
  seatLabel: string;
  qrData: string;
}

export interface SaleRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  showTitle: string;
  showDate: string;
  showTime: string;
  seats: string;
  tickets: Seat[];
  seatType: string;
  totalAmount: number;
  paymentMethod: string;
  saleDate: string;
  salesperson: string;
}

export const defaultMockSalesRecords: SaleRecord[] = [
  {
    id: 'demo1',
    customerName: 'John Doe',
    customerPhone: '555-1234',
    showTitle: 'The Lion King',
    showDate: '2026-05-10',
    showTime: '14:00',
    seats: 'A1, A2',
    tickets: [
      { seatId: 'A1', seatLabel: 'A1', qrData: 'qr1' },
      { seatId: 'A2', seatLabel: 'A2', qrData: 'qr2' },
    ],
    seatType: 'Standard',
    totalAmount: 120,
    paymentMethod: 'cash',
    saleDate: new Date().toISOString(),
    salesperson: 'Alice',
  },
  {
    id: 'demo2',
    customerName: 'Jane Smith',
    customerPhone: '555-5678',
    showTitle: 'Hamilton',
    showDate: '2026-05-11',
    showTime: '19:30',
    seats: 'B5',
    tickets: [{ seatId: 'B5', seatLabel: 'B5', qrData: 'qr3' }],
    seatType: 'Standard',
    totalAmount: 65,
    paymentMethod: 'card',
    saleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    salesperson: 'Bob',
  },
  {
    id: 'demo3',
    customerName: 'Sam Wilson',
    customerPhone: '555-9012',
    showTitle: 'Wicked',
    showDate: '2026-05-12',
    showTime: '20:00',
    seats: 'C10, C11',
    tickets: [
      { seatId: 'C10', seatLabel: 'C10', qrData: 'qr4' },
      { seatId: 'C11', seatLabel: 'C11', qrData: 'qr5' },
    ],
    seatType: 'Standard',
    totalAmount: 150,
    paymentMethod: 'cash',
    saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    salesperson: 'Alice',
  },
  {
    id: 'demo4',
    customerName: 'Past Customer',
    customerPhone: '555-0000',
    showTitle: 'Old Show',
    showDate: '2025-03-15',
    showTime: '18:00',
    seats: 'D1',
    tickets: [{ seatId: 'D1', seatLabel: 'D1', qrData: 'qr6' }],
    seatType: 'Standard',
    totalAmount: 80,
    paymentMethod: 'cash',
    saleDate: '2025-03-15T10:00:00Z',
    salesperson: 'Charlie',
  },
];