const sendMail = require("./sendMail");

const sendComplaintMail = async ({ landlordEmail, landlordName, tenantName, propertyName, propertyImage, complaint }) => {
  const heroImage = propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const subject = `🚨 Action Required: New Issue at ${propertyName || 'Your Property'}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Complaint Alert</title>
</head>

<body style="margin:0; padding:0; background:#f1f5f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- MAIN CARD -->
        <table width="620" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:20px; overflow:hidden;
          box-shadow:0 25px 50px rgba(15,23,42,0.15);">

          <!-- HERO -->
          <tr>
            <td style="
              height:240px;
              background-image:url('${heroImage}');
              background-size:cover;
              background-position:center;
              position:relative;
            ">
              <div style="position:absolute; inset:0;
                background:linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.85));">
              </div>

              <div style="position:relative; padding:28px;">
                <span style="
                  display:inline-block;
                  background:rgba(239,68,68,0.95);
                  color:#fff;
                  padding:6px 14px;
                  border-radius:999px;
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:.08em;
                  text-transform:uppercase;
                ">
                  URGENT
                </span>
              </div>
            </td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="padding:36px 36px 16px 36px;">
              <h1 style="
                margin:0;
                font-size:28px;
                font-weight:900;
                color:#020617;
                letter-spacing:-0.02em;
              ">
                Property Requires Attention
              </h1>

              <p style="
                margin:12px 0 0 0;
                font-size:16px;
                color:#475569;
              ">
                Hi <strong>${landlordName}</strong>, a tenant has reported an issue that needs your review.
              </p>
            </td>
          </tr>

          <!-- INFO GRID -->
          <tr>
            <td style="padding:24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:10px;">
                    <div style="
                      background:#f8fafc;
                      border-radius:14px;
                      padding:18px;
                      border:1px solid #e2e8f0;
                    ">
                      <p style="margin:0; font-size:11px; color:#64748b; font-weight:700; letter-spacing:.08em; text-transform:uppercase;">
                        Property
                      </p>
                      <p style="margin:6px 0 0 0; font-size:15px; font-weight:700; color:#0f172a;">
                        ${propertyName || "Unknown Property"}
                      </p>
                    </div>
                  </td>

                  <td width="50%" style="padding-left:10px;">
                    <div style="
                      background:#f8fafc;
                      border-radius:14px;
                      padding:18px;
                      border:1px solid #e2e8f0;
                    ">
                      <p style="margin:0; font-size:11px; color:#64748b; font-weight:700; letter-spacing:.08em; text-transform:uppercase;">
                        Tenant
                      </p>
                      <p style="margin:6px 0 0 0; font-size:15px; font-weight:700; color:#0f172a;">
                        ${tenantName || "Unknown Tenant"}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- COMPLAINT CARD -->
          <tr>
            <td style="padding:0 36px 32px 36px;">
              <div style="
                border-radius:18px;
                border:1px solid #e2e8f0;
                padding:28px;
                background:linear-gradient(180deg,#ffffff,#f8fafc);
              ">

                <p style="margin:0; font-size:13px; color:#64748b;">Issue Title</p>
                <p style="margin:4px 0 18px 0; font-size:18px; font-weight:800; color:#020617;">
                  ${complaint.title}
                </p>

                <table width="100%">
                  <tr>
                    <td>
                      <p style="margin:0; font-size:12px; color:#64748b;">Category</p>
                      <p style="margin:4px 0 0 0; font-size:14px; font-weight:600; color:#334155;">
                        ${complaint.category}
                      </p>
                    </td>
                    <td align="right">
                      <p style="margin:0; font-size:12px; color:#64748b;">Priority</p>
                      <span style="
                        display:inline-block;
                        margin-top:6px;
                        padding:6px 14px;
                        border-radius:999px;
                        font-size:12px;
                        font-weight:800;
                        background:${complaint.priority_level === 'High'
        ? '#fee2e2'
        : complaint.priority_level === 'Medium'
          ? '#fef3c7'
          : '#dcfce7'
      };
                        color:${complaint.priority_level === 'High'
        ? '#991b1b'
        : complaint.priority_level === 'Medium'
          ? '#92400e'
          : '#166534'
      };
                      ">
                        ${complaint.priority_level || 'Low'}
                      </span>
                    </td>
                  </tr>
                </table>

                <hr style="border:none; border-top:1px dashed #cbd5e1; margin:20px 0;"/>

                <p style="margin:0; font-size:12px; color:#64748b;">Description</p>
                <p style="margin-top:6px; font-size:15px; line-height:1.7; color:#334155;">
                  ${complaint.description}
                </p>

              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom:44px;">
              <a href="http://localhost:5173/landlord/dashboard"
                style="
                  background:linear-gradient(135deg,#7c3aed,#4f46e5);
                  color:#ffffff;
                  padding:16px 40px;
                  border-radius:12px;
                  text-decoration:none;
                  font-size:16px;
                  font-weight:800;
                  box-shadow:0 20px 40px rgba(79,70,229,0.4);
                ">
                Open Dashboard →
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc; padding:28px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                © 2026 RentEase • Smart Property Management
              </p>
              <p style="margin-top:6px; font-size:12px; color:#94a3b8;">
                This is an automated notification. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

  try {
    console.log(`📧 Attempting to send complaint email to: ${landlordEmail}`);
    await sendMail(landlordEmail, subject, html);
    console.log("✅ Complaint Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending complaint email:", error);
    throw error;
  }
};

module.exports = sendComplaintMail;
