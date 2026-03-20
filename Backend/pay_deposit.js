const pool = require('./src/config/db');
const PaymentService = require('./src/services/payment/PaymentService');

async function paySecurityDeposit() {
    try {
        console.log("💰 Adding Security Deposit for Tenant 3...");
        
        const data = {
            tenant_id: 3,
            property_id: 2,
            amount: 30000,
            payment_date: new Date(),
            transaction_id: 'SEC_TX_INITIAL_' + Date.now(),
            paid_by: 'Tenant'
        };

        const payment = await PaymentService.saveSecurityDepositPayment(data);
        console.log("✅ Security Deposit Registered! ID:", payment.id);

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        process.exit();
    }
}

paySecurityDeposit();
