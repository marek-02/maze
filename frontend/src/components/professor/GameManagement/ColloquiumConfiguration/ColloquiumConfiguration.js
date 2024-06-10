import React, { useState } from 'react';
import { FIRST_COLLOQUIUM, HANDS_ON_COLLOQUIUM, ORAL_COLLOQUIUM, SECOND_COLLOQUIUM } from '../../../../utils/constants'

function ColloquiumConfiguration() {
  const tests = [
    { name: FIRST_COLLOQUIUM },
    { name: SECOND_COLLOQUIUM },
    { name: HANDS_ON_COLLOQUIUM },
    { name: ORAL_COLLOQUIUM },
  ];

  const [selectedTest, setSelectedTest] = useState(tests[0]);

  const handleConfigure = () => {
    // Handle configuration logic here
    console.log(`Configuring ${selectedTest.name}`);
  };

  return (
    <div className="d-flex flex-column align-items-center h-100 mt-5">
      <h2>Skonfiguruj Kolokowium</h2>
      <select onChange={(e) => setSelectedTest(tests[e.target.value])}>
        {tests.map((test, index) => (
          <option key={test.name} value={index}>
            {test.name}
          </option>
        ))}
      </select>
      <button onClick={handleConfigure}>Configure</button>
    </div>
  );
}

export default ColloquiumConfiguration;