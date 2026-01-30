const db = require('./src/config/db');
const PropertyModel = require('./src/models/PropertyModel');

async function testCreateProperty() {
    try {
        console.log("Connecting to DB...");
        // First create a landlord user for testing
        const email = `testlandlord_${Date.now()}@example.com`;
        const userRes = await db.query(
            `INSERT INTO users (first_name, last_name, email, password, role) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id`,
            ['Test', 'Landlord', email, 'password123', 'LANDLORD']
        );

        const landlordId = userRes.rows[0].id;
        console.log("Created test landlord ID:", landlordId);

        const dummyData = {
            landlord_id: landlordId,
            title: "Test Property",
            description: "Test Description",
            property_type: "Apartment",
            price: 10000,
            orientation: "North",
            bedrooms: 2,
            bathrooms: 2,
            area_sqft: 1200,
            city: "Test City",
            locality: "Test Locality",
            address: "Test Address",
            is_featured: false,
            building_name: "Test Building",
            flat_number: "101",
            floor_number: 1,
            bhk: 2,
            is_gated: true,
            total_floors: 5,
            has_lift: true,
            parking_type: "Covered",
            house_floor_type: "Marble",
            duplex_type: false,
            private_parking_slots: 1,
            private_garden: false,
            room_type: null,
            food_included: false,
            electricity_included: false,
            gender_allowed: null,
            shop_use_type: null,
            water_available: false,
            office_type: null,
            seating_capacity: null,
            cabins_available: false,
            conference_room: false
        };

        console.log("Attempting to create property...");
        const property = await PropertyModel.createProperty(dummyData);
        console.log("Property created successfully:", property);
    } catch (err) {
        console.error("Error creating property:", err);
    } finally {
        process.exit();
    }
}

testCreateProperty();
