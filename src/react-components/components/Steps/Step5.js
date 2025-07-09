import React, { useState, useRef, useEffect } from 'react';
import './Step5.css';

const MAX_SIZE_MB = 0.5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const Step5 = ({ formData, setFormData }) => {
    const [uploadingFile, setUploadingFile] = useState(formData.logo);
    const [logoText, setLogoText] = useState(formData.logos || "");
    const fileInputRef = useRef();
    Step5.questions = [
        { id: 'logo', label: 'Logo', type: 'singleImage', required: true }
    ];

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            logo: prevData.logo || null,
            logos: prevData.logos || ""
        }));
    }, [setFormData]);

    const handleLogoChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (file.size > MAX_SIZE_BYTES) {
            alert(`The logo file size should not exceed ${MAX_SIZE_MB} MB.`);
            return;
        }

        const dataURL = await readFile(file);
        
        setUploadingFile({
            name: file.name,
            dataURL: dataURL
        });

        setFormData(prevData => ({
            ...prevData,
            logo: {
                name: file.name,
                dataURL: dataURL
            }
        }));
    };

    const handleLogoTextChange = (event) => {
        const text = event.target.value;
        setLogoText(text);

        setFormData(prevData => ({
            ...prevData,
            logos: text
        }));
    };

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const deleteFile = () => {
        setUploadingFile(null);
        
        setFormData(prevData => ({
            ...prevData,
            logo: null
        }));
    };

    return (
        <>
            <h1 className="step-title">LOGO</h1>
            <div className="step5-container">
                <label className="step5-label">UPLOAD YOUR LOGO</label>
                <button className="step5-upload-btn" type="button" onClick={() => fileInputRef.current.click()}>
                    Choose Logo
                </button>
                <input
                    className='image-upload'
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept=".ai, .pdf, .eps"
                />
        
                <div className="step5-file-display">
                    {uploadingFile && <span>{uploadingFile.name}</span>}
                    {uploadingFile && <button className="step5-file-delete" onClick={deleteFile}>X</button>}
                </div>
                
                <p className="step5-hint">Upload your personal logo or company logo (Only format .ai .pdf. or .eps)</p>

                <label className="step5-logo-text-label">LOGOS</label>
                <textarea
                    className="step5-logo-textbox"
                    value={logoText}
                    onChange={handleLogoTextChange}
                    placeholder="e.g. FMF, FOX, DUNLOP..."
                    rows="3"
                />
                <p className="step5-hint">Tell us what logos you want (e.g. FMF, FOX, DUNLOP...)</p>
            </div>
        </>
    );
};

export default Step5;
