import React, { useState } from 'react';

function BikeSizeComponent({ onNext }) {
    const [selectedBikeSize, setSelectedBikeSize] = useState('Pit Bike 50cc'); // Default value

    return (
        <div>
            {/* Label */}
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>
                Bike Size
            </h2>
            
            {/* Dropdown */}
            <select
                value={selectedBikeSize}
                onChange={(e) => setSelectedBikeSize(e.target.value)}
            >
                <option value="Pit Bike 50cc">Pit Bike 50cc</option>
                <option value="Mini Bike 65-85cc">Mini Bike 65-85cc</option>
                <option value="Big Bikes 125-400cc">Big Bikes 125-400cc</option>
            </select>
            
            {/* Next Step Button */}
            <button
                style={{
                    marginTop: '20px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer'
                }}
                onClick={() => onNext(selectedBikeSize)} // Pass the selected value to the parent component
            >
                Next Step
            </button>
        </div>
    );
}

export default BikeSizeComponent;
