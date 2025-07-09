import React, { useState, useRef, useEffect } from 'react';
import './Step4.css';

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const Step4 = ({ formData, setFormData }) => {
    const fileInputRef = useRef();

    // Initialize state only if formData.referenceImages is an array
    const [uploadingFiles, setUploadingFiles] = useState(Array.isArray(formData.referenceImages) ? formData.referenceImages : []);
    const [designDescription, setDesignDescription] = useState(formData.designDescription || "");

    useEffect(() => {
        // This will ensure formData is initialized only if not already set
        if (!Array.isArray(formData.referenceImages)) {
            setFormData(prevData => ({
                ...prevData,
                referenceImages: [],
                designDescription: prevData.designDescription || ""
            }));
        }
    }, [setFormData, formData.referenceImages, formData.designDescription]);

    Step4.questions = [
        { id: 'referenceImages', label: 'Reference Images', type: 'image', required: true }
    ];
    
    const handleDesignDescriptionChange = (event) => {
        const text = event.target.value;
        setDesignDescription(text);
        setFormData(prevData => ({
            ...prevData,
            designDescription: text
        }));
    };

    const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    let totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_SIZE_BYTES) {
        alert(`Total size of all files should not exceed ${MAX_SIZE_MB} MB.`);
        return;
    }

    // Check the total number of files (existing + new ones)
    if (files.length + formData.referenceImages.length > MAX_IMAGES) {
        alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
    }

    const newUploadingFiles = files.map(file => ({
        name: file.name,
        status: 'uploading',
        progress: 0,
        dataURL: ''
    }));

    // Append the new files to the existing ones
    setUploadingFiles(prevFiles => [...(prevFiles || []), ...newUploadingFiles]);

    let combinedFiles = [...uploadingFiles, ...newUploadingFiles];

    for (let file of files) {
        const dataURL = await readFileWithProgress(file, progress => {
            const index = combinedFiles.findIndex(f => f.name === file.name);
            combinedFiles[index].progress = progress;
            setUploadingFiles([...combinedFiles]);
        });

        const index = combinedFiles.findIndex(f => f.name === file.name);
        combinedFiles[index].dataURL = dataURL;
        combinedFiles[index].status = 'done';
    }

    // Update formData to match the combinedFiles state
    setFormData(prevData => ({
        ...prevData,
        referenceImages: combinedFiles
    }));
};

    const readFileWithProgress = (file, progressCallback) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onprogress = event => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    progressCallback(progress);
                }
            };

            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const deleteFile = (index, fromFormData = false) => {
        if (fromFormData) {
            const newFiles = [...formData.referenceImages];
            newFiles.splice(index, 1);
            setFormData(prevData => ({ ...prevData, referenceImages: newFiles }));
        } else {
            const newFiles = [...uploadingFiles];
            newFiles.splice(index, 1);
            setUploadingFiles(newFiles);
    
            // Update formData to match the current uploadingFiles state
            setFormData(prevData => ({
                ...prevData,
                referenceImages: newFiles
            }));
        }
    };
    
    const referenceImageList = Array.isArray(formData.referenceImages) ? (
        formData.referenceImages.map((file, index) => (
            <li key={index} className="step4-file-item">
                {file.name}
                <button className="step4-file-delete" onClick={() => deleteFile(index, true)}>X</button>
            </li>
        ))
    ) : []; 


    return (
        <>
            <h1 className="step-title">REFERENCE IMAGES AND DETAILS</h1>
            <div className="step4-container">
                <label className="step4-label">UPLOAD REFERENCE IMAGES (up to {MAX_IMAGES} images, {MAX_SIZE_MB} MB max)</label>
                <button className="step4-upload-btn" type="button" onClick={() => fileInputRef.current.click()}>
                    Add Image(s)
                </button>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                <ul className="step4-file-list">
                    {referenceImageList} {/* Use the new variable here */}
                </ul>
                <label className="step4-logo-text-label">DESIGN</label>
                <textarea
                    className="step5-logo-textbox" // Reusing the style from Step5
                    value={designDescription}
                    onChange={handleDesignDescriptionChange}
                    placeholder="Provide any additional design details here..."
                    rows="3"
                />
                <p className="step5-hint">Let us know about additional info of the design you want.</p>
            </div>
        </>
    );
};


export default Step4;
