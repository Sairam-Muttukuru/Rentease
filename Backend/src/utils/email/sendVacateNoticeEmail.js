const sendMail = require('./sendMail');

const sendVacateNoticeEmail = async (landlordEmail, data) => {
    const {
        tenantName,
        propertyName,
        moveOutDate,
        reason,
        landlordName,
        propertyImage
    } = data;

    const formattedDate = new Date(moveOutDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const subject = `🏠 Vacate Notice: ${tenantName} for ${propertyName}`;

    const html = `
        <div style="background-color: #f8fafc; padding: 40px 10px; font-family: 'Outfit', sans-serif;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                
                <!-- Decoration Header -->
                <div style="background: linear-gradient(135deg, #f97316 0%, #ef4444 100%); padding: 32px 24px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Vacate Notice Received</h1>
                </div>

                <div style="padding: 32px 24px;">
                    <p style="color: #0f172a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Dear <b>${landlordName || 'Landlord'}</b>,
                    </p>
                    
                    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
                        This is a formal notification that your tenant, <b>${tenantName}</b>, has submitted a request to vacate your property.
                    </p>

                    <div style="margin: 32px 0; padding: 24px; background: #fff7ed; border-radius: 12px; border: 1px solid #ffedd5;">
                        <h2 style="color: #9a3412; font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0 0 16px 0; letter-spacing: 0.5px;">Move-Out Details</h2>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                <span style="color: #ea580c; font-weight: 600; width: 140px; font-size: 14px;">Property:</span>
                                <span style="color: #1e293b; font-size: 14px;">${propertyName}</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                <span style="color: #ea580c; font-weight: 600; width: 140px; font-size: 14px;">Move-Out Date:</span>
                                <span style="color: #1e293b; font-size: 14px;"><b>${formattedDate}</b></span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #ea580c; font-weight: 600; font-size: 14px; margin-bottom: 8px;">Reason:</span>
                                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #fed7aa; color: #4b5563; font-size: 13px; font-style: italic;">
                                    "${reason || 'No specific reason provided.'}"
                                </div>
                            </div>
                        </div>
                    </div>

                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
                        Please review this request in your RentEase Landlord Dashboard and prepare for the necessary move-out formalities, such as property inspection and security deposit settlement.
                    </p>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Login to Dashboard</a>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                        This is an automated formal notice sent via RentEase Platform.<br>
                        Thank you for using our services.
                    </p>
                </div>
            </div>
        </div>
    `;

    return await sendMail(landlordEmail, subject, html);
};

module.exports = sendVacateNoticeEmail;
