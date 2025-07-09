export const PRICES_BIKE_SIZE = {
    'Pit Bike 50cc': 149.00,
    'Mini Bike 65-85cc': 199.00,
    'Big Bikes 125-400cc': 249.00
};

export const PRICES_COLORS = {
     'Standard': 0,
     'Holographic': 50,
} ;

const HOLOGRAPHIC_PRICES = {
    'Pit Bike 50cc': 30,
     'Mini Bike 65-85cc': 45,
     'Big Bikes 125-400cc': 60
}

function getPriceByColorAndSize(color, bikeSize) {
    if (color != 'Holographic') return PRICES_COLORS[color];
    return HOLOGRAPHIC_PRICES[bikeSize];
}

export const PRICES_FINISHES = {
    'GLOSSY': 0,
    'MATTE': 0,
};

export { getPriceByColorAndSize };
