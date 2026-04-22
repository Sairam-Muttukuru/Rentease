const db = require('../config/db');

async function resetBooking() {
    try {
        const bookingId = 34;
        console.log(`Resetting payment status for booking #${bookingId}...`);
        
        await db.query(`
            UPDATE service_requests 
            SET service_payment_status = NULL, 
                service_receipt_number = NULL,
                status = 'Completed'
            WHERE id = $1
        `, [bookingId]);
        
        console.log('Success! Booking #34 is now marked as Completed but unpaid.');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting booking:', err);
        process.exit(1);
    }
}

resetBooking();
