const pool = require('../config/db');
const { geocodeAddress } = require('../utils/geocoder');

async function geocodeExisting() {
    try {
        console.log("Starting geocoding for existing properties...");

        // Fetch properties without coordinates
        const { rows: properties } = await pool.query(`
            SELECT id, address, locality, city 
            FROM properties 
            WHERE latitude IS NULL OR longitude IS NULL;
        `);

        console.log(`Found ${properties.length} properties to geocode.`);

        for (const prop of properties) {
            const fullAddress = `${prop.address}, ${prop.locality}, ${prop.city}`;
            console.log(`Geocoding property #${prop.id}: ${fullAddress}`);

            const coords = await geocodeAddress(fullAddress);

            if (coords) {
                await pool.query(
                    'UPDATE properties SET latitude = $1, longitude = $2 WHERE id = $3',
                    [coords.lat, coords.lng, prop.id]
                );
                console.log(`Updated property #${prop.id} with coords: ${coords.lat}, ${coords.lng}`);
            } else {
                console.log(`Skipped property #${prop.id}: Could not geocode.`);
            }

            // Avoid rate limiting (though Google is generous, safety first)
            await new Promise(r => setTimeout(r, 100));
        }

        console.log("Geocoding script finished.");
        process.exit(0);
    } catch (err) {
        console.error("Geocoding script failed:", err);
        process.exit(1);
    }
}

geocodeExisting();
