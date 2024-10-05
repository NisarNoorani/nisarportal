import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure your CSS file is linked here

function App() {
  const [className, setClassName] = useState('');
  const [assignmentLink, setAssignmentLink] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [classes, setClasses] = useState({});
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchClassAssignments();
  }, []);

  const fetchClassAssignments = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbz6vkgVraXsAPBYvOYz-JvuHKSPeoeUlM5I4G3fX-hHPRz8tbesJtfsnrTEoSH5x_8C3Q/exec');
      const data = await response.json();
      console.log("Fetched data:", data);
      setClasses(data);
    } catch (error) {
      console.error("Error fetching class assignments:", error);
      setClasses({});
    }
  };

  const addAssignment = (link) => {
    setAssignments((prevAssignments) => [link, ...prevAssignments]);
    setAssignmentLink('');
  };

  const handleAssignmentSubmit = async () => {
    if (!assignmentLink) {
      alert("Please enter a valid assignment link.");
      return;
    }

    addAssignment(assignmentLink);

    const data = {
      className: currentClass,
      assignmentLink: assignmentLink,
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwu_8LhqGJwCWelQbcMR1qkSTXMz95-iS4bwGVro9tendRlbWbJYpWLeEHrTWGbv0N5ag/exec';

    try {
      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Data sent.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClassSubmit = () => {
    if (classes.hasOwnProperty(className)) {
      setCurrentClass(className);
      setAssignments(classes[className]);
    } else {
      alert("Class not found! Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>Class Assignment Tracker</h1>

      {/* Class Input */}
      <div className="class-selection">
        <label htmlFor="class-name">Enter your Class Name</label>
        <input
          type="text"
          id="class-name"
          placeholder="e.g., Class 12A"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button onClick={handleClassSubmit}>Check Class</button>
      </div>

      {/* Assignment Submission */}
      {currentClass && (
        <div className="assignment-submit">
          <input
            type="text"
            id="assignment-link"
            placeholder="Enter assignment link"
            value={assignmentLink}
            onChange={(e) => setAssignmentLink(e.target.value)}
          />
          <button onClick={handleAssignmentSubmit}>Submit Assignment</button>
        </div>
      )}

      {/* Display Class Assignments if the class exists */}
      {currentClass && (
        <div className="assignments-section">
          <h3 id="class-title">Assignments for {currentClass}</h3>
          <div id="assignments-list">
            <h3>Submitted Assignments:</h3>
            <ul id="assignment-items">
              {assignments.map((assignment, index) => (
                <li key={index}>
                  <a href={assignment} target="_blank" rel="noopener noreferrer">{assignment}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
