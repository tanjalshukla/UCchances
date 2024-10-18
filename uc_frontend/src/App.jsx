import React, { useState, useEffect } from 'react'
import logo from './assets/logo.webp'
import './App.css';
import './index.css';
import axios from 'axios';

function App() {

  const [inState, setInState] = useState(null);
  const [highSchools, setHighSchools] = useState([]);
  const [selectedHighSchool, setSelectedHighSchool] = useState(null);
  const [countyId, setCountyId] = useState(null);
  const [aGrades, setAGrades] = useState(0);
  const [bGrades, setBGrades] = useState(0);
  const [cGrades, setCGrades] = useState(0);
  const [dGrades, setDGrades] = useState(0);
  const [fGrades, setFGrades] = useState(0);
  const [honorsCourses, setHonorsCourses] = useState(0);
  const [gpa, setGpa] = useState(-1);
  const [averageGpas, setAverageGpas] = useState([]);
  const [gradingPeriod, setGradingPeriod] = useState('semester');
  const [errorMessage, setErrorMessage] = useState('');
  const [countyMessage, setCountyMessage] = useState('');
  
  let TARGET = 0.3;

  const ucNames = {
    SD: 'San Diego',
    SB: 'Santa Barbara',
    LA: 'Los Angeles',
    BK: 'Berkeley'
  };

  const ucIDs = ['SD', 'SB', 'LA', 'BK'];

  //////ASYNC FUNCTIONS////////////

  //Fetch high schools from backend when user selects type of school
  const handleInStateSelection = async (inState) => {
    setInState(inState);
    try {
      const response = await axios.get('/api/findHighSchool/get', {
        params: {cond: inState}, 
      });
      for (const h of response.data) {
        console.log(h.countyId);
        console.log(h.inState);
      }
      setHighSchools(response.data);
    } catch (error){
        console.error('Error fetching high schools:', error);
    }
  };

  const handleGpaSubmit = async (e) => {
    e.preventDefault();
    
    const maxHonors = getMaxHonorsCourses(gradingPeriod);
    setCountyMessage(new Set());
    if(honorsCourses > maxHonors) {
      setErrorMessage(`We can only count up to ${maxHonors} honors courses in a ${gradingPeriod}.`);
    } else {
      setErrorMessage('');
    }

    try {
      const response = await axios.get(`/api/highschools/findgpa/${gradingPeriod}`, {
        params: {
          a: aGrades,
          b: bGrades,
          c: cGrades, 
          d: dGrades,
          f: fGrades, 
          honors: honorsCourses,
        },    
      });

      setGpa(response.data)
      
      const avgGpaArray = [];

      console.log("selected hs: " + selectedHighSchool + ", countyId: " + countyId + ", inState: " + inState);

      for(const ucId of ucIDs) {
        const avgResponse = await axios.get("/api/highschools/avg", {
          params: {
            hs_id: selectedHighSchool.highSchoolId,
            uc_id: ucId,
          },
        });


        if (avgResponse.data.entryCount == 0) {
          if (!inState) {
            avgGpaArray.push({
              ucId,
              averageGpa: "No UC Data for admitted students from your school.",
              difference: "N/A",
              status: "Unknown",
            });
          } else {
            setCountyMessage(prev => new Set(prev).add(ucId));
            try {
              console.log(countyId, ucId);
              const countyAvgResponse = await axios.get("/api/highschools/county", {
                params: {
                  uc_id: ucId,
                  county_id: countyId,
                },
              });
              if (countyAvgResponse.data.entryCount == 0) {
                avgGpaArray.push({
                  ucId,
                  averageGpa: "No UC Data for admitted students from your county.",
                  difference: "N/A",
                  status: "Unknown",
                });
            ;
              }
              const countyAverageGpa = countyAvgResponse.data; // Ensure this matches your backend response
              // console.log(countyAvgResponse.data);
              const difference = (response.data - countyAverageGpa).toFixed(2);
              let status = '';
        
              if (difference > TARGET) {
                status = "Safety";
              } else if (difference > TARGET * -1) {
                status = "Target";
              } else {
                status = "Reach";
              }
        
              avgGpaArray.push({
                ucId,
                averageGpa: countyAverageGpa,
                difference: difference,
                status: status,
              });
            } catch (error) {
              console.error('Error fetching county average GPA:', error);
              avgGpaArray.push({
                ucId,
                averageGpa: "Error fetching county data.",
                difference: "N/A",
                status: "Unknown",
              });
            }
            
          }
        }
         else {
          const averageGpa = avgResponse.data.averageGPA;
          const difference = (response.data - averageGpa).toFixed(2);
          console.log("gpa: "+ gpa + " avg:" + averageGpa + " diff: " + difference);
          let status = '';
          if (difference > TARGET) {
            status = "Safety";
          } else if (difference > TARGET * -1) {
            status = "Target";
          } else {
            status = "Reach";
          }
          //console.log("gpa: " + averageGpa);
          avgGpaArray.push({
            ucId, averageGpa: averageGpa, difference: difference, status: status
          });
        }
      }
      setAverageGpas(avgGpaArray);

    } catch (error) { 
      console.error('Error calculating GPA;', error);
    }
  };

  const getMaxHonorsCourses = (gradingPeriod) => {
    switch (gradingPeriod) {
      case 'semester':
        return 8;
      case 'trimester':
        return 12;
      case 'quarter':
        return 16;
      default:
        return 8;
    }
  };

  function formatHighSchoolName(highSchoolId) {
    const parts = highSchoolId.split('_'); // Split by underscore
    const schoolName = parts.slice(0, -1).join(' '); // Join all but the last part as the school name
    const countyName = parts[parts.length - 1]; // Last part is the county
  
    // Capitalize the first letter of each word and make the rest lowercase
    const capitalizeWords = (str) => 
      str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  
    const formattedSchoolName = capitalizeWords(schoolName);
    const formattedCountyName = capitalizeWords(countyName);
  
    return `${formattedSchoolName} | ${formattedCountyName}`;
  }
  
 

  /////////////////////////////////

  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8 border-2 border-black">
      {/*Logo section*/}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo" className="h-16 w-128" />
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-8 black">
        UC Admissions Calculator
      </h1>

      {/* In-State / Out-of-State Selection */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => handleInStateSelection(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 border-2 border-secondary ${
            inState === true
              ? 'bg-primary text-white hover:bg-secondary'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          In-State
        </button>
        <button
          onClick={() => handleInStateSelection(false)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 border-2 border-secondary ${
            inState === false
              ? 'bg-primary text-white hover:bg-secondary'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Out-of-State
        </button>
      </div>

      {/* High Schools Dropdown */}
      {highSchools.length > 0 && (
        <div className="mb-8">
          <label className="block mb-3 text-lg font-medium text-gray-700">
            Select Your High School:
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
            value= {selectedHighSchool ? selectedHighSchool.highSchoolId : ""}
            onChange={(e) => {
              const selectedSchool = highSchools.find((school) => school.highSchoolId === e.target.value);
              setSelectedHighSchool(selectedSchool); // Set full HighSchool object
              setCountyId(selectedSchool.countyId); // Set countyId from the object
            }}
          >
            <option value="">-- Select your high school --</option>
            {highSchools.map((school) => (
              <option key={school.highSchoolId} value={school.highSchoolId}>
                {formatHighSchoolName(school.highSchoolId)} {/* Display formatted name */}
              </option>
            ))}
          </select>
        </div>
      )}


      {/* Grading Period Selection */}
      { selectedHighSchool && (<div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => setGradingPeriod('semester')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
            gradingPeriod === 'semester'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semester
        </button>
        <button
          onClick={() => setGradingPeriod('trimester')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
            gradingPeriod === 'trimester'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Trimester
        </button>
        <button
          onClick={() => setGradingPeriod('quarter')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
            gradingPeriod === 'quarter'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Quarter
        </button>
      </div>)}


      {/* GPA Calculation Form */}
      {selectedHighSchool && (
        <form onSubmit={handleGpaSubmit} className="space-y-8">
          {/* Display Error Message */}
          {errorMessage && (
            <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded relative mb-6 flex items-center justify-between" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setErrorMessage('')}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            )}
          <h2 className="text-3xl font-semibold text-gray-800">
            Enter Your Grades
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Number of A's */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of A's:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={aGrades}
                onChange={(e) => setAGrades(e.target.value)}
                required
              />
            </div>

            {/* Number of B's */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of B's:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={bGrades}
                onChange={(e) => setBGrades(e.target.value)}
                required
              />
            </div>

            {/* Number of C's */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of C's:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={cGrades}
                onChange={(e) => setCGrades(e.target.value)}
                required
              />
            </div>

            {/* Number of D's */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of D's:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={dGrades}
                onChange={(e) => setDGrades(e.target.value)}
                required
              />
            </div>

            {/* Number of F's */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of F's:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={fGrades}
                onChange={(e) => setFGrades(e.target.value)}
                required
              />
            </div>

            {/* Number of Honors Courses */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Number of Honors Courses:
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={honorsCourses}
                onChange={(e) => setHonorsCourses(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors duration-300"
          >
            Calculate GPA and Fetch Average GPAs
          </button>
        </form>
      )}
 


      {/* Display Calculated GPA */}
      {gpa != -1 && (
        <div className="mt-10 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Your UC GPA: {gpa}
          </h3>
        </div>
      )}

      {/* Display Average GPAs and Comparison Results */}
      {averageGpas.length > 0 && (
        <div className="mt-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Comparison with Average GPAs for UC Schools:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-secondary border border-black">
              <thead>
                <tr>
                  <th className="border border-black px-6 py-3 text-left text-lg font-medium text-white">
                    UC Campus
                  </th>
                  <th className="border border-black px-6 py-3 text-left text-lg font-medium text-white">
                    Average GPA
                  </th>
                  <th className="border border-black px-6 py-3 text-left text-lg font-medium text-white">
                    Your GPA
                  </th>
                  <th className="border border-black px-6 py-3 text-left text-lg font-medium text-white">
                    Difference
                  </th>
                  <th className="border border-black px-6 py-3 text-left text-lg font-medium text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {averageGpas.map((gpaData) => (
                  <tr key={gpaData.ucId} className="bg-white">
                    <td className="border border-black px-6 py-4 text-primary">{`UC ${ucNames[gpaData.ucId]}`}</td>
                    <td className="border border-black px-6 py-4 text-primary">{gpaData.averageGpa}</td>
                    <td className="border border-black px-6 py-4 text-primary">{gpa}</td>
                    <td className="border border-black px-6 py-4 text-primary">
                      {gpaData.difference !== 'N/A'
                        ? `${parseFloat(gpaData.difference) > 0 ? '+' : ''}${gpaData.difference}`
                        : 'N/A'}
                    </td>
                    <td
                      className={`border border-primary px-6 py-4 font-semibold ${
                        gpaData.status === 'Safety'
                          ? 'text-green-600'
                          : gpaData.status === 'Target'
                          ? 'text-yellow-600'
                          : gpaData.status === 'Reach'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {gpaData.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

<div className="mt-4"></div> {/* Add margin top here */}

      {/* Display County Message */}
      {countyMessage.size > 0 && (
            <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded relative mb-6 flex items-center justify-between" role="alert">
              <span className="block sm:inline">We weren't able to find some data for your high school. Instead, we used data from your county. <br />
              County data pulled for: {Array.from(countyMessage).join(', ')}</span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setCountyMessage('')}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            )}
    </div>
  );
}

export default App;