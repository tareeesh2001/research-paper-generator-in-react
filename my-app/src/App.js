// import React from 'react';
// import './App.css'

// function App() {
//     const [topic, setTopic] = React.useState('');
//     const [outline, setOutline] = React.useState('');
//     const [selectedHeadings, setSelectedHeadings] = React.useState([]);
//     const [content, setContent] = React.useState({});

//     const generateOutline = () => {
//         // Create overlay div
//         const overlay = document.createElement("div");
//         overlay.className = "overlay";
//         overlay.innerHTML = '<div class="loader"></div>';

//         // Append overlay to the body
//         document.body.appendChild(overlay);

//         fetch('http://localhost:5000/generate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ prompt: topic })
//         })
//         .then(response => response.json())
//         .then(data => {
//             setOutline(data.response);
//             // Remove the overlay when content is loaded
//             overlay.remove();
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             setOutline('Error fetching data. Please try again.');
//             // Remove the overlay when content is loaded
//             overlay.remove();
//         });
//     };

//     const generateSelectedContent = () => {
//         // Create overlay div
//         const overlay = document.createElement("div");
//         overlay.className = "overlay";
//         overlay.innerHTML = '<div class="loader"></div>';

//         // Append overlay to the body
//         document.body.appendChild(overlay);

//         fetch(`http://localhost:5000/generate-content?headings=${encodeURIComponent(JSON.stringify(selectedHeadings))}`)
//             .then(response => response.json())
//             .then(data => {
//                 setContent(data);
//                 // Remove the overlay when content is loaded
//                 overlay.remove();
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 setContent({});
//                 // Remove the overlay when content is loaded
//                 overlay.remove();
//             });
//     };

//     return (
//         <div>
//             <h1>Research Paper Outline Generator</h1>
//             <form>
//                 <label htmlFor="researchTopic">Enter the topic of your research paper:</label>
//                 <input
//                     type="text"
//                     id="researchTopic"
//                     name="researchTopic"
//                     value={topic}
//                     onChange={e => setTopic(e.target.value)}
//                     required
//                 />
//                 <button type="button" onClick={generateOutline}>Generate Outline</button>
//             </form>

//             <div id="outlineResult">{outline}</div>

//             <div id="checkboxForm">
//                 <h2>Select Headings and Sub-Headings:</h2>
//                 <ul className="checkbox-menu" id="checkboxes">
//                     {outline && outline.split('\n').map((line, index) => (
//                         line.trim() && (
//                             <li key={index} className="checkbox-item">
//                                 <input
//                                     type="checkbox"
//                                     value={line}
//                                     id={`checkbox${index}`}
//                                     onChange={e => {
//                                         const selected = [...selectedHeadings];
//                                         if (e.target.checked) {
//                                             selected.push(e.target.value);
//                                         } else {
//                                             const index = selected.indexOf(e.target.value);
//                                             if (index !== -1) {
//                                                 selected.splice(index, 1);
//                                             }
//                                         }
//                                         setSelectedHeadings(selected);
//                                     }}
//                                 />
//                                 <label htmlFor={`checkbox${index}`}>{line}</label>
//                             </li>
//                         )
//                     ))}
//                 </ul>
//                 <button type="button" onClick={generateSelectedContent} className="generate-button">Generate Content</button>
//             </div>

//             <div>
//                 {/* Iterate through the dictionary and display each heading and its content */}
//                 {Object.entries(content).map(([heading, content]) => (
//                     <div key={heading}>
//                         <h2>{heading}</h2>
//                         <div>{content}</div>
//                         <hr />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;


import React, { useState , useEffect} from 'react';
import './App.css'

function App() {
    const [topic, setTopic] = React.useState('');
    const [outline, setOutline] = React.useState('');
    const [selectedHeadings, setSelectedHeadings] = React.useState([]);
    const [content, setContent] = React.useState({});
    const [activeTab, setActiveTab] = useState('enterTopic');
    const [isLoading, setIsLoading] = useState(false);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const generateOutline = () => {
        // // Create overlay div
        // const overlay = document.createElement("div");
        // overlay.className = "overlay";
        // overlay.innerHTML = '<div class="loader"></div>';

        // // Append overlay to the body
        // document.body.appendChild(overlay);
        setIsLoading(true);

        fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: topic })
        })
        .then(response => response.json())
        .then(data => {
            setOutline(data.response);
            // Automatically switch to "Generated Outline" tab
            setActiveTab('generatedOutline');
            // // Clear checkboxes
            // const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            // checkboxes.forEach(checkbox => {
            //     checkbox.checked = false;
            // });
            // // Remove the overlay when content is loaded
            // overlay.remove();
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setOutline('Error fetching data. Please try again.');
            // // Remove the overlay when content is loaded
            // overlay.remove();
            setIsLoading(false);
        });
    };

    const generateSelectedContent = () => {
        // Clear the content state
        setContent({});

        // Clear the selectedHeadings state
        setSelectedHeadings([]);
    //     // Create overlay div
    //   const overlay = document.createElement("div");
    //   overlay.className = "overlay";
    //   overlay.innerHTML = '<div class="loader"></div>';
  
    //   // Append overlay to the body
    //   document.body.appendChild(overlay);

        setIsLoading(true);
        
        fetch(`http://localhost:5000/generate-content?headings=${encodeURIComponent(JSON.stringify(selectedHeadings))}`)
          .then(response => response.json())
          .then(data => {
            setContent(data);
            // Automatically switch to "Generated Content" tab
            setActiveTab('generatedContent');
            //   // Remove the overlay when content is loaded
            //   overlay.remove();
            setIsLoading(false);
          })
          .catch(error => {
              console.error('Error:', error);
              setContent({});
            //   // Remove the overlay when content is loaded
            //   overlay.remove();
            setIsLoading(false);
          });
    };

    useEffect(() => {
        // Fetch generated content when the component mounts
        fetchGeneratedContent();
    }, []); // Empty dependency array to ensure the effect runs only once

    const fetchGeneratedContent = () => {
        // Fetch generated content from backend
        fetch(`http://localhost:5000/generate-content?headings=${encodeURIComponent(JSON.stringify(selectedHeadings))}`)
            .then(response => response.json())
            .then(data => {
                // Ensure content is an array
                if (Array.isArray(data)) {
                    setContent(data);
                } else if (typeof data === 'object') {
                    // Convert object to array of objects
                    setContent(Object.entries(data).map(([heading, content]) => ({ [heading]: content })));
                } else {
                    setContent([]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setContent([]);
        });
    };

  
    return (
        <div className="app-container">
            {isLoading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h1>Research Paper Outline Generator</h1>

            <div className="tabs">
                <button className={activeTab === 'enterTopic' ? 'active' : ''} onClick={() => handleTabChange('enterTopic')}>Enter Topic</button>
                <button className={activeTab === 'generatedOutline' ? 'active' : ''} onClick={() => handleTabChange('generatedOutline')}>Generated Outline</button>
                <button className={activeTab === 'generatedContent' ? 'active' : ''} onClick={() => handleTabChange('generatedContent')}>Generated Content</button>
            </div>

            {activeTab === 'enterTopic' && (
                <div>
                    <form>
                        <label htmlFor="researchTopic">Enter the topic of your research paper:</label>
                        <input
                            type="text"
                            id="researchTopic"
                            name="researchTopic"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <button type="button" onClick={generateOutline}>Generate Outline</button>
                    </form>
                </div>
            )}
            {activeTab === 'generatedOutline' && (
                <div>
                    <h2>Generated Outline</h2>
                    <div id="outlineResult">{outline}</div>
                    {outline && (
                    <div className="checkbox-container">
                        <h3>Select Headings and Sub-Headings:</h3>
                        <div className="checkbox-scroll-box">
                            <ul className="checkbox-menu" id="checkboxes">
                                {outline.split('\n').map((line, index) => (
                                    line.trim() && (
                                    <li key={index} className="checkbox-item">
                                        <input
                                        type="checkbox"
                                        value={line}
                                        id={`checkbox${index}`}
                                        onChange={e => {
                                            const selected = [...selectedHeadings];
                                            if (e.target.checked) {
                                                selected.push(e.target.value);
                                            } else {
                                                const index = selected.indexOf(e.target.value);
                                                if (index !== -1) {
                                                    selected.splice(index, 1);
                                                }
                                            }
                                            setSelectedHeadings(selected);
                                        }}
                                        />
                                        <label htmlFor={`checkbox${index}`}>{line}</label>
                                    </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                    )}
                    {/* End of checkbox rendering */}
                    {/* Generate Content button */}
                    <button type="button" onClick={generateSelectedContent} className="generate-button" disabled={isLoading}>
                        Generate Content
                    </button>
                </div>
            )}
            
            {activeTab === 'generatedContent' && (
                <div>
                    <h2>Generated Content</h2>
                    {/* Display generated content */}
                    {content.map((headingContent, index) => (
                    <div key={index}>
                        <h3>{Object.keys(headingContent)}</h3> {/* Display heading */}
                        <div>{Object.values(headingContent)}</div> {/* Display content */}
                        <hr />
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;