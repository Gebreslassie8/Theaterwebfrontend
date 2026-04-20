// src/pages/Admin/theaters/ViewTheater.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Building, Mail, User, Phone, MapPin, Hash, Users, Calendar, 
    DollarSign, Ticket, Star, Briefcase, Home, Globe, Clock, CreditCard, 
    FileText, Heart, Shield, AlertCircle, CheckCircle, Info, Layers, 
    Navigation, Film, Sparkles
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';

interface Theater {
    id: number;
    // Business Information
    businessName?: string;
    tradeName?: string;
    businessType?: string;
    businessLicense?: string;
    taxId?: string;
    yearsInOperation?: string;
    businessDescription?: string;
    // Contact Information
    ownerName: string;
    ownerPosition?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    secondaryName?: string;
    secondaryPosition?: string;
    secondaryEmail?: string;
    secondaryPhone?: string;
    emergencyName?: string;
    emergencyPhone?: string;
    emergencyRelation?: string;
    // Theater Details
    theaterName?: string;
    theaterDescription?: string;
    theaterEmail?: string;
    theaterPhone?: string;
    totalHalls?: number;
    totalSeats?: number;
    services?: string[];
    latitude?: string;
    longitude?: string;
    city?: string;
    region?: string;
    address?: string;
    screenTypes?: string[];
    // Pricing Plan
    pricingModel?: string;
    contractType?: string;
    payoutFrequency?: string;
    expeditedEnabled?: boolean;
    // Agreements
    acceptMarketing?: boolean;
    paymentCompleted?: boolean;
    // Legacy fields
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    status: 'Active' | 'Inactive' | 'Pending';
    totalRevenue: number;
    totalBookings: number;
    rating: number;
    joinDate: string;
    lastActive: string;
    screens?: number;
    capacity?: number;
}

interface ViewTheaterProps {
    theater: Theater;
    isOpen: boolean;
    onClose: () => void;
}

// Deep Teal color constant
const deepTeal = "#007590";

const ViewTheater: React.FC<ViewTheaterProps> = ({ theater, isOpen, onClose }) => {
    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active': return <CheckCircle className="h-4 w-4" />;
            case 'Inactive': return <AlertCircle className="h-4 w-4" />;
            case 'Pending': return <Clock className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const formatServiceIcon = (service: string) => {
        const icons: Record<string, string> = {
            food_court: '🍔',
            vip_lounge: '✨',
            parking: '🅿️',
            wheelchair_access: '♿',
            concessions: '🍿',
            party_rooms: '🎉',
            arcade: '🎮',
            cafe: '☕',
            wine_bar: '🍷',
            art_gallery: '🎨',
            fine_dining: '🍽️',
            valet_parking: '🚗'
        };
        return icons[service] || '📌';
    };

    const formatScreenTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            standard: '📽️',
            imax: '🎬',
            '4dx': '💺',
            dolby_atmos: '🔊',
            '3d': '👓',
            xd: '⭐',
            screenx: '🖥️'
        };
        return icons[type] || '📺';
    };

    const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                    {icon}
                </div>
                <h3 className="text-md font-semibold" style={{ color: deepTeal }}>{title}</h3>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number | React.ReactNode; colSpan?: boolean }> = ({ icon, label, value, colSpan = false }) => (
        <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${colSpan ? 'col-span-2' : ''}`}>
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div className="flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                <p className="text-gray-900 font-medium mt-0.5">{value || 'N/A'}</p>
            </div>
        </div>
    );

    const getDisplayName = () => theater.theaterName || theater.name || 'N/A';
    const getDisplayEmail = () => theater.theaterEmail || theater.email || theater.ownerEmail || 'N/A';
    const getDisplayPhone = () => theater.theaterPhone || theater.phone || theater.ownerPhone || 'N/A';
    const getDisplayLocation = () => {
        if (theater.city && theater.region) return `${theater.city}, ${theater.region}`;
        if (theater.location) return theater.location;
        return 'N/A';
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Deep Teal Gradient */}
                    <div className="sticky top-0 px-6 py-5 flex items-center justify-between z-10" style={{ background: `linear-gradient(135deg, ${deepTeal} 0%, ${deepTeal}CC 100%)` }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Theater Details</h2>
                                <p className="text-white/80 text-sm mt-0.5">Complete theater information</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {/* Theater Header with Avatar and Status */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${deepTeal} 0%, ${deepTeal}CC 100%)` }}>
                                <Building className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900">{getDisplayName()}</h3>
                                <p className="text-gray-500 text-sm mt-1">ID: TH{String(theater.id).padStart(3, '0')}</p>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(theater.status)}`}>
                                {getStatusIcon(theater.status)}
                                {theater.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Business Information */}
                                {(theater.businessName || theater.tradeName || theater.businessType) && (
                                    <InfoSection title="Business Information" icon={<Briefcase className="h-4 w-4" style={{ color: deepTeal }} />}>
                                        <div className="grid grid-cols-1 gap-3">
                                            {theater.businessName && (
                                                <InfoRow icon={<Building className="h-4 w-4" />} label="Business Name" value={theater.businessName} />
                                            )}
                                            {theater.tradeName && (
                                                <InfoRow icon={<Home className="h-4 w-4" />} label="Trade Name (DBA)" value={theater.tradeName} />
                                            )}
                                            {theater.businessType && (
                                                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Business Type" value={theater.businessType} />
                                            )}
                                            {theater.businessLicense && (
                                                <InfoRow icon={<FileText className="h-4 w-4" />} label="Business License" value={theater.businessLicense} />
                                            )}
                                            {theater.taxId && (
                                                <InfoRow icon={<Hash className="h-4 w-4" />} label="Tax ID / EIN" value={theater.taxId} />
                                            )}
                                            {theater.yearsInOperation && (
                                                <InfoRow icon={<Clock className="h-4 w-4" />} label="Years in Operation" value={theater.yearsInOperation} />
                                            )}
                                            {theater.businessDescription && (
                                                <InfoRow icon={<Info className="h-4 w-4" />} label="Business Description" value={theater.businessDescription} colSpan />
                                            )}
                                        </div>
                                    </InfoSection>
                                )}

                                {/* Contact Information */}
                                <InfoSection title="Contact Information" icon={<User className="h-4 w-4" style={{ color: deepTeal }} />}>
                                    <div className="grid grid-cols-1 gap-3">
                                        <InfoRow icon={<User className="h-4 w-4" />} label="Owner Name" value={theater.ownerName} />
                                        {theater.ownerPosition && (
                                            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Owner Position" value={theater.ownerPosition} />
                                        )}
                                        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={getDisplayEmail()} />
                                        <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={getDisplayPhone()} />
                                        
                                        {(theater.secondaryName || theater.secondaryEmail) && (
                                            <>
                                                <div className="col-span-2 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                        <span className="text-xs text-gray-400">Secondary Contact</span>
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                    </div>
                                                </div>
                                                {theater.secondaryName && (
                                                    <InfoRow icon={<User className="h-4 w-4" />} label="Secondary Name" value={theater.secondaryName} />
                                                )}
                                                {theater.secondaryPosition && (
                                                    <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Secondary Position" value={theater.secondaryPosition} />
                                                )}
                                                {theater.secondaryEmail && (
                                                    <InfoRow icon={<Mail className="h-4 w-4" />} label="Secondary Email" value={theater.secondaryEmail} />
                                                )}
                                                {theater.secondaryPhone && (
                                                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Secondary Phone" value={theater.secondaryPhone} />
                                                )}
                                            </>
                                        )}
                                        
                                        {(theater.emergencyName || theater.emergencyPhone) && (
                                            <>
                                                <div className="col-span-2 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                        <span className="text-xs text-gray-400">Emergency Contact</span>
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                    </div>
                                                </div>
                                                {theater.emergencyName && (
                                                    <InfoRow icon={<Heart className="h-4 w-4" />} label="Emergency Name" value={theater.emergencyName} />
                                                )}
                                                {theater.emergencyPhone && (
                                                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Emergency Phone" value={theater.emergencyPhone} />
                                                )}
                                                {theater.emergencyRelation && (
                                                    <InfoRow icon={<Heart className="h-4 w-4" />} label="Emergency Relation" value={theater.emergencyRelation} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </InfoSection>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Theater Details */}
                                <InfoSection title="Theater Details" icon={<Building className="h-4 w-4" style={{ color: deepTeal }} />}>
                                    <div className="grid grid-cols-1 gap-3">
                                        {theater.theaterDescription && (
                                            <InfoRow icon={<Info className="h-4 w-4" />} label="Description" value={theater.theaterDescription} colSpan />
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            <InfoRow icon={<Layers className="h-4 w-4" />} label="Total Halls" value={theater.totalHalls || theater.screens || 'N/A'} />
                                            <InfoRow icon={<Users className="h-4 w-4" />} label="Total Seats" value={theater.totalSeats || theater.capacity || 'N/A'} />
                                        </div>
                                        
                                        {/* Location */}
                                        <div className="col-span-2 mt-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Location</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {theater.address && (
                                                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={theater.address} />
                                                )}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {theater.city && (
                                                        <InfoRow icon={<Home className="h-4 w-4" />} label="City" value={theater.city} />
                                                    )}
                                                    {theater.region && (
                                                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Region" value={theater.region} />
                                                    )}
                                                </div>
                                                {(theater.latitude || theater.longitude) && (
                                                    <InfoRow icon={<Navigation className="h-4 w-4" />} label="Coordinates" value={`${theater.latitude || 'N/A'}, ${theater.longitude || 'N/A'}`} colSpan />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </InfoSection>

                                {/* Services & Screen Types */}
                                {(theater.services && theater.services.length > 0) && (
                                    <InfoSection title="Services & Amenities" icon={<Sparkles className="h-4 w-4" style={{ color: deepTeal }} />}>
                                        <div className="flex flex-wrap gap-2">
                                            {theater.services.map((service, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                                                    <span>{formatServiceIcon(service)}</span>
                                                    <span className="capitalize">{service.replace('_', ' ')}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </InfoSection>
                                )}

                                {(theater.screenTypes && theater.screenTypes.length > 0) && (
                                    <InfoSection title="Screen Types" icon={<Film className="h-4 w-4" style={{ color: deepTeal }} />}>
                                        <div className="flex flex-wrap gap-2">
                                            {theater.screenTypes.map((type, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                                                    <span>{formatScreenTypeIcon(type)}</span>
                                                    <span className="capitalize">{type.replace('_', ' ')}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </InfoSection>
                                )}

                                {/* Pricing & Performance */}
                                <InfoSection title="Pricing & Performance" icon={<CreditCard className="h-4 w-4" style={{ color: deepTeal }} />}>
                                    <div className="grid grid-cols-2 gap-3">
                                        {theater.pricingModel && (
                                            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Pricing Model" value={theater.pricingModel.replace('_', ' ')} />
                                        )}
                                        {theater.contractType && (
                                            <InfoRow icon={<FileText className="h-4 w-4" />} label="Contract Type" value={theater.contractType} />
                                        )}
                                        {theater.payoutFrequency && (
                                            <InfoRow icon={<Clock className="h-4 w-4" />} label="Payout Frequency" value={theater.payoutFrequency} />
                                        )}
                                        {theater.expeditedEnabled !== undefined && (
                                            <InfoRow icon={<Shield className="h-4 w-4" />} label="Expedited Processing" value={theater.expeditedEnabled ? 'Yes' : 'No'} />
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 my-2 pt-2"></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Total Revenue" value={`ETB ${(theater.totalRevenue || 0).toLocaleString()}`} />
                                        <InfoRow icon={<Ticket className="h-4 w-4" />} label="Total Bookings" value={(theater.totalBookings || 0).toLocaleString()} />
                                        <InfoRow icon={<Star className="h-4 w-4" />} label="Rating" value={theater.rating || 'N/A'} />
                                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Join Date" value={new Date(theater.joinDate).toLocaleDateString()} />
                                    </div>
                                    <InfoRow icon={<Calendar className="h-4 w-4" />} label="Last Active" value={new Date(theater.lastActive).toLocaleDateString()} colSpan />
                                </InfoSection>

                                {/* Agreements */}
                                {(theater.acceptMarketing !== undefined || theater.paymentCompleted !== undefined) && (
                                    <InfoSection title="Agreements" icon={<Shield className="h-4 w-4" style={{ color: deepTeal }} />}>
                                        <div className="grid grid-cols-1 gap-3">
                                            {theater.acceptMarketing !== undefined && (
                                                <InfoRow 
                                                    icon={theater.acceptMarketing ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />} 
                                                    label="Marketing Communications" 
                                                    value={theater.acceptMarketing ? 'Accepted' : 'Not Accepted'} 
                                                />
                                            )}
                                            {theater.paymentCompleted !== undefined && (
                                                <InfoRow 
                                                    icon={theater.paymentCompleted ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />} 
                                                    label="Payment Status" 
                                                    value={theater.paymentCompleted ? 'Completed' : 'Pending'} 
                                                />
                                            )}
                                        </div>
                                    </InfoSection>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                            <ReusableButton 
                                variant="secondary" 
                                onClick={onClose}
                                className="flex-1"
                            >
                                Close
                            </ReusableButton>
                            <ReusableButton 
                                variant="primary" 
                                onClick={() => window.print()}
                                className="flex-1"
                            >
                                Print Details
                            </ReusableButton>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ViewTheater;
