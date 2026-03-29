const sendMail = require("./sendMail");
const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");

async function sendServiceRequestNotification(requestOrEmail, requestDetails) {
    let toEmail, details;

    if (typeof requestOrEmail === 'object' && !requestDetails) {
        // We received the request object as the only argument
        const request = requestOrEmail;
        console.log(`[DEBUG] sendServiceRequestNotification: Resolving details for request ${request.id}`);
        
        // Fetch full details for the email
        const fullDetails = await ProviderModel.getBookingDetails(request.id);
        if (!fullDetails) {
            console.error(`[ERROR] sendServiceRequestNotification: No details found for request ${request.id}`);
            return;
        }

        // We need the PROVIDER'S email, not the user's
        // getBookingDetails returns the USER'S email (requester).
        // Let's get the provider's details separately.
        const provider = await ProviderModel.getProviderById(request.assigned_provider_id);
        if (!provider || !provider.email) {
            console.error(`[ERROR] sendServiceRequestNotification: No provider email found for request ${request.id}`);
            return;
        }

        toEmail = provider.email;
        details = {
            serviceName: fullDetails.service_name || "General Service",
            providerName: fullDetails.provider_name || provider.first_name || "Provider",
            tenantName: fullDetails.user_name || fullDetails.tenant_name || "Guest",
            contactNumber: fullDetails.contact_number || "Not Provided",
            address: fullDetails.address || "No address provided",
            scheduledDate: fullDetails.booking_date ? new Date(fullDetails.booking_date).toLocaleDateString() : 'TBD',
            scheduledTime: fullDetails.booking_time || 'TBD',
            propertyImage: null // We don't have this in the current schema
        };
    } else {
        // Standard call
        toEmail = requestOrEmail;
        details = requestDetails;
    }

    const {
        serviceName,
        providerName,
        tenantName,
        contactNumber,
        address,
        scheduledDate,
        scheduledTime,
        propertyImage
    } = details;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #6366f1; margin: 0;">New Service Request</h1>
                <p style="color: #666; font-size: 16px;">Hello <strong>${providerName}</strong>, you have a new booking!</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Service:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${serviceName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Scheduled For:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${scheduledDate} at ${scheduledTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Location:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${address}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Client Name:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${tenantName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Contact:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${contactNumber || 'Not Provided'}</td>
                    </tr>
                </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/provider/dashboard" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Request</a>
            </div>

            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px;">
                Sent via RentEase Platform
            </p>
        </div>
    `;

    try {
        await sendMail(toEmail, `New Service Request: ${serviceName}`, htmlContent);
        console.log("✅ Service Notification Email dispatched to provider:", toEmail);
    } catch (error) {
        console.error("❌ Error dispatching notification email:", error.message);
    }
}

module.exports = sendServiceRequestNotification;

