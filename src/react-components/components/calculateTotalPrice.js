import { PRICES_BIKE_SIZE, PRICES_FINISHES, PRICES_COLORS, getPriceByColorAndSize } from './priceConstants';

export const calculateTotalPrice = (formData) => {
    let total = 0;

    // Price from Step 1 (Bike Size)
    if (formData.bikeSize && PRICES_BIKE_SIZE[formData.bikeSize]) {
        total += PRICES_BIKE_SIZE[formData.bikeSize];
    }

    // Price from Step 7 (Colors)
    for (let color in formData.colors) {
        if (formData.colors[color].selected) {
            total += getPriceByColorAndSize(color, formData.bikeSize);  // no need to call .replace since it's already a number
        }
    }

    // Price from Step 8 (Finishes)
    if (formData.finishes && PRICES_FINISHES[formData.finishes]) {
        total += PRICES_FINISHES[formData.finishes];
    }

    // Add logic for other steps...

    return total;
};
