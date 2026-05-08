// src/pages/scanner/ScanQRCode.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    QrCode,
    CheckCircle,
    XCircle,
    Camera,
    RefreshCw,
    Activity,
    Volume2,
    VolumeX,
    Users,
    Zap,
    Shield,
    Award,
    TrendingUp,
    UserCheck,
    Ticket,
    ChevronLeft,
    Check,
    AlertTriangle,
    Edit,
    X,
  Scan,
    Fingerprint,
    Smartphone,
    Wifi,
    Signal,
    Battery
} from 'lucide-react';
import jsQR from 'jsqr';

// ============= Types =============
interface TicketData {
    id: string;
    ticketNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    hallName: string;
    seatNumber: string;
    seatRow: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    price: number;
    paymentMethod: string;
    purchaseDate: string;
    status: 'valid' | 'used';
    qrCode: string;
    checkInTime?: string;
    checkedInBy?: string;
}

interface ScanResult {
    success: boolean;
    message: string;
    ticket?: TicketData;
    timestamp: string;
}

// ============= Mock Database =============
const mockTickets: TicketData[] = [
    {
        id: '1',
        ticketNumber: 'TKT-2024-001',
        eventName: 'The Lion King',
        eventDate: '2024-12-25',
        eventTime: '19:00',
        hallName: 'Main Hall',
        seatNumber: '12',
        seatRow: 'A',
        customerName: 'John Smith',
        customerEmail: 'john@email.com',
        customerPhone: '+251911234567',
        price: 450,
        paymentMethod: 'Chapa',
        purchaseDate: '2024-12-01',
        status: 'valid',
        qrCode: 'TKT-2024-001'
    },
    {
        id: '2',
        ticketNumber: 'TKT-2024-002',
        eventName: 'Hamilton',
        eventDate: '2024-12-25',
        eventTime: '20:30',
        hallName: 'Main Hall',
        seatNumber: '5',
        seatRow: 'B',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@email.com',
        customerPhone: '+251912345678',
        price: 550,
        paymentMethod: 'Telebirr',
        purchaseDate: '2024-12-02',
        status: 'valid',
        qrCode: 'TKT-2024-002'
    },
    {
        id: '3',
        ticketNumber: 'TKT-2024-003',
        eventName: 'Wicked',
        eventDate: '2024-12-26',
        eventTime: '18:30',
        hallName: 'East Hall',
        seatNumber: '8',
        seatRow: 'C',
        customerName: 'Michael Brown',
        customerEmail: 'michael@email.com',
        customerPhone: '+251913456789',
        price: 400,
        paymentMethod: 'Chapa',
        purchaseDate: '2024-12-03',
        status: 'valid',
        qrCode: 'TKT-2024-003'
    },
    {
        id: '4',
        ticketNumber: 'TKT-2024-004',
        eventName: 'Les Misérables',
        eventDate: '2024-12-27',
        eventTime: '19:30',
        hallName: 'West Hall',
        seatNumber: '3',
        seatRow: 'D',
        customerName: 'Emily Wilson',
        customerEmail: 'emily@email.com',
        customerPhone: '+251914567890',
        price: 500,
        paymentMethod: 'Credit Card',
        purchaseDate: '2024-12-05',
        status: 'valid',
        qrCode: 'TKT-2024-004'
    }
];

// Track checked in tickets
let checkedInTickets: Map<string, TicketData> = new Map();

// ============= Audio Functions =============
const playValidSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        const oscillator1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        oscillator1.connect(gain1);
        gain1.connect(audioContext.destination);
        oscillator1.frequency.value = 880;
        oscillator1.type = 'sine';
        gain1.gain.value = 0.4;
        oscillator1.start();
        gain1.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
        oscillator1.stop(audioContext.currentTime + 0.3);
        
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            oscillator2.connect(gain2);
            gain2.connect(audioContext.destination);
            oscillator2.frequency.value = 880;
            oscillator2.type = 'sine';
            gain2.gain.value = 0.4;
            oscillator2.start();
            gain2.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator2.stop(audioContext.currentTime + 0.3);
        }, 200);
    } catch (error) {
        console.log('Audio not supported');
    }
};

const playInvalidSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.frequency.value = 440;
        oscillator.type = 'sawtooth';
        gain.gain.value = 0.4;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
};

const playCheckInSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gain.gain.value = 0.3;
                oscillator.start();
                gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 150);
        });
    } catch (error) {
        console.log('Audio not supported');
    }
};

// ============= Visual Functions =============
const triggerFlash = (color: string) => {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.zIndex = '9999';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 150);
};

// ============= Main Component =============
const ScanQRCode: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const [cameraActive, setCameraActive] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualNumber, setManualNumber] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const [stats, setStats] = useState({
        checkedIn: 0,
        invalid: 0
    });

    // Cleanup camera on unmount or logout
    const cleanupCamera = () => {
        // Stop the scanning interval
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        
        // Stop all camera tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }
        
        // Clear video source
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        
        setIsScanning(false);
    };

    // Listen for beforeunload event (page refresh/close)
    useEffect(() => {
        const handleBeforeUnload = () => {
            cleanupCamera();
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupCamera();
        };
    }, []);

    // Start camera on mount
    useEffect(() => {
        if (cameraActive && !showManualInput && !cameraError) {
            startCamera();
        }
        return () => {
            cleanupCamera();
        };
    }, [cameraActive, showManualInput, cameraError]);

    const startCamera = async () => {
        cleanupCamera(); // Clean up any existing camera first
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                await videoRef.current.play();
                setIsScanning(true);
                startQRScanning();
            }
        } catch (error) {
            console.error('Camera error:', error);
            setCameraError('Camera access denied. Please allow camera permissions.');
            setIsScanning(false);
        }
    };

    const stopCamera = () => {
        cleanupCamera();
    };

    const startQRScanning = () => {
        if (!videoRef.current || !canvasRef.current || !isScanning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear any existing interval
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }

        scanIntervalRef.current = setInterval(() => {
            if (!isScanning || !cameraActive || showManualInput || !video.videoWidth || !video.videoHeight) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    // Pause scanning while processing
                    if (scanIntervalRef.current) {
                        clearInterval(scanIntervalRef.current);
                        scanIntervalRef.current = null;
                    }
                    processQRCode(code.data);
                }
            }
        }, 500);
    };

    const processQRCode = (data: string) => {
        // Validate QR code format
        const match = data.match(/TKT-\d{4}-\d{3}/);
        if (!match) {
            showError('Invalid QR code. Please scan a valid ticket.');
            restartScanning();
            return;
        }

        const ticket = mockTickets.find(t => t.ticketNumber === match[0]);
        
        if (!ticket) {
            showError('Ticket not found in system.');
            restartScanning();
            return;
        }

        if (checkedInTickets.has(ticket.ticketNumber)) {
            showError(`Ticket already checked in.`);
            restartScanning();
            return;
        }

        // Valid ticket - show confirmation
        if (soundEnabled) playValidSound();
        triggerFlash('#22c55e');
        setSelectedTicket(ticket);
        setShowConfirm(true);
        stopCamera(); // Stop camera when showing confirmation
    };

    const restartScanning = () => {
        setTimeout(() => {
            if (cameraActive && !showManualInput && !showConfirm) {
                startCamera();
            }
        }, 2000);
    };

    const showError = (message: string) => {
        if (soundEnabled) playInvalidSound();
        triggerFlash('#ef4444');
        setStats(prev => ({ ...prev, invalid: prev.invalid + 1 }));
        setScanResult({ success: false, message, timestamp: new Date().toISOString() });
        setShowResult(true);
        
        setTimeout(() => {
            setShowResult(false);
            setScanResult(null);
        }, 2000);
    };

    const handleCheckIn = () => {
        if (!selectedTicket) return;
        
        const checkedIn = { 
            ...selectedTicket, 
            status: 'used' as const, 
            checkInTime: new Date().toLocaleTimeString(),
            checkedInBy: 'Gate Scanner'
        };
        checkedInTickets.set(selectedTicket.ticketNumber, checkedIn);
        
        if (soundEnabled) playCheckInSound();
        triggerFlash('#22c55e');
        
        setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
        setScanResult({ 
            success: true, 
            message: `✓ ${selectedTicket.customerName} checked in successfully`,
            ticket: checkedIn,
            timestamp: new Date().toISOString()
        });
        
        setShowConfirm(false);
        setSelectedTicket(null);
        setShowResult(true);
        
        setTimeout(() => {
            setShowResult(false);
            setScanResult(null);
            // Restart camera after check-in
            if (cameraActive && !showManualInput) {
                startCamera();
            }
        }, 2000);
    };

    const handleManualCheckIn = () => {
        if (!manualNumber.trim()) {
            showError('Please enter a ticket number');
            return;
        }

        const ticket = mockTickets.find(t => t.ticketNumber === manualNumber.toUpperCase());
        
        if (!ticket) {
            showError('Ticket not found');
            setManualNumber('');
            return;
        }

        if (checkedInTickets.has(ticket.ticketNumber)) {
            showError('Ticket already checked in');
            setManualNumber('');
            return;
        }

        setSelectedTicket(ticket);
        setShowConfirm(true);
        setManualNumber('');
        setShowManualInput(false);
        stopCamera();
    };

    // Handle navigation/cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupCamera();
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black">
            {/* Camera View */}
            {cameraActive && !showManualInput && !cameraError && (
                <>
                    <video 
                        ref={videoRef} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        autoPlay 
                        playsInline 
                        muted 
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0">
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40">
                            {/* Scan frame */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80">
                                <div className="absolute -top-2 -left-2 w-16 h-16 border-t-4 border-l-4 border-teal-400 rounded-tl-2xl" />
                                <div className="absolute -top-2 -right-2 w-16 h-16 border-t-4 border-r-4 border-teal-400 rounded-tr-2xl" />
                                <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-4 border-l-4 border-teal-400 rounded-bl-2xl" />
                                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-4 border-r-4 border-teal-400 rounded-br-2xl" />
                                <motion.div
                                    animate={{ y: [-150, 150] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                                />
                            </div>
                        </div>

                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                            <div className="flex justify-between items-center">
                                <button 
                                    onClick={() => {
                                        cleanupCamera();
                                        navigate('/scanner/dashboard');
                                    }} 
                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSoundEnabled(!soundEnabled)} 
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                                    >
                                        {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
                                    </button>
                                    <button 
                                        onClick={() => { 
                                            setShowManualInput(true); 
                                            stopCamera(); 
                                        }} 
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                                    >
                                        <Edit className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Icons - Check-in Button Area */}
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 space-y-3">
                            {/* Check-in Button - Main Action */}
                            <button
                                onClick={() => {
                                    if (selectedTicket) {
                                        setShowConfirm(true);
                                    } else {
                                        showError('Please scan a ticket first');
                                    }
                                }}
                                className="p-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg hover:scale-105 transition-transform"
                            >
                                <UserCheck className="w-6 h-6 text-white" />
                            </button>
                            
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl relative">
                                <Users className="w-5 h-5 text-white" />
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                    {stats.checkedIn}
                                </span>
                            </div>
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-white/80">Checked In</p>
                                    <p className="text-2xl font-bold text-white">{stats.checkedIn}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-400">Valid</p>
                                    <p className="text-2xl font-bold text-green-400">{stats.checkedIn}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-red-400">Invalid</p>
                                    <p className="text-2xl font-bold text-red-400">{stats.invalid}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="absolute top-20 right-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/80 backdrop-blur-sm rounded-full">
                                <Activity className="w-3 h-3 text-white animate-pulse" />
                                <span className="text-xs text-white">Scanning</span>
                                <Wifi className="w-3 h-3 text-white ml-1" />
                                <Signal className="w-3 h-3 text-white" />
                                <Battery className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Instruction */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                            <p className="text-xs text-white/80">Position QR code in the frame</p>
                        </div>
                    </div>
                </>
            )}

            {/* Manual Input */}
            {showManualInput && (
                <div className="absolute inset-0 bg-black flex items-center justify-center p-4 z-50">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Ticket className="w-8 h-8 text-teal-600" />
                            </div>
                            <h2 className="text-xl font-bold">Manual Check-in</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter ticket number manually</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={manualNumber}
                                onChange={(e) => setManualNumber(e.target.value.toUpperCase())}
                                placeholder="TKT-2024-001"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-center text-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                autoFocus
                            />
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-800 flex items-center gap-2">
                                    <Info className="w-3 h-3" />
                                    Example: TKT-2024-001, TKT-2024-002
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => { 
                                    setShowManualInput(false); 
                                    startCamera(); 
                                }} 
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleManualCheckIn} 
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition"
                            >
                                Verify Ticket
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Camera Error */}
            {cameraError && !showManualInput && (
                <div className="absolute inset-0 bg-black flex items-center justify-center p-4">
                    <div className="text-center max-w-sm">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-white text-lg font-semibold mb-2">Camera Error</p>
                        <p className="text-gray-400 text-sm mb-6">{cameraError}</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    setCameraError(null);
                                    startCamera();
                                }} 
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                            >
                                Retry
                            </button>
                            <button 
                                onClick={() => { 
                                    setShowManualInput(true); 
                                    setCameraError(null);
                                }} 
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Manual Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Check-in Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && selectedTicket && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5">
                                <div className="flex items-center gap-3">
                                    <UserCheck className="w-6 h-6 text-white" />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Confirm Check-in</h2>
                                        <p className="text-xs text-white/80">Verify ticket details</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Ticket Number</span>
                                    <span className="text-sm font-mono font-semibold text-teal-600">{selectedTicket.ticketNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Event</span>
                                    <span className="text-sm font-medium">{selectedTicket.eventName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Customer</span>
                                    <span className="text-sm">{selectedTicket.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Seat</span>
                                    <span className="text-sm">Row {selectedTicket.seatRow}, Seat {selectedTicket.seatNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Time</span>
                                    <span className="text-sm">{selectedTicket.eventDate} at {selectedTicket.eventTime}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 p-5 border-t border-gray-100">
                                <button 
                                    onClick={() => { 
                                        setShowConfirm(false); 
                                        setSelectedTicket(null); 
                                        startCamera(); 
                                    }} 
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleCheckIn} 
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Check-in
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result Notification */}
            <AnimatePresence>
                {showResult && scanResult && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        exit={{ x: 100, opacity: 0 }}
                        className={`fixed top-20 right-4 z-50 max-w-md w-full shadow-2xl rounded-xl overflow-hidden ${
                            scanResult.success ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
                        }`}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                {scanResult.success ? 
                                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0" /> : 
                                    <XCircle className="w-6 h-6 text-white flex-shrink-0" />
                                }
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">
                                        {scanResult.success ? 'Check-in Successful' : 'Check-in Failed'}
                                    </h3>
                                    <p className="text-sm text-white/90 mt-1">{scanResult.message}</p>
                                    {scanResult.ticket && (
                                        <div className="mt-2 pt-2 border-t border-white/20">
                                            <p className="text-xs text-white/80">
                                                Ticket: {scanResult.ticket.ticketNumber} | Time: {scanResult.ticket.checkInTime}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full bg-white/30 animate-pulse`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Info icon component
const Info = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default ScanQRCode;