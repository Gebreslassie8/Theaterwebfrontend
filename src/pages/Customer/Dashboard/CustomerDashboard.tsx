// src/pages/Customer/Dashboard/CustomerDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Ticket,
    Star,
    Heart,
    Clock,
    MapPin,
    DollarSign,
    Award,
    Gift,
    QrCode,
    ChevronRight,
    TrendingUp,
    Wallet,
    CheckCircle,
    XCircle,
    Headphones
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

// ==================== TYPES (Extended) ====================
interface User {
    id?: string | number;
    name?: string;
    email?: string;
    role: string;
    phone?: string;
    profileImage?: string;
    membershipTier?: 'basic' | 'premium' | 'vip';
    [key: string]: any;
}

interface OutletContext {
    user: User;
    onUserUpdate?: (user: User) => void;
}

interface UpcomingShow {
    id: number;
    title: string;
    venue: string;
    date: string;
    time: string;
    image: string;
    price: number;
    seats: string;
    status: 'confirmed' | 'pending' | 'cancelled';
}

interface RecommendedShow {
    id: number;
    title: string;
    genre: string;
    rating: number;
    price: number;
    image: string;
    venue: string;
    date: string;
}

interface Transaction {
    id: string;
    show: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'refunded';
    tickets: number;
}

interface LoyaltyPoint {
    total: number;
    thisMonth: number;
    nextReward: number;
    tier: string;
}

interface Stats {
    ticketsBooked: number;
    upcomingShows: number;
    pointsEarned: number;
    savedAmount: number;
    totalSpent: number;
    favoriteGenre: string;
    favoriteVenue: string;
    memberSince: string;
}

// New types for extended capabilities
interface Movie {
    id: string;
    title: string;
    genre: string;
    language: string;
    duration: number;
    cast: string[];
    director: string;
    rating: number;
    description: string;
    posterUrl: string;
    trailerUrl: string;
    releaseDate: string;
    isRunning: boolean;
    isUpcoming: boolean;
    featured?: boolean;
}

interface Seat {
    id: string;
    row: string;
    number: number;
    type: 'regular' | 'vip';
    status: 'available' | 'booked' | 'selected';
}

interface Show {
    id: string;
    movieId: string;
    theatre: string;
    hall: string;
    date: string;
    time: string;
    availableSeats: Seat[];
    priceRegular: number;
    priceVip: number;
}

interface Booking {
    id: string;
    showId: string;
    movieTitle: string;
    theatre: string;
    hall: string;
    date: string;
    time: string;
    seats: Seat[];
    totalAmount: number;
    paymentMethod: string;
    status: 'confirmed' | 'cancelled';
    bookingDate: string;
}

interface WatchlistItem {
    movieId: string;
    addedAt: string;
    reminderSet: boolean;
    reminderDate?: string;
}

// ==================== EXTENSIVE MOCK DATA ====================
const generateSeatsForHall = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seatsPerRow = 12;
    for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            const isVip = row === 'A' || row === 'B';
            const status = Math.random() < 0.25 ? 'booked' : 'available';
            seats.push({
                id: `${row}${i}`,
                row,
                number: i,
                type: isVip ? 'vip' : 'regular',
                status,
            });
        }
    }
    return seats;
};

const MOCK_MOVIES: Movie[] = [
    {
        id: 'm1', title: 'Inception: Resurgence', genre: 'Action', language: 'English', duration: 148,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], director: 'Christopher Nolan', rating: 8.9,
        description: 'Dreams collide once more in this mind-bending sequel.',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-01-15', isRunning: true, isUpcoming: false, featured: true,
    },
    {
        id: 'm2', title: 'Jolly LLB 3', genre: 'Comedy', language: 'Hindi', duration: 135,
        cast: ['Akshay Kumar', 'Arshad Warsi'], director: 'Subhash Kapoor', rating: 8.2,
        description: 'The hilarious courtroom drama returns.',
        posterUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-01-20', isRunning: true, isUpcoming: false,
    },
    {
        id: 'm3', title: 'The Batman: Shadow of Gotham', genre: 'Action', language: 'English', duration: 175,
        cast: ['Robert Pattinson', 'Zoë Kravitz'], director: 'Matt Reeves', rating: 9.0,
        description: 'The Dark Knight faces a new terror.',
        posterUrl: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-02-05', isRunning: false, isUpcoming: true, featured: true,
    },
    {
        id: 'm4', title: 'Vikram Vedha 2', genre: 'Action', language: 'Tamil', duration: 160,
        cast: ['Madhavan', 'Vijay Sethupathi'], director: 'Pushkar-Gayathri', rating: 8.7,
        description: 'The cat-and-mouse game intensifies.',
        posterUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-01-25', isRunning: true, isUpcoming: false,
    },
    {
        id: 'm5', title: 'Love in Tokyo', genre: 'Romance', language: 'Hindi', duration: 142,
        cast: ['Ranbir Kapoor', 'Alia Bhatt'], director: 'Ayan Mukerji', rating: 8.0,
        description: 'A cross-cultural romance.',
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-01-28', isRunning: true, isUpcoming: false,
    },
    {
        id: 'm6', title: 'Dune: Part Two', genre: 'Sci-Fi', language: 'English', duration: 166,
        cast: ['Timothée Chalamet', 'Zendaya'], director: 'Denis Villeneuve', rating: 9.1,
        description: 'The epic journey continues on Arrakis.',
        posterUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-02-12', isRunning: false, isUpcoming: true,
    },
    {
        id: 'm7', title: 'Kalki 2898 AD', genre: 'Sci-Fi', language: 'Telugu', duration: 180,
        cast: ['Prabhas', 'Deepika Padukone'], director: 'Nag Ashwin', rating: 8.5,
        description: 'A dystopian future where myth meets technology.',
        posterUrl: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-02-18', isRunning: false, isUpcoming: true, featured: true,
    },
    {
        id: 'm8', title: 'Deadpool 3', genre: 'Comedy', language: 'English', duration: 130,
        cast: ['Ryan Reynolds', 'Hugh Jackman'], director: 'Shawn Levy', rating: 8.8,
        description: 'The Merc with a Mouth is back.',
        posterUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop',
        trailerUrl: '', releaseDate: '2025-02-25', isRunning: false, isUpcoming: true,
    },
];

// Generate shows for running movies
const generateShows = (): Show[] => {
    const theatres = ['Grand Cinemas', 'PVR Platinum', 'Cinepolis', 'INOX', 'AMC Theatre'];
    const halls = ['Hall 1', 'Hall 2', 'IMAX', '4DX', 'Screen X'];
    const dates = ['2025-01-30', '2025-01-31', '2025-02-01'];
    const times = ['10:00', '13:30', '16:45', '20:00', '22:30'];
    const shows: Show[] = [];
    const runningMovies = MOCK_MOVIES.filter(m => m.isRunning);
    runningMovies.forEach((movie, idx) => {
        const numShows = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numShows; i++) {
            const theatre = theatres[idx % theatres.length];
            const hall = halls[(idx + i) % halls.length];
            const date = dates[i % dates.length];
            const time = times[(idx + i) % times.length];
            shows.push({
                id: `s${movie.id}${i}`,
                movieId: movie.id,
                theatre,
                hall,
                date,
                time,
                availableSeats: generateSeatsForHall(),
                priceRegular: 10 + Math.floor(Math.random() * 8),
                priceVip: 18 + Math.floor(Math.random() * 12),
            });
        }
    });
    return shows;
};

const MOCK_SHOWS = generateShows();

// Helper
const getMovieById = (id: string): Movie | undefined => MOCK_MOVIES.find(m => m.id === id);

// ==================== SUB-COMPONENTS (Seat Map, Booking Modal) ====================
const SeatMap: React.FC<{
    seats: Seat[];
    onSelectSeat: (seat: Seat) => void;
    selectedSeats: Seat[];
}> = ({ seats, onSelectSeat, selectedSeats }) => {
    const rows = [...new Set(seats.map(s => s.row))];
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[650px] bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-inner">
                <div className="text-center mb-3 text-gray-500 text-sm font-semibold tracking-wider">🎬 SCREEN 🎬</div>
                <div className="border-t-4 border-gray-400 w-full mb-6 rounded-full"></div>
                {rows.map(row => (
                    <div key={row} className="flex justify-center mb-2">
                        <div className="w-8 text-center font-bold text-gray-600">{row}</div>
                        {seats.filter(s => s.row === row).sort((a, b) => a.number - b.number).map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            let bgColor = 'bg-gray-300';
                            if (seat.status === 'booked') bgColor = 'bg-red-300 cursor-not-allowed';
                            else if (isSelected) bgColor = 'bg-green-500 shadow-lg';
                            else if (seat.type === 'vip') bgColor = 'bg-amber-400 hover:bg-amber-500';
                            else bgColor = 'bg-blue-400 hover:bg-blue-500';
                            return (
                                <button
                                    key={seat.id}
                                    className={`w-8 h-8 m-1 rounded-md text-xs font-bold transition-all duration-150 ${bgColor} ${seat.status !== 'booked' ? 'hover:scale-105' : ''}`}
                                    onClick={() => seat.status !== 'booked' && onSelectSeat(seat)}
                                    disabled={seat.status === 'booked'}
                                    title={`${seat.row}${seat.number} - ${seat.type === 'vip' ? 'VIP' : 'Regular'}`}
                                >
                                    {seat.number}
                                </button>
                            );
                        })}
                    </div>
                ))}
                <div className="flex justify-center gap-6 mt-6 text-xs">
                    <div className="flex items-center"><div className="w-4 h-4 rounded bg-blue-400 mr-1"></div> Regular</div>
                    <div className="flex items-center"><div className="w-4 h-4 rounded bg-amber-400 mr-1"></div> VIP</div>
                    <div className="flex items-center"><div className="w-4 h-4 rounded bg-green-500 mr-1"></div> Your Selection</div>
                    <div className="flex items-center"><div className="w-4 h-4 rounded bg-red-300 mr-1"></div> Booked</div>
                </div>
            </div>
        </div>
    );
};

const BookingModal: React.FC<{
    show: Show | null;
    movie: Movie | null;
    onClose: () => void;
    onBookingSuccess: (booking: Booking) => void;
}> = ({ show, movie, onClose, onBookingSuccess }) => {
    const [step, setStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (!show || !movie) return null;

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat.type === 'vip' ? show.priceVip : show.priceRegular), 0);

    const handleSelectSeat = (seat: Seat) => {
        if (selectedSeats.some(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        setStep('payment');
    };

    const handleConfirmPayment = () => {
        const newBooking: Booking = {
            id: `b${Date.now()}${Math.random()}`,
            showId: show.id,
            movieTitle: movie.title,
            theatre: show.theatre,
            hall: show.hall,
            date: show.date,
            time: show.time,
            seats: selectedSeats.map(s => ({ ...s, status: 'booked' })),
            totalAmount,
            paymentMethod,
            status: 'confirmed',
            bookingDate: new Date().toISOString(),
        };
        onBookingSuccess(newBooking);
        setStep('confirmation');
    };

    if (step === 'confirmation') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
                    <div className="text-green-500 text-7xl mb-4 animate-bounce">✓</div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
                    <p className="text-gray-600">Your tickets have been booked successfully.</p>
                    <button onClick={onClose} className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg">Close</button>
                </div>
            </div>
        );
    }





    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-800">🎟️ Book Tickets</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <h3 className="font-bold text-xl">{movie.title}</h3>
                        <p className="text-gray-600">{show.theatre} - {show.hall} | {show.date} at {show.time}</p>
                    </div>
                    {step === 'seats' && (
                        <>
                            <SeatMap seats={show.availableSeats} onSelectSeat={handleSelectSeat} selectedSeats={selectedSeats} />
                            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                                <div className="bg-gray-100 px-4 py-2 rounded-full">
                                    <span className="font-semibold">Selected Seats: </span>
                                    {selectedSeats.length ? selectedSeats.map(s => s.id).join(', ') : 'None'}
                                </div>
                                <button onClick={handleProceedToPayment} className="bg-indigo-600 text-white px-8 py-2 rounded-full hover:bg-indigo-700">Continue to Payment →</button>
                            </div>
                        </>
                    )}
                    {step === 'payment' && (
                        <div>
                            <div className="bg-gray-50 p-5 rounded-xl mb-6">
                                <h3 className="font-bold text-lg mb-3">📋 Booking Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p>Movie:</p><p className="font-medium">{movie.title}</p>
                                    <p>Show:</p><p className="font-medium">{show.date} {show.time}</p>
                                    <p>Seats:</p><p className="font-medium">{selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}</p>
                                    <p>Total:</p><p className="font-bold text-lg text-green-600">${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block font-semibold mb-2">Payment Method</label>
                                <div className="flex gap-4 flex-wrap">
                                    {['card', 'mobile_money', 'paypal'].map(method => (
                                        <label key={method} className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                                            <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <span className="capitalize">{method.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleConfirmPayment} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-lg">💳 Pay ${totalAmount.toFixed(2)}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
const CustomerDashboard: React.FC = () => {
    const { user } = useOutletContext<OutletContext>();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [showBalance, setShowBalance] = useState<boolean>(true);

    // Extended state for new features
    const [bookings, setBookings] = useState<Booking[]>([
        {
            id: 'b1', showId: 'sm10', movieTitle: 'Inception: Resurgence', theatre: 'Grand Cinemas', hall: 'IMAX',
            date: '2025-01-30', time: '16:45', seats: [{ id: 'A5', row: 'A', number: 5, type: 'vip', status: 'booked' }],
            totalAmount: 20, paymentMethod: 'card', status: 'confirmed', bookingDate: '2025-01-25T10:00:00Z',
        },
        {
            id: 'b2', showId: 'sm21', movieTitle: 'Jolly LLB 3', theatre: 'PVR Platinum', hall: 'Hall 1',
            date: '2025-01-31', time: '13:30', seats: [{ id: 'C3', row: 'C', number: 3, type: 'regular', status: 'booked' }],
            totalAmount: 12, paymentMethod: 'mobile_money', status: 'confirmed', bookingDate: '2025-01-26T14:20:00Z',
        },
    ]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
        { movieId: 'm3', addedAt: '2025-01-20', reminderSet: true, reminderDate: '2025-02-05' },
        { movieId: 'm6', addedAt: '2025-01-22', reminderSet: false },
        { movieId: 'm7', addedAt: '2025-01-23', reminderSet: true, reminderDate: '2025-02-18' },
    ]);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ genre: '', language: '', date: '' });

    // Existing data (unchanged)
    const stats: Stats = {
        ticketsBooked: 24, upcomingShows: 5, pointsEarned: 1250, savedAmount: 85, totalSpent: 342,
        favoriteGenre: "Musical", favoriteVenue: "Grand Theater", memberSince: "2024-01-15"
    };
    const loyaltyPoints: LoyaltyPoint = { total: 1250, thisMonth: 320, nextReward: 1750, tier: "Premium" };
    const upcomingShows: UpcomingShow[] = [
        { id: 1, title: "The Lion King", venue: "Grand Theater", date: "2024-12-20", time: "7:00 PM", image: "https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=400&h=250&fit=crop", price: 45, seats: "A12, A13", status: "confirmed" },
        { id: 2, title: "Hamilton", venue: "City Cinema", date: "2024-12-25", time: "8:30 PM", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop", price: 65, seats: "B5", status: "confirmed" },
        { id: 3, title: "Wicked", venue: "Star Theater", date: "2024-12-28", time: "6:00 PM", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop", price: 55, seats: "C8, C9", status: "pending" }
    ];
    const recommendedShows: RecommendedShow[] = [
        { id: 1, title: "Chicago", genre: "Musical", rating: 4.6, price: 50, image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=250&fit=crop", venue: "Grand Theater", date: "2024-12-30" },
        { id: 2, title: "Phantom of Opera", genre: "Drama", rating: 4.8, price: 60, image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=250&fit=crop", venue: "Royal Opera", date: "2025-01-05" },
        { id: 3, title: "Mamma Mia!", genre: "Comedy", rating: 4.5, price: 45, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop", venue: "City Cinema", date: "2025-01-10" }
    ];
    const transactions: Transaction[] = [
        { id: '#TR-2024-001', show: 'The Lion King', amount: 90, date: 'Dec 15, 2024', status: 'completed', tickets: 2 },
        { id: '#TR-2024-002', show: 'Hamilton', amount: 65, date: 'Dec 10, 2024', status: 'completed', tickets: 1 },
        { id: '#TR-2024-003', show: 'Wicked', amount: 110, date: 'Dec 5, 2024', status: 'completed', tickets: 2 },
        { id: '#TR-2024-004', show: 'Chicago', amount: 50, date: 'Nov 28, 2024', status: 'refunded', tickets: 1 },
    ];
    const genreData = [{ name: 'Musical', value: 45, color: '#22c55e' }, { name: 'Drama', value: 25, color: '#06b6d4' }, { name: 'Comedy', value: 20, color: '#facc15' }, { name: 'Romance', value: 10, color: '#7c3aed' }];
    const spendingData = [{ month: 'Jul', amount: 45 }, { month: 'Aug', amount: 90 }, { month: 'Sep', amount: 65 }, { month: 'Oct', amount: 110 }, { month: 'Nov', amount: 85 }, { month: 'Dec', amount: 155 }];

    // Derived for new features
    const runningMovies = MOCK_MOVIES.filter(m => m.isRunning);
    const upcomingMovies = MOCK_MOVIES.filter(m => m.isUpcoming);

    const handleBookingSuccess = (newBooking: Booking) => {
        setBookings([newBooking, ...bookings]);
        setSelectedShow(null);
        setSelectedMovieForBooking(null);
    };

    const handleCancelBooking = (bookingId: string) => {
        if (window.confirm('Cancel this booking? Tickets cannot be reused.')) {
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        }
    };

    const handleDownloadTicket = (booking: Booking) => {
        alert(`📄 Ticket Downloaded (demo)\nMovie: ${booking.movieTitle}\nSeats: ${booking.seats.map(s => s.id).join(',')}\nTotal: $${booking.totalAmount}`);
    };

    const handleToggleWatchlist = (movieId: string) => {
        if (watchlist.some(w => w.movieId === movieId)) {
            setWatchlist(watchlist.filter(w => w.movieId !== movieId));
        } else {
            setWatchlist([...watchlist, { movieId, addedAt: new Date().toISOString(), reminderSet: false }]);
        }
    };

    const handleSetReminder = (movieId: string, releaseDate: string) => {
        const reminderDate = prompt('Set reminder date (YYYY-MM-DD):', releaseDate);
        if (reminderDate) {
            setWatchlist(watchlist.map(w => w.movieId === movieId ? { ...w, reminderSet: true, reminderDate } : w));
            alert(`Reminder set for ${reminderDate}`);
        }
    };

    const filteredMovies = () => {
        let movies = MOCK_MOVIES;
        if (searchTerm) movies = movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filters.genre) movies = movies.filter(m => m.genre === filters.genre);
        if (filters.language) movies = movies.filter(m => m.language === filters.language);
        return movies;
    };

    const filteredShows = () => {
        let shows = MOCK_SHOWS;
        if (searchTerm) {
            const movieIds = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map(m => m.id);
            shows = shows.filter(s => movieIds.includes(s.movieId));
        }
        if (filters.date) shows = shows.filter(s => s.date === filters.date);
        return shows;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 12 } }
    };

    return (
        <div className="lg:ml-2">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Welcome Header (unchanged) */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0">{/* floating bubbles */}</div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-xl rounded-full mb-3 sm:mb-4">
                                    <Star className="h-3 w-3 sm:h-4 sm:w-4" /><span className="text-xs sm:text-sm font-medium">✨ {loyaltyPoints.tier} Member</span>
                                </motion.div>
                                <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>Welcome back, {user?.name || 'Customer'}!</motion.h1>
                                <motion.p className="text-white/80 text-base sm:text-lg" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>Discover amazing shows and earn rewards</motion.p>
                            </div>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 min-w-[200px]">
                                <div className="flex items-center justify-between mb-2"><span className="text-xs text-white/70">Loyalty Points</span><Award className="h-4 w-4 text-yellow-400" /></div>
                                <div className="flex items-baseline gap-2"><span className="text-2xl font-bold">{loyaltyPoints.total}</span><span className="text-xs text-white/70">points</span></div>
                                <div className="mt-2"><div className="flex justify-between text-[10px] text-white/70 mb-1"><span>To next reward</span><span>{loyaltyPoints.nextReward - loyaltyPoints.total} points left</span></div><div className="w-full bg-white/20 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${(loyaltyPoints.total / loyaltyPoints.nextReward) * 100}%` }} /></div></div>
                            </motion.div>
                        </div>
                        <motion.div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                            <QuickStatBadge icon={Calendar} label="Member Since" value={new Date(stats.memberSince).toLocaleDateString()} />
                            <QuickStatBadge icon={Ticket} label="Tickets Booked" value={stats.ticketsBooked} />
                            <QuickStatBadge icon={TrendingUp} label="Saved" value={`$${stats.savedAmount}`} />
                            <QuickStatBadge icon={Heart} label="Favorite Genre" value={stats.favoriteGenre} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* NEW: Tab Navigation */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                    {[
                        { id: 'overview', label: '🏠 Dashboard' },
                        { id: 'browse', label: '🎬 Browse Shows' },
                        { id: 'schedule', label: '📅 Schedule' },
                        { id: 'mybookings', label: '🎟️ My Bookings' },
                        { id: 'watchlist', label: '❤️ Watchlist' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>{tab.label}</button>
                    ))}
                </div>

                {/* ==================== CONDITIONAL RENDERING ==================== */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid (unchanged) */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <StatCard title="Upcoming Shows" value={stats.upcomingShows} icon={Calendar} change="+2" trend="up" color="from-green-500 to-green-600" delay={0.1} dateRange="month" />
                            <StatCard title="Points Earned" value={loyaltyPoints.thisMonth} icon={Star} change="+150" trend="up" color="from-yellow-500 to-yellow-600" delay={0.2} dateRange="month" />
                            <StatCard title="Total Spent" value={`$${stats.totalSpent}`} icon={DollarSign} change="+$45" trend="up" color="from-cyan-500 to-cyan-600" delay={0.3} dateRange="month" />
                            <StatCard title="Wallet Balance" value={showBalance ? "$45.50" : "****"} icon={Wallet} change="+$20" trend="up" color="from-purple-500 to-purple-600" delay={0.4} dateRange="month" />
                        </motion.div>

                        {/* Upcoming Shows Section (unchanged) */}
                        <motion.div variants={itemVariants}><div className="flex items-center justify-between mb-4"><h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Upcoming Shows</h2><button className="text-sm text-purple-600 hover:underline flex items-center gap-1">View All <ChevronRight className="h-4 w-4" /></button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{upcomingShows.map((show, index) => (<motion.div key={show.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"><img src={show.image} alt={show.title} className="w-full h-40 object-cover" /><div className="p-4"><div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-gray-900">{show.title}</h3><p className="text-sm text-gray-500">{show.venue}</p></div><span className={`text-xs px-2 py-1 rounded-full ${show.status === 'confirmed' ? 'bg-green-100 text-green-700' : show.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{show.status}</span></div><div className="space-y-2 mt-3"><div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="h-4 w-4 text-purple-600" /><span>{new Date(show.date).toLocaleDateString()} at {show.time}</span></div><div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4 text-purple-600" /><span>{show.venue}</span></div><div className="flex items-center gap-2 text-sm text-gray-600"><Ticket className="h-4 w-4 text-purple-600" /><span>Seats: {show.seats}</span></div></div><div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><QrCode className="h-5 w-5 text-gray-400" /><span className="text-xs text-gray-500">E-Ticket Available</span></div><button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">View Ticket</button></div></div></motion.div>))}</div></motion.div>

                        {/* Recommended & Analytics */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2"><div className="flex items-center justify-between mb-4"><h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You</h2><button className="text-sm text-purple-600 hover:underline flex items-center gap-1">See All <ChevronRight className="h-4 w-4" /></button></div><div className="space-y-4">{recommendedShows.map((show, index) => (<motion.div key={show.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex gap-4"><img src={show.image} alt={show.title} className="w-24 h-24 rounded-xl object-cover" /><div className="flex-1"><div className="flex items-start justify-between"><div><h3 className="font-semibold text-gray-900">{show.title}</h3><div className="flex items-center gap-2 mt-1"><span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{show.genre}</span><div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span className="text-xs text-gray-600">{show.rating}</span></div></div></div><div className="text-right"><div className="text-lg font-bold text-purple-600">${show.price}</div><div className="text-xs text-gray-500">per ticket</div></div></div><div className="flex items-center gap-4 mt-2 text-xs text-gray-500"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(show.date).toLocaleDateString()}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{show.venue}</span></div><button onClick={() => { const movie = MOCK_MOVIES.find(m => m.title === show.title); if (movie) { const s = MOCK_SHOWS.find(sh => sh.movieId === movie.id); if (s) { setSelectedShow(s); setSelectedMovieForBooking(movie); } else alert('No shows available'); } }} className="mt-2 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">Book Now</button></div></motion.div>))}</div></div>
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200"><h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={spendingData}><defs><linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} /><stop offset="95%" stopColor="#7c3aed" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 10 }} /><YAxis stroke="#6B7280" tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} fill="url(#spendingGradient)" /></AreaChart></ResponsiveContainer></div></div>
                        </motion.div>

                        {/* Recent Transactions & Genre Preferences */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200"><h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3><div className="space-y-3">{transactions.map((transaction, index) => (<motion.div key={transaction.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${transaction.status === 'completed' ? 'bg-green-100' : transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}>{transaction.status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> : transaction.status === 'pending' ? <Clock className="h-4 w-4 text-yellow-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div><div><p className="text-sm font-medium text-gray-900">{transaction.show}</p><p className="text-xs text-gray-500">{transaction.date} • {transaction.tickets} tickets</p></div></div><div className="text-right"><p className="text-sm font-bold text-gray-900">${transaction.amount}</p><p className="text-xs text-gray-500">{transaction.id}</p></div></motion.div>))}</div></div>
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200"><h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Your Genre Preferences</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={genreData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>{genreData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></RePieChart></ResponsiveContainer></div><div className="mt-4 grid grid-cols-2 gap-2">{genreData.map((genre, index) => (<div key={index} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: genre.color }} /><span className="text-xs text-gray-600">{genre.name}</span><span className="text-xs font-semibold text-gray-900 ml-auto">{genre.value}%</span></div>))}</div></div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <QuickActionButton icon={Ticket} text="Book Tickets" color="primary" onClick={() => setActiveTab('browse')} />
                            <QuickActionButton icon={Wallet} text="Add Funds" color="success" onClick={() => alert('Add funds feature coming soon')} />
                            <QuickActionButton icon={Gift} text="Redeem Points" color="warning" onClick={() => alert('Redeem points coming soon')} />
                            <QuickActionButton icon={Headphones} text="Support" color="info" onClick={() => alert('Contact support')} />
                        </motion.div>
                    </>
                )}

                {/* BROWSE SHOWS TAB */}
                {activeTab === 'browse' && (
                    <div>
                        <div className="bg-white p-5 rounded-xl shadow-md mb-6">
                            <div className="flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[200px]"><label className="block text-sm font-medium mb-1">Search</label><input type="text" placeholder="Movie title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400" /></div>
                                <div><label className="block text-sm font-medium mb-1">Genre</label><select onChange={(e) => setFilters({ ...filters, genre: e.target.value })} className="border rounded-lg px-4 py-2"><option value="">All</option><option>Action</option><option>Comedy</option><option>Romance</option><option>Sci-Fi</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">Language</label><select onChange={(e) => setFilters({ ...filters, language: e.target.value })} className="border rounded-lg px-4 py-2"><option value="">All</option><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMovies().map(movie => (
                                <div key={movie.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                                    <div className="p-5">
                                        <div className="flex justify-between"><h3 className="font-bold text-xl">{movie.title}</h3><button onClick={() => handleToggleWatchlist(movie.id)} className="text-2xl">{watchlist.some(w => w.movieId === movie.id) ? '❤️' : '🤍'}</button></div>
                                        <div className="flex items-center mt-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="ml-1 text-sm text-gray-600">{movie.rating}</span></div>
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{movie.description}</p>
                                        <div className="mt-3 flex flex-wrap gap-1 text-xs"><span className="bg-gray-200 px-2 py-1 rounded">{movie.genre}</span><span className="bg-gray-200 px-2 py-1 rounded">{movie.language}</span><span className="bg-gray-200 px-2 py-1 rounded">{movie.duration} min</span></div>
                                        <button onClick={() => { const show = MOCK_SHOWS.find(s => s.movieId === movie.id); if (show) { setSelectedShow(show); setSelectedMovieForBooking(movie); } else alert('No shows scheduled'); }} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700">View Schedules & Book</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' && (
                    <div>
                        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex gap-4 items-center"><input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="border rounded-lg px-3 py-2" /><button onClick={() => setFilters({ ...filters, date: '' })} className="bg-gray-200 px-4 py-2 rounded-lg">Clear Filter</button></div>
                        <div className="space-y-4">
                            {filteredShows().map(show => {
                                const movie = getMovieById(show.movieId);
                                if (!movie) return null;
                                return (
                                    <div key={show.id} className="bg-white rounded-xl shadow-md p-5 flex flex-wrap justify-between items-center gap-4">
                                        <div><h3 className="font-bold text-lg">{movie.title}</h3><p className="text-sm text-gray-600">{show.theatre} • {show.hall}</p><p className="text-sm">{show.date} at {show.time}</p><p className="text-xs mt-1">💰 Regular: ${show.priceRegular} | VIP: ${show.priceVip}</p></div>
                                        <button onClick={() => { setSelectedShow(show); setSelectedMovieForBooking(movie); }} className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700">Select & Book →</button>
                                    </div>
                                );
                            })}
                            {filteredShows().length === 0 && <p className="text-center text-gray-500 py-10">No shows match your criteria.</p>}
                        </div>
                    </div>
                )}

                {/* MY BOOKINGS TAB */}
                {activeTab === 'mybookings' && (
                    <div className="space-y-5">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-md p-5">
                                <div className="flex flex-wrap justify-between items-start gap-3">
                                    <div><h3 className="font-bold text-xl">{booking.movieTitle}</h3><p className="text-gray-600">{booking.theatre} | {booking.hall} | {booking.date} | {booking.time}</p><p className="text-sm">🎭 Seats: {booking.seats.map(s => s.id).join(', ')}</p><p className="text-sm font-semibold">Total: ${booking.totalAmount} | Status: <span className={booking.status === 'confirmed' ? 'text-green-600' : 'text-red-500'}>{booking.status}</span></p></div>
                                    <div className="flex gap-2">{booking.status === 'confirmed' && (<><button onClick={() => handleDownloadTicket(booking)} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">📄 Download</button><button onClick={() => handleCancelBooking(booking.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Cancel</button></>)}</div>
                                </div>
                            </div>
                        ))}
                        {bookings.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-500">No bookings yet. Start exploring movies!</div>}
                    </div>
                )}

                {/* WATCHLIST TAB */}
                {activeTab === 'watchlist' && (
                    <div className="space-y-4">
                        {watchlist.map(item => {
                            const movie = getMovieById(item.movieId);
                            if (!movie) return null;
                            return (
                                <div key={item.movieId} className="bg-white rounded-xl shadow-md p-5 flex flex-wrap justify-between items-center gap-3">
                                    <div><h3 className="font-bold text-lg">{movie.title}</h3><p className="text-sm text-gray-500">Release: {movie.releaseDate}</p>{item.reminderSet && <p className="text-xs text-green-600">🔔 Reminder: {item.reminderDate}</p>}</div>
                                    <div className="flex gap-2">{!item.reminderSet && (<button onClick={() => handleSetReminder(movie.id, movie.releaseDate)} className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">Set Reminder</button>)}<button onClick={() => handleToggleWatchlist(movie.id)} className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">Remove</button></div>
                                </div>
                            );
                        })}
                        {watchlist.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-500">Your watchlist is empty. Browse and save your favorites!</div>}
                    </div>
                )}
            </motion.div>

            {/* Booking Modal */}
            {selectedShow && selectedMovieForBooking && (
                <BookingModal show={selectedShow} movie={selectedMovieForBooking} onClose={() => { setSelectedShow(null); setSelectedMovieForBooking(null); }} onBookingSuccess={handleBookingSuccess} />
            )}
        </div>
    );
};

// ==================== STAT CARD COMPONENT ====================
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; change?: string; trend?: 'up' | 'down'; color: string; delay: number; dateRange: string }> = ({ title, value, icon: Icon, change, trend, color, delay, dateRange }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 100 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 relative overflow-hidden group">
        <div className="relative z-10"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p><p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>{change && (<div className="flex items-center gap-1 mt-2"><span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{change}</span><span className="text-[10px] sm:text-xs text-gray-500">vs last {dateRange}</span></div>)}</div><div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}><Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" /></div></div></div>
    </motion.div>
);

// ==================== QUICK ACTION BUTTON ====================
const QuickActionButton: React.FC<{ icon: React.ElementType; text: string; color: 'primary' | 'success' | 'warning' | 'info' | 'error'; onClick: () => void }> = ({ icon: Icon, text, color, onClick }) => {
    const colors = { primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700', success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600', warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600', info: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600', error: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' };
    return (<button onClick={onClick} className={`p-2 sm:p-3 ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm`}><Icon className="h-4 w-4 sm:h-5 sm:w-5" /><span>{text}</span></button>);
};

// ==================== QUICK STAT BADGE ====================
const QuickStatBadge: React.FC<{ icon: React.ElementType; label: string; value: string | number; status?: 'online' | 'warning' | 'offline' }> = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-center gap-1 sm:gap-2 text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm"><Icon className="h-3 w-3 sm:h-4 sm:w-4" /><span className="text-xs sm:text-sm">{label}:</span><span className="text-xs sm:text-sm font-semibold flex items-center gap-1">{value}{status === 'online' && (<span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span></span>)}</span></div>
);

export default CustomerDashboard;