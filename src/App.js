import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [newSchema, setNewSchema] = useState('');

  const handleSaveSegmentClick = () => {
    setShowPopup(true);
  };

  const handleSchemaSelect = (e) => {
    setNewSchema(e.target.value);
  };

  const handleAddSchema = () => {
    if (newSchema && availableSchemas.length > 0) {
      const selectedOption = availableSchemas.find(option => option.value === newSchema);
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      const newAvailableSchemas = availableSchemas.filter(option => option.value !== newSchema);
      setAvailableSchemas(newAvailableSchemas);
      setNewSchema(''); // Reset dropdown
    }
  };

  const handleSegmentNameChange = (e) => {
    setSegmentName(e.target.value);
  };

  const handleSubmit = () => {
    const dataToSend = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };

    // Sending data to the provided Webhook URL
    axios.post('https://webhook.site/ac2c89a4-2acf-49de-a252-fb134fd8355b', dataToSend)
    .then(response => {
      alert('Segment saved successfully!');
    })
    .catch(error => {
      console.error('There was an error saving the segment!', error);
    });
  
  
  };

  return (
    <div className="App">
      <button onClick={handleSaveSegmentClick}>Save segment</button>
      
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Save Segment</h2>
            <div>
              <label>Segment Name: </label>
              <input
                type="text"
                value={segmentName}
                onChange={handleSegmentNameChange}
                placeholder="Enter segment name"
              />
            </div>

            <div className="blue-box">
              {selectedSchemas.map((schema, index) => (
                <div key={index}>
                  <select
                    value={schema.value}
                    onChange={(e) => {
                      const updatedSchemas = [...selectedSchemas];
                      const updatedOption = availableSchemas.find(option => option.value === e.target.value);
                      updatedSchemas[index] = updatedOption;
                      setSelectedSchemas(updatedSchemas);
                      setAvailableSchemas(schemaOptions.filter(opt => !updatedSchemas.includes(opt)));
                    }}
                  >
                    {[schema, ...availableSchemas].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label>Add schema to segment: </label>
              <select value={newSchema} onChange={handleSchemaSelect}>
                <option value="">Select a schema</option>
                {availableSchemas.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button onClick={handleAddSchema}>+Add new schema</button>
            </div>

            <button onClick={handleSubmit}>Save the segment</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;