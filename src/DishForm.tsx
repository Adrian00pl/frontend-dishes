import React, { FormEvent, useState } from 'react'

type DishFormType = {
    name: string;
    preparation_time: string;
    type: string;
    no_of_slices: string;
    diameter: string;
    spiciness_scale: string;
    slices_of_bread: string;
}

function DishForm() {
    const [data, setData] = useState<DishFormType>({
        name: '',
        preparation_time: '',
        type: '',
        no_of_slices: '',
        diameter: '',
        spiciness_scale: '',
        slices_of_bread: '',
    });
    const { name, preparation_time, type, no_of_slices, diameter, spiciness_scale, slices_of_bread } = data;
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const reducedData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            const response = await fetch('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reducedData),
            });
            if (response.ok) {
                setData({
                    name: '',
                    preparation_time: '',
                    type: '',
                    no_of_slices: '',
                    diameter: '',
                    spiciness_scale: '',
                    slices_of_bread: '',
                });
                setSuccess(true);
                setErrors([]);
                console.log(response.json())
            } else {
                setSuccess(false);
                const responseData = await response.json();
                if (responseData.errors) {
                    setErrors(responseData.errors);
                } else {
                    setErrors(['An error occurred.']);
                }
            }
        } catch (error) {
            setSuccess(false);
            setErrors(['An error occurred during submitting the form.']);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'type') {
            setData(prevData => ({
                ...prevData,
                no_of_slices: '',
                diameter: '',
                spiciness_scale: '',
                slices_of_bread: '',
            }));
        }
    };
    return (
        <form className="form-container" onSubmit={handleFormSubmit}>
            <p className='subtitle'>Dish</p>
            <div>
                <label htmlFor="name">Dish Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
            </div>
            <div>
                <label htmlFor="preparation_time">Preparation Time:</label>
                <input
                    type="text"
                    id="preparation_time"
                    name="preparation_time"
                    value={preparation_time}
                    onChange={handleInputChange}
                    pattern="(?:[0-9]|[1-9][0-9]):(?:[0-5][0-9]):(?:[0-5][0-9])"
                    placeholder="HH:MM:SS"
                    required
                />
            </div>
            <div>
                <label htmlFor="type">Dish Type:</label>
                <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="pizza">Pizza</option>
                    <option value="soup">Soup</option>
                    <option value="sandwich">Sandwich</option>
                </select>
            </div>

            {type === 'pizza' && (
                <div className='slide-out'>
                    <div>
                        <label htmlFor="no_of_slices">Number of Slices:</label>
                        <input
                            type="number"
                            min="1"
                            id="no_of_slices"
                            name="no_of_slices"
                            value={no_of_slices}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="diameter">Diameter:</label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            id="diameter"
                            name="diameter"
                            value={diameter}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            )}

            {type === 'soup' && (
                <div className='slide-out'>
                    <label htmlFor="spiciness_scale">Spiciness Scale:</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        id="spiciness_scale"
                        name="spiciness_scale"
                        value={spiciness_scale}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            )}
            {type === 'sandwich' && (
                <div className='slide-out'>
                    <label htmlFor="slices_of_bread">Slices Of Bread:</label>
                    <input
                        type="number"
                        min="0"
                        id="slices_of_bread"
                        name="slices_of_bread"
                        value={slices_of_bread}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            )}


            <div className="button-container">
                <button type="submit">Submit</button>
            </div>
            {success && (
                <div className='slide-out'>
                    <div className="success-message">
                        Form submitted successfully!
                    </div>
                </div>
            )}
            {errors.length > 0 && (
                <div className='slide-out'>
                    <div className="error-message">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </form>

    )
}

export default DishForm;