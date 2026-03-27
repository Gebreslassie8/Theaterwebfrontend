class TheaterBookingService {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
        this.locks = JSON.parse(localStorage.getItem('booking_locks') || '{}');
        this.cleanExpiredLocks();
    }

    // Clean expired locks every minute
    cleanExpiredLocks() {
        setInterval(() => {
            const now = Date.now();
            let changed = false;
            Object.keys(this.locks).forEach(key => {
                if (this.locks[key].expiresAt < now) {
                    delete this.locks[key];
                    changed = true;
                }
            });
            if (changed) {
                localStorage.setItem('booking_locks', JSON.stringify(this.locks));
            }
        }, 60000);
    }

    // Lock seats for a specific show date and time combination
    lockSeats(showId, date, time, tickets, userId) {
        // Create a unique key for this specific show, date, and time
        const lockKey = `${showId}_${date}_${time}`;
        const now = Date.now();
        const lockDuration = 15 * 60 * 1000; // 15 minutes lock

        // Check if there's an existing lock for this EXACT show, date, and time
        if (this.locks[lockKey]) {
            const existingLock = this.locks[lockKey];

            // Only block if it's a DIFFERENT user trying to book the SAME show at the SAME time
            if (existingLock.userId !== userId && existingLock.expiresAt > now) {
                return {
                    success: false,
                    error: `This show at ${date} ${time} is currently being booked by another user. Please try again in a few minutes.`,
                    lockKey: lockKey
                };
            }

            // If same user, extend the lock
            if (existingLock.userId === userId) {
                existingLock.expiresAt = now + lockDuration;
                existingLock.tickets = tickets;
                localStorage.setItem('booking_locks', JSON.stringify(this.locks));
                return { success: true, lockKey, isExisting: true };
            }
        }

        // Create new lock
        this.locks[lockKey] = {
            userId,
            tickets,
            expiresAt: now + lockDuration,
            showId,
            date,
            time
        };

        localStorage.setItem('booking_locks', JSON.stringify(this.locks));
        return { success: true, lockKey, isExisting: false };
    }

    // Release locked seats
    releaseLock(showId, date, time, userId) {
        const lockKey = `${showId}_${date}_${time}`;
        const lock = this.locks[lockKey];

        // Only release if it's the same user who locked it
        if (lock && lock.userId === userId) {
            delete this.locks[lockKey];
            localStorage.setItem('booking_locks', JSON.stringify(this.locks));
            return true;
        }
        return false;
    }

    // Check if user already has a booking for this specific show (not all shows)
    hasUserBooked(showId, email, phone) {
        return this.bookings.some(booking =>
            booking.showId === showId &&
            (booking.customer.email === email || booking.customer.phone === phone) &&
            booking.status === 'confirmed'
        );
    }

    // Get available seats for a specific show date and time
    getAvailableSeats(show, showId, date, time) {
        // Find the specific date in the show's dates
        const dateInfo = show.dates.find(d => d.date === date && d.time === time);
        if (!dateInfo) return 0;

        // Count confirmed bookings for this specific show, date, and time
        const bookedSeats = this.bookings
            .filter(b =>
                b.showId === showId &&
                b.date === date &&
                b.time === time &&
                b.status === 'confirmed'
            )
            .reduce((total, b) => total + b.tickets, 0);

        // Count locked seats for this specific show, date, and time
        const lockKey = `${showId}_${date}_${time}`;
        const lockedSeats = this.locks[lockKey]?.tickets || 0;

        const available = dateInfo.availableSeats - bookedSeats - lockedSeats;
        return Math.max(0, available);
    }

    // Create booking with validation
    async createBooking(bookingData, show) {
        // Check if user already booked THIS SPECIFIC show
        if (this.hasUserBooked(bookingData.showId, bookingData.customer.email, bookingData.customer.phone)) {
            return {
                success: false,
                error: 'You have already booked this show. Each person can only book one ticket per show.'
            };
        }

        // Check availability for THIS SPECIFIC show, date, and time
        const availableSeats = this.getAvailableSeats(
            show,
            bookingData.showId,
            bookingData.date,
            bookingData.time
        );

        if (availableSeats < bookingData.tickets) {
            return {
                success: false,
                error: `Only ${availableSeats} seats available for this show. Please reduce the number of tickets.`
            };
        }

        // Verify lock is still valid for THIS SPECIFIC show, date, and time
        const lockKey = `${bookingData.showId}_${bookingData.date}_${bookingData.time}`;
        const lock = this.locks[lockKey];

        if (lock && lock.userId !== bookingData.userId && lock.expiresAt > Date.now()) {
            return {
                success: false,
                error: 'This show is currently being booked by another user. Please try again.'
            };
        }

        // Create booking
        const booking = {
            ...bookingData,
            id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            bookingDate: new Date().toISOString(),
            status: 'confirmed',
            paymentStatus: 'pending'
        };

        this.bookings.push(booking);
        localStorage.setItem('theater_bookings', JSON.stringify(this.bookings));

        // Release lock after booking
        this.releaseLock(bookingData.showId, bookingData.date, bookingData.time, bookingData.userId);

        return { success: true, booking };
    }

    // Cancel booking
    cancelBooking(bookingId, email) {
        const bookingIndex = this.bookings.findIndex(b => b.id === bookingId && b.customer.email === email);
        if (bookingIndex !== -1) {
            this.bookings[bookingIndex].status = 'cancelled';
            localStorage.setItem('theater_bookings', JSON.stringify(this.bookings));
            return { success: true };
        }
        return { success: false, error: 'Booking not found' };
    }

    // Get user bookings
    getUserBookings(email, phone) {
        return this.bookings.filter(b =>
            b.customer.email === email || b.customer.phone === phone
        );
    }

    // Get lock info for a specific show
    getLockInfo(showId, date, time) {
        const lockKey = `${showId}_${date}_${time}`;
        const lock = this.locks[lockKey];
        if (lock && lock.expiresAt > Date.now()) {
            return {
                isLocked: true,
                expiresAt: lock.expiresAt,
                tickets: lock.tickets
            };
        }
        return { isLocked: false };
    }
}

export default new TheaterBookingService();