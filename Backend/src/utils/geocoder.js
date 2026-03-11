const axios = require('axios');

/**
 * Converts an address string to latitude and longitude using Nominatim (OpenStreetMap).
 * @param {string} address - The address to geocode (address, locality, city).
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
exports.geocodeAddress = async (address) => {
    try {
        console.log(`Nominatim Geocoding: ${address}`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'RentEase-App (bhavanimuttukuru@gmail.com)'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat: parseFloat(lat), lng: parseFloat(lon) };
        } else {
            console.warn("Nominatim found no results for:", address);
            // Try a broader search if specific address fails
            const parts = address.split(',');
            if (parts.length > 2) {
                const broaderAddress = parts.slice(-2).join(',');
                console.log(`Retrying broader search: ${broaderAddress}`);
                return exports.geocodeAddress(broaderAddress);
            }
            return null;
        }
    } catch (err) {
        console.error("Nominatim API error:", err.message);
        return null;
    }
};
