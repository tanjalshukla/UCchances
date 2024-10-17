import React, { useState, useEffect } from 'react'
import logo from './assets/logo.webp'
import './App.css';
import './index.css';
import axios from 'axios';

function App() {

  const [inState, setInState] = useState(null);
  const [highSchools, setHighSchools] = useState([]);
  const [selectedHighSchool, setSelectedHighSchool] = useState('');
  const [aGrades, setAGrades] = useState(0);
  const [bGrades, setBGrades] = useState(0);
  const [cGrades, setCGrades] = useState(0);
  const [dGrades, setDGrades] = useState(0);
  const [fGrades, setFGrades] = useState(0);
  const [honorsCourses, setHonorsCourses] = useState(0);
  const [gpa, setGpa] = useState(-1);
  const [averageGpas, setAverageGpas] = useState([]);
  
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
      console.log("checkpoint 2");
      for (const h of response.data) {
        console.log(h.countyId);
        console.log(h.inState);
      }
      console.log("checkpoint 3")
      setHighSchools(response.data);
    } catch (error){
        console.error('Error fetching high schools:', error);
    }
  };

  const handleGpaSubmit = async (e) => {
    e.preventDefault();
    /*
    const numAGrades = Number(aGrades);
    const numBGrades = Number(bGrades);
    const numCGrades = Number(cGrades);
    const numDGrades = Number(dGrades);
    const numFGrades = Number(fGrades);
    const numHonorsCourses = Number(honorsCourses);
    */
    try {
      const response = await axios.get('/api/highschools/findgpa', {
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

      const selectedHS = highSchools.find((hs) => hs.highSchoolId === selectedHighSchool);
      
      const countyId = selectedHS ? selectedHS.county_id : null;
      const inState = selectedHS ? selectedHS.in_state : null;

      console.log("selected hs: " + selectedHS + ", countyId: " + countyId + ", inState: " + inState);

      for(const ucId of ucIDs) {
        const avgResponse = await axios.get("/api/highschools/avg", {
          params: {
            hs_id: selectedHighSchool,
            uc_id: ucId,
          },
        });


        if(avgResponse.data.entryCount == 0) {
          if (!inState) {
            avgGpaArray.push({
              ucId,
              averageGpa: "No UC Data for admitted students from your school. Sorry!",
              difference: "N/A",
              status: "Unknown",
            })
          } else {
              const countyAvg = await axios.get("/api/highschools/county", {
                params: {
                  county_id: countyId,
                  uc_id: ucId, 
                },
              })
          }  
          
        } else {
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
            value={selectedHighSchool}
            onChange={(e) => setSelectedHighSchool(e.target.value)}
          >
            <option value="">-- Select your high school --</option>
            {highSchools.map((school) => (
              <option key={school.highSchoolId} value={school.highSchoolId}>
                {school.highSchoolId}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* GPA Calculation Form */}
      {selectedHighSchool && (
        <form onSubmit={handleGpaSubmit} className="space-y-8">
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
    </div>
  );
}

export default App;
