const React = require('react')

const PRICES_BIKE_SIZE = {
    'Pit Bike 50cc': 149.00,
    'Mini Bike 65-85cc': 199.00,
    'Big Bikes 125-400cc': 249.00
};

const PRICES_COLORS = {
     'Standard': 0,
     'Holographic': 50,
} ;

const PRICES_FINISHES = {
    'GLOSSY': 0,
    'MATTE': 0,
};

const HOLOGRAPHIC_PRICES = {
    'Pit Bike 50cc': 30,
     'Mini Bike 65-85cc': 45,
     'Big Bikes 125-400cc': 60
}

function getPriceByColorAndSize(color, bikeSize) {
    if (color != 'Holographic') return PRICES_COLORS[color];
    return HOLOGRAPHIC_PRICES[bikeSize];
}


const camelCaseToSpaceSeparated = (text) => {
    return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const FormSummary = ({ data, price}) => {
    const steps = [
        {
            title: "BIKE SIZE",
            keys: ["bikeSize"]
        },
        {
            title: "BIKE DETAILS",
            keys: ["make", "model", "year", "stroke"]
        },
        {
            title: "RIDER DETAILS",
            keys: ["riderName", "raceNumber", "raceNumberColor", "backgroundColor", "numberFontSelection"]
        },
        {
            title: "UPLOAD IMAGES",
            keys: ["referenceImages", "designDescription"]
        },
        {
            title: "UPLOAD LOGO",
            keys: ["logo", "logos"]
        },
        {
            title: "AFTER MARKET PARTS",
            keys: ["afterMarketPlastics"]
        },
        {
            title: "COLOR DETAILS",
            keys: ["colors"]
        },
        {
            title: "FINISHES",
            keys: ["finishes"]
        },
        {
            title: "CUSTOMER INFORMATION",
            keys: ["name", "email", "address", "city", "state", "country", "zipCode", "phoneNumber"]
        }
    ];

    return (
        <div className="form-summary">
            <h1 className='step-title'>Review Your Customizations</h1>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Information</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {steps.map(step => (
                        <React.Fragment key={step.title}>
                            <tr>
                                <td colSpan="3" className="step-divider">{step.title}</td>
                            </tr>
                            {step.keys.map(key => {
                                const value = data[key];
                                let price = "";
                                if (key === 'bikeSize') {
                                    price = "$" + PRICES_BIKE_SIZE[value] || "";
                                } else if (key === 'finishes') {
                                    price = "$" + PRICES_FINISHES[value] || "";
                                }

                                const formattedKey = camelCaseToSpaceSeparated(key);
                                if (typeof value === 'string' || typeof value === 'number') {
                                    return (
                                        <tr key={key}>
                                            <td>{formattedKey}</td>
                                            <td>{value}</td>
                                            <td>{price}</td>
                                        </tr>
                                    );
                                } else if (key === 'colors') {
                                    return (
                                        <tr key={key}>
                                            <td>{formattedKey}</td>
                                            <td>
                                                {Object.entries(value).map(([colorKey, colorValue], index) =>
                                                    colorValue.selected ? <div key={index} className="dashed-list">{camelCaseToSpaceSeparated(colorKey)}</div> : null
                                                )}
                                            </td>
                                            <td>
                                                {Object.entries(value).map(([colorKey, colorValue], index) =>
                                                    colorValue.selected ? <div key={index} className="dashed-list">${getPriceByColorAndSize(colorKey, data.bikeSize)}</div> : null
                                                )}
                                            </td>
                                        </tr>
                                    );
                                } else if (Array.isArray(value)) {
                                    return (
                                        <tr key={key}>
                                            <td>{formattedKey}</td>
                                            <td>
                                                <div className="image-gallery">
                                                    {value.map((img, index) => (
                                                        <div key={index} className="image-item">
                                                            <div className="image-name">{img.name}</div>
                                                            {img.s3Url && (
                                                                <div className="image-container">
                                                                    <img src={img.s3Url} alt={img.name} className="uploaded-image" />
                                                                    <a href={img.s3Url} target="_blank" rel="noopener noreferrer" className="image-link">
                                                                        View Full Size
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td></td>
                                        </tr>
                                    );
                                } else if (!value) {
                                    return (
                                        <tr key={key}>
                                            <td>{"ERROR"}</td>
                                            <td>{"ERROR"}</td>
                                            <td></td>
                                        </tr>
                                    );
                                } else if (value.dataURL || value.s3Url) {
                                    return (
                                        <tr key={key}>
                                            <td>{formattedKey}</td>
                                            <td>
                                                <div className="image-item">
                                                    <div className="image-name">{value.name}</div>
                                                    {value.s3Url && (
                                                        <div className="image-container">
                                                            <img src={value.s3Url} alt={value.name} className="uploaded-image" />
                                                            <a href={value.s3Url} target="_blank" rel="noopener noreferrer" className="image-link">
                                                                View Full Size
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td></td>
                                        </tr>
                                    );
                                }
                                return null; 
                            })}
                        </React.Fragment>
                    ))}
                    <tr>
                        <td colSpan="3" className="step-divider">Shipping</td>
                    </tr>
                    <tr>
                        <td>Shipping Cost</td>
                        <td></td>
                        <td>${price >= 100 ? 0 : 20}</td>
                    </tr>
                    <tr>
                        <th>Estimated Total Price</th>
                        <th></th>
                        <th>${price >= 100 ? price : price + 20}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

module.exports = FormSummary;
