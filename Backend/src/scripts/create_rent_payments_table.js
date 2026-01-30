const db = require('../config/db');

async function createRentPaymentsTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS rent_payments (
                id SERIAL PRIMARY KEY,
                tenant_id INT NOT NULL,
                property_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                payment_date DATE NOT NULL,
                due_date DATE,
                status VARCHAR(20) DEFAULT 'PAID',
                payment_gateway VARCHAR(50) DEFAULT 'Stripe',
                transaction_id VARCHAR(255),
                receipt_number VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("✅ rent_payments table created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating rent_payments table:", error);
        process.exit(1);
    }
}

createRentPaymentsTable();
