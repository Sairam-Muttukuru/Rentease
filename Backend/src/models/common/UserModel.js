const db = require("../../config/db");

const createUser = async (user) => {
    const query = `
    INSERT INTO users (first_name, last_name, email, password, role)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, email, role;
  `;
    const values = [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.role
    ];
    console.log("Creating user with values:", values);
    return (await db.query(query, values)).rows[0];
};

const findUserByEmail = async (email) => {
    const res = await db.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
    console.log("Finding user by email:", email, "Result:", res.rows[0]);
    return res.rows[0];
};
const updatePasswordByEmail = async (email, hashedPassword) => {
    const query = `
        UPDATE users
        SET password = $1
        WHERE email = $2
        RETURNING id, email, role;
    `;
    const values = [hashedPassword, email];
    const res = await db.query(query, values);
    return res.rows[0];
};
const findUserById = async (id) => {
    return (
        await db.query(
            "SELECT id, first_name, last_name, email, phone, avatar_url FROM users WHERE id = $1",
            [id]
        )
    ).rows[0];
};
const getUserById = async (id) => {
    return (
        await db.query(
            "SELECT email, first_name FROM users WHERE id = $1",
            [id]
        )
    ).rows[0];
};


const updateUser = async (id, data) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.first_name) { fields.push(`first_name=$${idx++}`); values.push(data.first_name); }
    if (data.last_name) { fields.push(`last_name=$${idx++}`); values.push(data.last_name); }
    if (data.email) { fields.push(`email=$${idx++}`); values.push(data.email); }
    if (data.phone) { fields.push(`phone=$${idx++}`); values.push(data.phone); }
    if (data.avatar_url) { fields.push(`avatar_url=$${idx++}`); values.push(data.avatar_url); }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id=$${idx} RETURNING id, first_name, last_name, email, phone, avatar_url`;

    return (await db.query(query, values)).rows[0];
};

const findUserBySlug = async (slug) => {
    // Slug is expected to be "first-last" lowercase
    const res = await db.query(
        "SELECT * FROM users WHERE LOWER(CONCAT(first_name, '-', last_name)) = $1",
        [slug.toLowerCase()]
    );
    return res.rows[0];
};

module.exports = { createUser, findUserByEmail, updatePasswordByEmail, findUserById, getUserById, updateUser, findUserBySlug };


