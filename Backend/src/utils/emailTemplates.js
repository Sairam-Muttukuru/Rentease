const rentReminderTemplate = (tenantName, rentAmount, dueDate, landlordName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Rent Reminder</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 15px;">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          
          <!-- HEADER -->
          <tr>
            <td style="background:#4f46e5; padding:24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; letter-spacing:1px;">RentEase</h1>
              <p style="margin:8px 0 0; color:#c7d2fe;">Smart Rent Management</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#111827; margin-bottom:12px;">Hi ${tenantName}, 👋</h2>

              <p style="color:#374151; font-size:16px; line-height:1.6;">
                This is a friendly reminder that your <strong>monthly rent payment</strong> is due.
              </p>

              <table width="100%" style="margin:24px 0; background:#f9fafb; border-radius:10px; padding:20px;">
                <tr>
                  <td style="font-size:15px; color:#374151;">
                    <strong>Rent Amount:</strong>
                  </td>
                  <td style="font-size:15px; color:#111827; text-align:right;">
                    ₹${rentAmount}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:15px; color:#374151; padding-top:8px;">
                    <strong>Due Date:</strong>
                  </td>
                  <td style="font-size:15px; color:#111827; text-align:right; padding-top:8px;">
                    ${dueDate}
                  </td>
                </tr>
              </table>

              <p style="color:#374151; font-size:15px;">
                Please make the payment at the earliest to avoid any late fees.
              </p>

              <div style="text-align:center; margin-top:30px;">
                <a href="#" style="
                  background:#4f46e5;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  font-weight:bold;
                  display:inline-block;
                ">
                  Pay Rent Now
                </a>
              </div>

               <p style="color:#374151; font-size:15px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                 Regards,<br>
                 <strong>${landlordName}</strong>
               </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f3f4f6; padding:20px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#6b7280;">
                © 2026 RentEase. All rights reserved.
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
module.exports = { rentReminderTemplate };

// const rentReminderTemplate = (tenantName, rentAmount, dueDate) => `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <title>Rent Reminder</title>
// </head>
// <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
//   <table width="100%">
//     <tr>
//       <td align="center" style="padding:30px">
//         <table width="600" style="background:#fff;border-radius:12px;">
//           <tr>
//             <td style="background:#4f46e5;padding:20px;text-align:center;color:white;">
//               <h1>RentEase</h1>
//               <p>Smart Rent Management</p>
//             </td>
//           </tr>

//           <tr>
//             <td style="padding:30px">
//               <h2>Hi ${tenantName}, 👋</h2>
//               <p>Your rent payment is pending.</p>

//               <p><strong>Rent Amount:</strong> ₹${rentAmount}</p>
//               <p><strong>Due Date:</strong> ${dueDate}</p>

//               <a href="#"
//                 style="display:inline-block;margin-top:20px;
//                 background:#4f46e5;color:#fff;
//                 padding:12px 24px;border-radius:6px;
//                 text-decoration:none;">
//                 Pay Rent Now
//               </a>
//             </td>
//           </tr>

//           <tr>
//             <td style="background:#f3f4f6;padding:15px;text-align:center;">
//               © 2026 RentEase
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// `;

// module.exports = { rentReminderTemplate };
