import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle, Eye, XCircle, Filter, Download, Printer, Search, Building2, User, FileText, CreditCard, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import axios from 'axios';

interface FormData {
    // Business Information
    businessName: string;
    tradeName: string;
    businessType: string;
    businessLicense: string;
    taxId: string;
    yearsInOperation: string;
    businessDescription: string;

    // Contact Information
    ownerName: string;
    ownerPosition: string;
    ownerEmail: string;
    ownerPhone: string;
    secondaryName: string;
    secondaryPosition: string;
    secondaryEmail: string;
    secondaryPhone: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;

    // Theater Details
    theaterName: string;
    theaterLogo: File | null;
    theaterDescription: string;
    theaterEmail: string;
    theaterPhone: string;
    totalHalls: string;
    totalSeats: string;
    services: string[];
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    address: string;
    screenTypes: string[];

    // Documents
    documents: Record<string, File | null>;

    // Pricing Plan
    pricingModel: string;
    contractType: string;
    payoutFrequency: string;
    expeditedEnabled: boolean;

    // Agreements
    acceptMarketing: boolean;
    paymentCompleted: boolean;
    paymentIntentId: string;
}

interface RegistrationRequest extends FormData {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedDate: string;
    rejectionReason?: string;
    rejectionNotes?: string;
    approvedBy?: string;
    approvedDate?: string;
}

// MOCK DATA
const MOCK_REQUESTS: RegistrationRequest[] = [
    {
        id: 'REG001',
        status: 'pending',
        submittedDate: '2024-01-15T10:30:00Z',
        businessName: 'Cinema Plus Entertainment',
        tradeName: 'Cinema Plus',
        businessType: 'LLC',
        businessLicense: 'BL-2024-001',
        taxId: 'TAX-123456789',
        yearsInOperation: '5',
        businessDescription: 'Premium cinema experience with luxury seating. We offer state-of-the-art projection and sound systems, comfortable seating, and a premium food and beverage menu.',
        ownerName: 'John Smith',
        ownerPosition: 'CEO',
        ownerEmail: 'john.smith@cinemaplus.com',
        ownerPhone: '+1 (555) 123-4567',
        secondaryName: 'Sarah Johnson',
        secondaryPosition: 'Operations Manager',
        secondaryEmail: 'sarah@cinemaplus.com',
        secondaryPhone: '+1 (555) 123-4568',
        emergencyName: 'Mike Smith',
        emergencyPhone: '+1 (555) 123-4569',
        emergencyRelation: 'Brother',
        theaterName: 'Cinema Plus Downtown',
        theaterLogo: null,
        theaterDescription: 'State-of-the-art cinema with 8 screens, featuring IMAX and 4DX technology',
        theaterEmail: 'downtown@cinemaplus.com',
        theaterPhone: '+1 (555) 123-4570',
        totalHalls: '8',
        totalSeats: '1200',
        services: ['Food Court', 'VIP Lounge', 'Parking', 'Wheelchair Access'],
        latitude: '40.7128',
        longitude: '-74.0060',
        city: 'New York',
        region: 'NY',
        address: '123 Broadway Street',
        screenTypes: ['IMAX', '4DX', 'Standard', 'Dolby Atmos'],
        documents: {},
        pricingModel: 'per_ticket',
        contractType: 'monthly',
        payoutFrequency: 'weekly',
        expeditedEnabled: true,
        acceptMarketing: true,
        paymentCompleted: true,
        paymentIntentId: 'pi_123456789'
    },
    {
        id: 'REG002',
        status: 'pending',
        submittedDate: '2024-01-14T14:45:00Z',
        businessName: 'Silver Screen Theaters',
        tradeName: 'Silver Screen',
        businessType: 'Corporation',
        businessLicense: 'BL-2024-002',
        taxId: 'TAX-987654321',
        yearsInOperation: '12',
        businessDescription: 'Family-friendly cinema chain with 12 screens, offering discounted tickets for children and seniors.',
        ownerName: 'Emily Davis',
        ownerPosition: 'Owner',
        ownerEmail: 'emily@silverscreen.com',
        ownerPhone: '+1 (555) 234-5678',
        secondaryName: 'Robert Brown',
        secondaryPosition: 'General Manager',
        secondaryEmail: 'robert@silverscreen.com',
        secondaryPhone: '+1 (555) 234-5679',
        emergencyName: 'David Davis',
        emergencyPhone: '+1 (555) 234-5680',
        emergencyRelation: 'Husband',
        theaterName: 'Silver Screen Hollywood',
        theaterLogo: null,
        theaterDescription: 'Classic cinema experience with modern amenities',
        theaterEmail: 'hollywood@silverscreen.com',
        theaterPhone: '+1 (555) 234-5681',
        totalHalls: '12',
        totalSeats: '2500',
        services: ['Concessions', 'Party Rooms', 'Arcade', 'Cafe'],
        latitude: '34.0522',
        longitude: '-118.2437',
        city: 'Los Angeles',
        region: 'CA',
        address: '456 Sunset Boulevard',
        screenTypes: ['Standard', '3D', 'XD'],
        documents: {},
        pricingModel: 'contract',
        contractType: 'yearly',
        payoutFrequency: 'monthly',
        expeditedEnabled: false,
        acceptMarketing: false,
        paymentCompleted: true,
        paymentIntentId: 'pi_987654321'
    },
    {
        id: 'REG003',
        status: 'approved',
        submittedDate: '2024-01-10T09:15:00Z',
        businessName: 'Star Cinema Group',
        tradeName: 'Star Cinema',
        businessType: 'LLC',
        businessLicense: 'BL-2024-003',
        taxId: 'TAX-456789123',
        yearsInOperation: '3',
        businessDescription: 'Boutique cinema with curated film selection',
        ownerName: 'Michael Wong',
        ownerPosition: 'Director',
        ownerEmail: 'michael@starcinema.com',
        ownerPhone: '+1 (555) 345-6789',
        secondaryName: 'Lisa Chen',
        secondaryPosition: 'Marketing Director',
        secondaryEmail: 'lisa@starcinema.com',
        secondaryPhone: '+1 (555) 345-6790',
        emergencyName: 'James Wong',
        emergencyPhone: '+1 (555) 345-6791',
        emergencyRelation: 'Father',
        theaterName: 'Star Cinema Arts District',
        theaterLogo: null,
        theaterDescription: 'Independent film focus with art house selections',
        theaterEmail: 'arts@starcinema.com',
        theaterPhone: '+1 (555) 345-6792',
        totalHalls: '5',
        totalSeats: '450',
        services: ['Wine Bar', 'Art Gallery', 'Discussion Rooms'],
        latitude: '41.8781',
        longitude: '-87.6298',
        city: 'Chicago',
        region: 'IL',
        address: '789 Michigan Avenue',
        screenTypes: ['Standard', '35mm', 'Digital'],
        documents: {},
        pricingModel: 'per_ticket',
        contractType: 'quarterly',
        payoutFrequency: 'biweekly',
        expeditedEnabled: true,
        acceptMarketing: true,
        paymentCompleted: true,
        paymentIntentId: 'pi_456789123',
        approvedBy: 'Admin User',
        approvedDate: '2024-01-12T11:00:00Z'
    },
    {
        id: 'REG004',
        status: 'rejected',
        submittedDate: '2024-01-08T16:20:00Z',
        businessName: 'MegaPlex Cinemas',
        tradeName: 'MegaPlex',
        businessType: 'Corporation',
        businessLicense: 'BL-2024-004',
        taxId: 'TAX-321654987',
        yearsInOperation: '8',
        businessDescription: 'Large format cinema chain',
        ownerName: 'Thomas Anderson',
        ownerPosition: 'CEO',
        ownerEmail: 'thomas@megaplex.com',
        ownerPhone: '+1 (555) 456-7890',
        secondaryName: 'Patricia White',
        secondaryPosition: 'COO',
        secondaryEmail: 'patricia@megaplex.com',
        secondaryPhone: '+1 (555) 456-7891',
        emergencyName: 'Susan Anderson',
        emergencyPhone: '+1 (555) 456-7892',
        emergencyRelation: 'Wife',
        theaterName: 'MegaPlex Stadium 20',
        theaterLogo: null,
        theaterDescription: '20-screen megaplex with stadium seating',
        theaterEmail: 'stadium20@megaplex.com',
        theaterPhone: '+1 (555) 456-7893',
        totalHalls: '20',
        totalSeats: '4000',
        services: ['Full Restaurant', 'Bar', 'Bowling Alley', 'Arcade', 'Party Rooms'],
        latitude: '29.7604',
        longitude: '-95.3698',
        city: 'Houston',
        region: 'TX',
        address: '1010 Main Street',
        screenTypes: ['IMAX', '4DX', 'ScreenX', 'Standard'],
        documents: {},
        pricingModel: 'contract',
        contractType: 'yearly',
        payoutFrequency: 'monthly',
        expeditedEnabled: false,
        acceptMarketing: false,
        paymentCompleted: false,
        paymentIntentId: 'pi_321654987',
        rejectionReason: 'incomplete_documents',
        rejectionNotes: 'Missing business license and tax documents'
    },
    {
        id: 'REG005',
        status: 'pending',
        submittedDate: '2024-01-16T11:00:00Z',
        businessName: 'Golden Reel Theaters',
        tradeName: 'Golden Reel',
        businessType: 'Partnership',
        businessLicense: 'BL-2024-005',
        taxId: 'TAX-147258369',
        yearsInOperation: '15',
        businessDescription: 'Premium theater with gold class service',
        ownerName: 'Jennifer Lee',
        ownerPosition: 'Managing Partner',
        ownerEmail: 'jennifer@goldenreel.com',
        ownerPhone: '+1 (555) 567-8901',
        secondaryName: 'Mark Taylor',
        secondaryPosition: 'Operations Director',
        secondaryEmail: 'mark@goldenreel.com',
        secondaryPhone: '+1 (555) 567-8902',
        emergencyName: 'Robert Lee',
        emergencyPhone: '+1 (555) 567-8903',
        emergencyRelation: 'Brother',
        theaterName: 'Golden Reel Luxury Cinema',
        theaterLogo: null,
        theaterDescription: 'Luxury cinema with recliner seating and in-seat service',
        theaterEmail: 'luxury@goldenreel.com',
        theaterPhone: '+1 (555) 567-8904',
        totalHalls: '6',
        totalSeats: '600',
        services: ['Fine Dining', 'Champagne Bar', 'Valet Parking', 'Lounge'],
        latitude: '47.6062',
        longitude: '-122.3321',
        city: 'Seattle',
        region: 'WA',
        address: '222 Pine Street',
        screenTypes: ['Dolby Atmos', '4K Laser', 'Standard'],
        documents: {},
        pricingModel: 'per_ticket',
        contractType: 'monthly',
        payoutFrequency: 'weekly',
        expeditedEnabled: true,
        acceptMarketing: true,
        paymentCompleted: true,
        paymentIntentId: 'pi_147258369'
    }
];

const RegistrationRequests = () => {
    const [requests, setRequests] = useState<RegistrationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [useMockData, setUseMockData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showApproveButtons, setShowApproveButtons] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectNotes, setRejectNotes] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setRequests(MOCK_REQUESTS);
            } else {
                const response = await axios.get('/api/admin/registration-requests');
                const data = Array.isArray(response.data) ? response.data : [];
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests(MOCK_REQUESTS);
            setSuccessMessage('Using mock data - API connection failed');
            setShowSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (request: RegistrationRequest) => {
        setIsSubmitting(true);
        try {
            if (!useMockData) {
                await axios.post(`/api/admin/registration-requests/${request.id}/approve`, {
                    approvedBy: 'Admin',
                    approvedDate: new Date().toISOString()
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                const updatedRequests = requests.map(r => 
                    r.id === request.id 
                        ? { ...r, status: 'approved' as const, approvedBy: 'Admin', approvedDate: new Date().toISOString() }
                        : r
                );
                setRequests(updatedRequests);
            }
            setSuccessMessage(`✅ Theater "${request.theaterName}" has been approved successfully! An email notification has been sent.`);
            setShowSuccess(true);
            setShowViewModal(false);
            setShowApproveButtons(false);
            if (!useMockData) fetchRequests();
        } catch (error) {
            console.error('Error approving request:', error);
            setSuccessMessage('❌ Error approving request. Please try again.');
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        if (!rejectReason) {
            setSuccessMessage('❌ Please select a rejection reason.');
            setShowSuccess(true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (!useMockData) {
                await axios.post(`/api/admin/registration-requests/${selectedRequest.id}/reject`, {
                    reason: rejectReason,
                    notes: rejectNotes,
                    rejectedBy: 'Admin',
                    rejectedDate: new Date().toISOString()
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                const updatedRequests = requests.map(r => 
                    r.id === selectedRequest.id 
                        ? { ...r, status: 'rejected' as const, rejectionReason: rejectReason, rejectionNotes: rejectNotes }
                        : r
                );
                setRequests(updatedRequests);
            }
            setSuccessMessage(`❌ Theater "${selectedRequest.theaterName}" has been rejected. Reason: ${rejectReason}`);
            setShowSuccess(true);
            setShowRejectForm(false);
            setShowViewModal(false);
            setShowApproveButtons(false);
            setSelectedRequest(null);
            setRejectReason('');
            setRejectNotes('');
            if (!useMockData) fetchRequests();
        } catch (error) {
            console.error('Error rejecting request:', error);
            setSuccessMessage('❌ Error rejecting request. Please try again.');
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleView = (request: RegistrationRequest) => {
        setSelectedRequest(request);
        setShowViewModal(true);
        setShowApproveButtons(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const exportData = filteredRequests.map(req => ({
            'Theater Name': req.theaterName,
            'Business Name': req.businessName,
            'Owner': req.ownerName,
            'Email': req.ownerEmail,
            'Phone': req.ownerPhone,
            'Location': `${req.city}, ${req.region}`,
            'Halls': req.totalHalls,
            'Seats': req.totalSeats,
            'Status': req.status,
            'Submitted Date': new Date(req.submittedDate).toLocaleDateString()
        }));
        
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registration-requests-${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setSuccessMessage('✅ Export completed successfully!');
        setShowSuccess(true);
    };

    const convertToCSV = (data: any[]) => {
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ];
        return csvRows.join('\n');
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>;
            case 'approved':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">❌ Rejected</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const columns = [
        { 
            Header: 'Theater Name',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div>
                    <div className="font-medium text-gray-900">{row.theaterName || '-'}</div>
                    <div className="text-xs text-gray-500">ID: {row.id || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Business',
            accessor: 'businessName',
            sortable: true,
            Cell: (row: RegistrationRequest) => <div className="text-sm">{row.businessName || '-'}</div>
        },
        { 
            Header: 'Owner',
            accessor: 'ownerName',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div>
                    <div className="text-sm font-medium">{row.ownerName || '-'}</div>
                    <div className="text-xs text-gray-500">{row.ownerEmail || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Location',
            accessor: 'city',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="text-sm">
                    {row.city || '-'}, {row.region || '-'}
                </div>
            )
        },
        { 
            Header: 'Halls/Seats',
            accessor: 'totalHalls',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="text-sm">
                    {row.totalHalls || '0'} Halls | {row.totalSeats || '0'} Seats
                </div>
            )
        },
        { 
            Header: 'Submitted',
            accessor: 'submittedDate',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="text-sm">
                    {row.submittedDate ? new Date(row.submittedDate).toLocaleDateString() : '-'}
                </div>
            )
        },
        { 
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: RegistrationRequest) => getStatusBadge(row.status)
        },
        { 
            Header: 'Actions',
            accessor: 'actions',
            sortable: false,
            Cell: (row: RegistrationRequest) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Filter requests based on status and search
    const filteredRequests = Array.isArray(requests) && requests.length > 0
        ? requests.filter(request => {
            const matchesStatus = filterStatus === 'all' ? true : request.status === filterStatus;
            const matchesSearch = searchTerm === '' || 
                request.theaterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.city?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
          })
        : [];

    const stats = {
        total: Array.isArray(requests) ? requests.length : 0,
        pending: Array.isArray(requests) ? requests.filter(r => r.status === 'pending').length : 0,
        approved: Array.isArray(requests) ? requests.filter(r => r.status === 'approved').length : 0,
        rejected: Array.isArray(requests) ? requests.filter(r => r.status === 'rejected').length : 0
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Ban className="w-6 h-6 text-red-600" />
                            Registration Requests
                        </h1>
                        <p className="text-gray-600 mt-1">Review and manage theater registration requests</p>
                    </div>
                    <div className="flex gap-2">
                        {useMockData && (
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                📊 Mock Data Mode
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setUseMockData(!useMockData);
                                fetchRequests();
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600">Total Requests</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                    <div className="text-sm text-gray-600">Approved</div>
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                    <div className="text-sm text-gray-600">Rejected</div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by theater, business, owner, email, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <ReusableButton 
                        size="sm" 
                        variant="secondary" 
                        icon={Download}
                        onClick={handleExport}
                    >
                        Export
                    </ReusableButton>
                    
                    <ReusableButton 
                        size="sm" 
                        variant="secondary" 
                        icon={Printer}
                        onClick={handlePrint}
                    >
                        Print
                    </ReusableButton>
                </div>
            </div>

            {/* ReusableTable */}
            <ReusableTable
                columns={columns}
                data={filteredRequests}
                title="Theater Registration Requests"
                icon={Ban}
                showSearch={false}
                showExport={false}
                showPrint={false}
                itemsPerPage={10}
                itemsPerPageOptions={[10, 25, 50, 100]}
            />

            {/* View Details Modal */}
            {showViewModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Theater Registration Details</h2>
                                <p className="text-sm text-gray-500">Review all information before making a decision</p>
                            </div>
                            <button onClick={() => {
                                setShowViewModal(false);
                                setShowApproveButtons(false);
                            }} className="text-gray-500 hover:text-gray-700">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Business Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-800">
                                    <Building2 className="w-5 h-5" />
                                    Business Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Business Name:</span><br/><span className="font-medium">{selectedRequest.businessName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Trade Name:</span><br/><span className="font-medium">{selectedRequest.tradeName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Business Type:</span><br/>{selectedRequest.businessType || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Tax ID:</span><br/>{selectedRequest.taxId || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Years in Operation:</span><br/>{selectedRequest.yearsInOperation || '-'}</div>
                                    <div className="col-span-2"><span className="text-sm text-gray-600">Business Description:</span><br/>{selectedRequest.businessDescription || '-'}</div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-800">
                                    <User className="w-5 h-5" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Owner Name:</span><br/><span className="font-medium">{selectedRequest.ownerName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Position:</span><br/>{selectedRequest.ownerPosition || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Email:</span><br/>{selectedRequest.ownerEmail || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Phone:</span><br/>{selectedRequest.ownerPhone || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Secondary Contact:</span><br/>{selectedRequest.secondaryName || '-'} ({selectedRequest.secondaryPosition || '-'})</div>
                                    <div><span className="text-sm text-gray-600">Secondary Email:</span><br/>{selectedRequest.secondaryEmail || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Emergency Contact:</span><br/>{selectedRequest.emergencyName || '-'} ({selectedRequest.emergencyRelation || '-'})</div>
                                    <div><span className="text-sm text-gray-600">Emergency Phone:</span><br/>{selectedRequest.emergencyPhone || '-'}</div>
                                </div>
                            </div>

                            {/* Theater Details */}
                            <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-purple-800">
                                    🎭 Theater Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Theater Name:</span><br/><span className="font-medium">{selectedRequest.theaterName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Theater Email:</span><br/>{selectedRequest.theaterEmail || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Theater Phone:</span><br/>{selectedRequest.theaterPhone || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Total Halls:</span><br/>{selectedRequest.totalHalls || '0'}</div>
                                    <div><span className="text-sm text-gray-600">Total Seats:</span><br/>{selectedRequest.totalSeats || '0'}</div>
                                    <div className="col-span-2"><span className="text-sm text-gray-600">Theater Description:</span><br/>{selectedRequest.theaterDescription || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Services Offered:</span><br/>{(selectedRequest.services || []).join(', ') || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Screen Types:</span><br/>{(selectedRequest.screenTypes || []).join(', ') || '-'}</div>
                                    <div className="col-span-2"><span className="text-sm text-gray-600">Address:</span><br/>{selectedRequest.address || '-'}, {selectedRequest.city || '-'}, {selectedRequest.region || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Coordinates:</span><br/>{selectedRequest.latitude || '-'}, {selectedRequest.longitude || '-'}</div>
                                </div>
                            </div>

                            {/* Pricing Plan */}
                            <div className="bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-orange-800">
                                    <CreditCard className="w-5 h-5" />
                                    Pricing Plan
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Pricing Model:</span><br/><span className="font-medium">{selectedRequest.pricingModel || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Contract Type:</span><br/>{selectedRequest.contractType || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Payout Frequency:</span><br/>{selectedRequest.payoutFrequency || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Expedited Enabled:</span><br/>{selectedRequest.expeditedEnabled ? 'Yes' : 'No'}</div>
                                    <div><span className="text-sm text-gray-600">Payment Completed:</span><br/>{selectedRequest.paymentCompleted ? '✅ Yes' : '❌ No'}</div>
                                    <div><span className="text-sm text-gray-600">Marketing Accepted:</span><br/>{selectedRequest.acceptMarketing ? 'Yes' : 'No'}</div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
                                    <FileText className="w-5 h-5" />
                                    Uploaded Documents
                                </h3>
                                <div className="space-y-2">
                                    {selectedRequest.documents && Object.keys(selectedRequest.documents).length > 0 ? (
                                        Object.entries(selectedRequest.documents).map(([key, file]) => (
                                            file && (
                                                <div key={key} className="flex items-center gap-2 p-2 bg-white rounded border">
                                                    <FileText className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm text-gray-600">{key}:</span>
                                                    <a href="#" className="text-blue-600 hover:underline text-sm">{file.name}</a>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">No documents uploaded</div>
                                    )}
                                </div>
                            </div>

                            {/* Submission Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-600">Submitted Date:</span><br/>{new Date(selectedRequest.submittedDate).toLocaleString()}</div>
                                    <div><span className="text-gray-600">Status:</span><br/>{getStatusBadge(selectedRequest.status)}</div>
                                    {selectedRequest.approvedBy && (
                                        <div><span className="text-gray-600">Approved By:</span><br/>{selectedRequest.approvedBy}</div>
                                    )}
                                    {selectedRequest.approvedDate && (
                                        <div><span className="text-gray-600">Approved Date:</span><br/>{new Date(selectedRequest.approvedDate).toLocaleString()}</div>
                                    )}
                                    {selectedRequest.rejectionReason && (
                                        <div className="col-span-2"><span className="text-gray-600">Rejection Reason:</span><br/>{selectedRequest.rejectionReason}</div>
                                    )}
                                    {selectedRequest.rejectionNotes && (
                                        <div className="col-span-2"><span className="text-gray-600">Rejection Notes:</span><br/>{selectedRequest.rejectionNotes}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                            <ReusableButton variant="secondary" onClick={() => {
                                setShowViewModal(false);
                                setShowApproveButtons(false);
                            }}>
                                Close
                            </ReusableButton>
                            
                            {selectedRequest.status === 'pending' && !showApproveButtons && (
                                <ReusableButton 
                                    variant="primary" 
                                    onClick={() => setShowApproveButtons(true)}
                                >
                                    Proceed to Decision
                                </ReusableButton>
                            )}
                            
                            {selectedRequest.status === 'pending' && showApproveButtons && (
                                <>
                                    <ReusableButton 
                                        variant="danger" 
                                        icon={X} 
                                        onClick={() => {
                                            setShowViewModal(false);
                                            setShowRejectForm(true);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Reject Theater
                                    </ReusableButton>
                                    <ReusableButton 
                                        variant="success" 
                                        icon={Check} 
                                        onClick={() => handleApprove(selectedRequest)}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                    >
                                        Approve Theater
                                    </ReusableButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Form Modal - Fully Functional with Cancel and Reject Buttons */}
            {showRejectForm && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        {/* Header */}
                        <div className="border-b px-6 py-4 bg-red-50 rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Reject Registration Request</h2>
                                    <p className="text-sm text-gray-600 mt-1">Theater: {selectedRequest.theaterName}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Warning: This action will permanently reject this registration request. 
                                    The theater owner will be notified via email.
                                </p>
                            </div>
                            
                            {/* Rejection Reason Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                    required
                                >
                                    <option value="">Select Rejection Reason</option>
                                    <option value="incomplete_documents">📄 Incomplete Documents</option>
                                    <option value="invalid_information">⚠️ Invalid Information</option>
                                    <option value="duplicate_registration">🔄 Duplicate Registration</option>
                                    <option value="policy_violation">🚫 Policy Violation</option>
                                    <option value="payment_issue">💳 Payment Issue</option>
                                    <option value="business_verification_failed">🔍 Business Verification Failed</option>
                                    <option value="other">📝 Other</option>
                                </select>
                            </div>
                            
                            {/* Additional Notes Textarea */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={rejectNotes}
                                    onChange={(e) => setRejectNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                    placeholder="Provide more details about the rejection..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {rejectNotes.length} / 500 characters
                                </p>
                            </div>
                        </div>
                        
                        {/* Footer with Cancel and Reject Buttons */}
                        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectForm(false);
                                    setSelectedRequest(null);
                                    setRejectReason('');
                                    setRejectNotes('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isSubmitting || !rejectReason}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        Reject Registration
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={4000}
                />
            )}
        </div>
    );
};

export default RegistrationRequests;