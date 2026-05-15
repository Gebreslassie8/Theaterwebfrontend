// src/pages/scanner/ScanQRCode.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    QrCode,
    CheckCircle,
    XCircle,
    Activity,
    Volume2,
    VolumeX,
    UserCheck,
    Ticket,
    ChevronLeft,
    Check,
    AlertTriangle,
    Edit,
    X,
    Loader2,
    Camera,
    CameraOff
} from 'lucide-react';
import jsQR from 'jsqr';
import supabase from '@/config/supabaseClient';

// ============= Types =============
interface ScannerSession {
    id: string;
    scanner_id: string;
    scanner_name: string;
    scanner_location: string;
}

interface TicketValidationResult {
    is_valid: boolean;
    message: string;
    ticket_id: string;
    ticket_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    event_name: string;
    event_id: string;
    event_date: string;
    event_time: string;
    hall_name: string;
    seat_info: string;
    seat_row: string;
    seat_number: number;
    price: number;
    is_checked_in: boolean;
    checked_in_at: string | null;
}

// ============= Audio Functions =============
const playValidSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') audioContext.resume();
        
        const now = audioContext.currentTime;
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 880;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc1.start(now);
        osc1.stop(now + 0.2);
        
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1320;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.5, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15);
            osc2.start();
            osc2.stop(audioContext.currentTime + 0.15);
        }, 150);
    } catch (error) { console.log('Audio not supported'); }
};

const playInvalidSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') audioContext.resume();
        
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 440;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    } catch (error) { console.log('Audio not supported'); }
};

const playCheckInSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') audioContext.resume();
        
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gain.gain.setValueAtTime(0.4, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 120);
        });
    } catch (error) { console.log('Audio not supported'); }
};

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
    const isProcessingRef = useRef<boolean>(false);
    
    const [cameraActive, setCameraActive] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualNumber, setManualNumber] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scannerSession, setScannerSession] = useState<ScannerSession | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [stats, setStats] = useState({ checkedIn: 0, invalid: 0 });
    const [cameraInitialized, setCameraInitialized] = useState(false);

    // Get current user and scanner session
    useEffect(() => {
        const init = async () => {
            // Get current user from Supabase Auth
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            
            // Get or create scanner session
            const savedSession = localStorage.getItem('scannerSession');
            if (savedSession) {
                setScannerSession(JSON.parse(savedSession));
            } else {
                const scannerId = `SCN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
                const newSession = {
                    id: scannerId,
                    scanner_id: scannerId,
                    scanner_name: `Scanner-${scannerId.slice(-4)}`,
                    scanner_location: 'Main Gate'
                };
                localStorage.setItem('scannerSession', JSON.stringify(newSession));
                setScannerSession(newSession);
                
                // Save to database
                await supabase.from('scanner_sessions').insert({
                    scanner_id: scannerId,
                    scanner_name: newSession.scanner_name,
                    scanner_location: newSession.scanner_location,
                    status: 'active',
                    created_by: user?.id
                });
            }
        };
        init();
    }, []);

    // Load stats
    const loadStats = useCallback(async () => {
        if (!scannerSession) return;
        
        const today = new Date().toISOString().split('T')[0];
        
        const { count: todayCheckins } = await supabase
            .from('ticket_checkins')
            .select('*', { count: 'exact', head: true })
            .eq('scanner_id', scannerSession.scanner_id)
            .gte('check_in_time', `${today}T00:00:00`)
            .lte('check_in_time', `${today}T23:59:59`);
        
        const { count: todayInvalid } = await supabase
            .from('scan_logs')
            .select('*', { count: 'exact', head: true })
            .eq('scanner_id', scannerSession.scanner_id)
            .eq('status', 'invalid')
            .gte('scan_time', `${today}T00:00:00`)
            .lte('scan_time', `${today}T23:59:59`);
        
        setStats({
            checkedIn: todayCheckins || 0,
            invalid: todayInvalid || 0
        });
    }, [scannerSession]);

    useEffect(() => {
        if (scannerSession) loadStats();
    }, [scannerSession, loadStats]);

    // Cleanup camera
    const cleanupCamera = useCallback(() => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }
        
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        
        setCameraInitialized(false);
    }, []);

    // Start camera
    const startCamera = useCallback(async () => {
        cleanupCamera();
        setCameraError(null);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                
                // Wait for video to be ready
                await new Promise((resolve) => {
                    if (videoRef.current!.readyState >= 2) {
                        resolve(true);
                    } else {
                        videoRef.current!.oncanplay = () => resolve(true);
                    }
                });
                
                await videoRef.current.play();
                setCameraInitialized(true);
                startQRScanning();
            }
        } catch (error: any) {
            console.error('Camera error:', error);
            if (error.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permissions.');
            } else if (error.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
            } else if (error.name === 'NotReadableError') {
                setCameraError('Camera is already in use by another application.');
            } else {
                setCameraError('Failed to start camera. Please check your camera.');
            }
        }
    }, [cleanupCamera]);

    const stopCamera = useCallback(() => {
        cleanupCamera();
    }, [cleanupCamera]);

    const startQRScanning = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !cameraInitialized) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }

        scanIntervalRef.current = setInterval(() => {
            if (!cameraInitialized || !video.videoWidth || !video.videoHeight || isProcessingRef.current || showConfirm || showManualInput) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code && !isProcessingRef.current) {
                    // Stop scanning while processing
                    if (scanIntervalRef.current) {
                        clearInterval(scanIntervalRef.current);
                        scanIntervalRef.current = null;
                    }
                    processQRCode(code.data);
                }
            }
        }, 300);
    }, [cameraInitialized, showConfirm, showManualInput]);

    const logScanAttempt = async (ticketNumber: string, status: string, errorMessage?: string) => {
        try {
            await supabase.rpc('log_scan_attempt', {
                p_ticket_number: ticketNumber,
                p_status: status,
                p_error_message: errorMessage,
                p_scanner_id: scannerSession?.scanner_id,
                p_scanner_session_id: scannerSession?.id,
                p_scanned_by_id: currentUser?.id,
                p_user_agent: navigator.userAgent
            });
        } catch (error) {
            console.error('Error logging scan:', error);
        }
    };

    const processQRCode = async (data: string) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsProcessing(true);
        
        // Extract ticket number from QR data (supports multiple formats)
        let ticketNumber = '';
        const patterns = [
            /TKT-\d{4}-\d{3}/,
            /TKT-\d{4}-\d{3}-\d+/,
            /ticket[:\s]*([A-Z0-9-]+)/i,
            /([A-Z0-9]{3,}-\d{4}-\d{3,})/
        ];
        
        for (const pattern of patterns) {
            const match = data.match(pattern);
            if (match) {
                ticketNumber = match[0];
                break;
            }
        }
        
        if (!ticketNumber) {
            await logScanAttempt(data, 'invalid', 'Invalid QR code format');
            showError('Invalid QR code. Please scan a valid ticket QR code.');
            restartScanning();
            isProcessingRef.current = false;
            setIsProcessing(false);
            return;
        }
        
        try {
            // Call validate_ticket function
            const { data: validationResult, error } = await supabase
                .rpc('validate_ticket', { p_ticket_number: ticketNumber });
            
            if (error) throw error;
            
            if (!validationResult || !validationResult.is_valid) {
                await logScanAttempt(ticketNumber, 'invalid', validationResult?.message || 'Ticket not valid');
                showError(validationResult?.message || 'Ticket not found or invalid');
                restartScanning();
                isProcessingRef.current = false;
                setIsProcessing(false);
                return;
            }
            
            if (validationResult.is_checked_in) {
                await logScanAttempt(ticketNumber, 'invalid', 'Ticket already checked in');
                const checkInTime = validationResult.checked_in_at ? new Date(validationResult.checked_in_at).toLocaleTimeString() : 'previously';
                showError(`Ticket already checked in at ${checkInTime}`);
                restartScanning();
                isProcessingRef.current = false;
                setIsProcessing(false);
                return;
            }
            
            // Valid ticket - log valid scan
            await logScanAttempt(ticketNumber, 'valid');
            
            if (soundEnabled) playValidSound();
            triggerFlash('#22c55e');
            
            setSelectedTicket(validationResult);
            setShowConfirm(true);
            stopCamera();
            
        } catch (error) {
            console.error('Error processing QR code:', error);
            showError('Error processing ticket. Please try again.');
            restartScanning();
        } finally {
            isProcessingRef.current = false;
            setIsProcessing(false);
        }
    };

    const handleCheckIn = async () => {
        if (!selectedTicket) return;
        
        setIsProcessing(true);
        isProcessingRef.current = true;
        
        try {
            const { data: checkinResult, error } = await supabase
                .rpc('checkin_ticket', {
                    p_ticket_id: selectedTicket.ticket_id,
                    p_checked_in_by: currentUser?.id,
                    p_scanner_id: scannerSession?.scanner_id,
                    p_scanner_session_id: scannerSession?.id,
                    p_scanner_location: scannerSession?.scanner_location,
                    p_gate_number: 'Gate 1'
                });
            
            if (error) throw error;
            
            if (checkinResult?.success) {
                if (soundEnabled) playCheckInSound();
                triggerFlash('#22c55e');
                
                setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
                setScanResult({ 
                    success: true, 
                    message: `✓ ${selectedTicket.customer_name} checked in successfully`
                });
                
                setShowConfirm(false);
                setSelectedTicket(null);
                setShowResult(true);
                await loadStats();
                
                setTimeout(() => {
                    setShowResult(false);
                    setScanResult(null);
                    restartScanning();
                }, 2500);
            } else {
                showError(checkinResult?.message || 'Check-in failed');
                restartScanning();
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            showError('Failed to check in ticket. Please try again.');
            restartScanning();
        } finally {
            setIsProcessing(false);
            isProcessingRef.current = false;
        }
    };

    const handleManualCheckIn = async () => {
        if (!manualNumber.trim()) {
            showError('Please enter a ticket number');
            return;
        }
        
        setIsProcessing(true);
        isProcessingRef.current = true;
        
        try {
            const { data: validationResult, error } = await supabase
                .rpc('validate_ticket', { p_ticket_number: manualNumber.toUpperCase() });
            
            if (error) throw error;
            
            if (!validationResult || !validationResult.is_valid) {
                await logScanAttempt(manualNumber.toUpperCase(), 'invalid', validationResult?.message);
                showError(validationResult?.message || 'Ticket not found');
                setManualNumber('');
                setIsProcessing(false);
                isProcessingRef.current = false;
                return;
            }
            
            if (validationResult.is_checked_in) {
                await logScanAttempt(manualNumber.toUpperCase(), 'invalid', 'Ticket already checked in');
                showError('Ticket already checked in');
                setManualNumber('');
                setIsProcessing(false);
                isProcessingRef.current = false;
                return;
            }
            
            await logScanAttempt(manualNumber.toUpperCase(), 'valid');
            
            setSelectedTicket(validationResult);
            setShowConfirm(true);
            setManualNumber('');
            setShowManualInput(false);
            stopCamera();
            
        } catch (error) {
            console.error('Error in manual check-in:', error);
            showError('Error processing ticket');
        } finally {
            setIsProcessing(false);
            isProcessingRef.current = false;
        }
    };

    const restartScanning = useCallback(() => {
        setTimeout(async () => {
            if (!showConfirm && !showManualInput && cameraActive) {
                await startCamera();
            }
        }, 1000);
    }, [showConfirm, showManualInput, cameraActive, startCamera]);

    const showError = (message: string) => {
        if (soundEnabled) playInvalidSound();
        triggerFlash('#ef4444');
        setStats(prev => ({ ...prev, invalid: prev.invalid + 1 }));
        setScanResult({ success: false, message });
        setShowResult(true);
        
        setTimeout(() => {
            setShowResult(false);
            setScanResult(null);
        }, 2000);
    };

    // Effect for camera lifecycle
    useEffect(() => {
        if (cameraActive && !showManualInput && !cameraError && !showConfirm) {
            startCamera();
        }
        return () => {
            cleanupCamera();
        };
    }, [cameraActive, showManualInput, cameraError, showConfirm, startCamera, cleanupCamera]);

    // Effect for scanning when camera is ready
    useEffect(() => {
        if (cameraInitialized && !showConfirm && !showManualInput) {
            startQRScanning();
        }
    }, [cameraInitialized, showConfirm, showManualInput, startQRScanning]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera]);

    const InfoIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="fixed inset-0 bg-black">
            {/* Processing Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
                        <p className="text-white">Processing...</p>
                    </div>
                </div>
            )}

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
                    
                    <div className="absolute inset-0">
                        {/* Scan Frame Overlay */}
                        <div className="absolute inset-0 bg-black/50">
                            {/* Transparent center for scan area */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-transparent">
                                {/* Corner brackets */}
                                <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-teal-400 rounded-tl-2xl" />
                                <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-teal-400 rounded-tr-2xl" />
                                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-teal-400 rounded-bl-2xl" />
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-teal-400 rounded-br-2xl" />
                                
                                {/* Scanning line animation */}
                                <motion.div
                                    animate={{ y: [-140, 140] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
                                    <button 
                                        onClick={() => {
                                            setCameraActive(false);
                                            setTimeout(() => {
                                                setCameraActive(true);
                                            }, 500);
                                        }} 
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scanner Info */}
                        {scannerSession && (
                            <div className="absolute top-20 left-4">
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                    <p className="text-xs text-white/80">
                                        {scannerSession.scanner_name} | {scannerSession.scanner_location}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Check-in Button */}
                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                            <button
                                onClick={() => {
                                    if (selectedTicket) {
                                        setShowConfirm(true);
                                    } else {
                                        showError('Please scan a ticket first');
                                    }
                                }}
                                className="p-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg hover:scale-105 transition-transform"
                            >
                                <UserCheck className="w-8 h-8 text-white" />
                            </button>
                        </div>

                        {/* Stats Bar */}
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

                        {/* Status Indicator */}
                        <div className="absolute top-20 right-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/80 backdrop-blur-sm rounded-full">
                                <Activity className="w-3 h-3 text-white animate-pulse" />
                                <span className="text-xs text-white">Ready to Scan</span>
                            </div>
                        </div>

                        {/* Instruction */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                            <p className="text-xs text-white/80">Position QR code in the frame</p>
                        </div>
                    </div>
                </>
            )}

            {/* Manual Input Modal */}
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
                                disabled={isProcessing}
                            />
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-800 flex items-center gap-2">
                                    <InfoIcon className="w-3 h-3" />
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
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleManualCheckIn} 
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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
                                    <span className="text-sm font-mono font-semibold text-teal-600">{selectedTicket.ticket_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Event</span>
                                    <span className="text-sm font-medium">{selectedTicket.event_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Customer</span>
                                    <span className="text-sm">{selectedTicket.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Seat</span>
                                    <span className="text-sm">{selectedTicket.seat_info}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Time</span>
                                    <span className="text-sm">{selectedTicket.event_date} at {selectedTicket.event_time}</span>
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
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleCheckIn} 
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
                                </div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-white/30 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScanQRCode;