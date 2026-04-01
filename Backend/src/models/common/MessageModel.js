const db = require("../../config/db");

/**
 * Get all messages between two users
 */
exports.getChatMessages = async (user1Id, user2Id) => {
    const query = `
        SELECT m.id, m.sender_id, m.receiver_id, m.content as message_text, m.is_read, m.created_at, 
               u1.avatar_url as sender_avatar, 
               u2.avatar_url as receiver_avatar,
               CONCAT(u1.first_name, ' ', u1.last_name) as sender_name,
               CONCAT(u2.first_name, ' ', u2.last_name) as receiver_name
        FROM messages m
        JOIN users u1 ON u1.id = m.sender_id
        JOIN users u2 ON u2.id = m.receiver_id
        WHERE (m.sender_id = $1 AND m.receiver_id = $2)
           OR (m.sender_id = $2 AND m.receiver_id = $1)
        ORDER BY m.created_at ASC;
    `;
    return (await db.query(query, [user1Id, user2Id])).rows;
};

/**
 * Send a new message
 */
exports.sendMessage = async (senderId, receiverId, text, propertyId = null) => {
    const query = `
        INSERT INTO messages (sender_id, receiver_id, content, property_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, sender_id, receiver_id, content as message_text, is_read, created_at, property_id;
    `;
    return (await db.query(query, [senderId, receiverId, text, propertyId])).rows[0];
};

/**
 * Mark messages as read
 */
exports.markAsRead = async (senderId, receiverId) => {
    const query = `
        UPDATE messages
        SET is_read = TRUE
        WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE;
    `;
    return await db.query(query, [senderId, receiverId]);
};

/**
 * Get all conversations for a user (recent message for each contact)
 */
exports.getConversations = async (userId) => {
    const query = `
        WITH LastMessages AS (
            SELECT 
                CASE 
                    WHEN sender_id = $1 THEN receiver_id 
                    ELSE sender_id 
                END as contact_id,
                MAX(created_at) as last_chat_time
            FROM messages
            WHERE sender_id = $1 OR receiver_id = $1
            GROUP BY contact_id
        )
        SELECT 
            lm.contact_id,
            lm.last_chat_time,
            m.content as last_message,
            m.sender_id as last_sender_id,
            u.first_name,
            u.last_name,
            u.avatar_url,
            (SELECT COUNT(*) FROM messages WHERE sender_id = lm.contact_id AND receiver_id = $1 AND is_read = FALSE) as unread_count
        FROM LastMessages lm
        JOIN messages m ON (
            (m.sender_id = $1 AND m.receiver_id = lm.contact_id AND m.created_at = lm.last_chat_time) OR
            (m.sender_id = lm.contact_id AND m.receiver_id = $1 AND m.created_at = lm.last_chat_time)
        )
        JOIN users u ON u.id = lm.contact_id
        ORDER BY lm.last_chat_time DESC;
    `;
    return (await db.query(query, [userId])).rows;
};
/**
 * Get unread message counts for all contacts of a user
 */
exports.getUnreadCounts = async (userId) => {
    const query = `
        SELECT sender_id as contact_id, COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = $1 AND is_read = FALSE
        GROUP BY sender_id;
    `;
    return (await db.query(query, [userId])).rows;
};
