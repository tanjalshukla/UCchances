UC Chances Calculator  
UC Chances Calculator is a full-stack web application designed to help students assess their chances of admission to University of California (UC) campuses. By leveraging public data from the UC college system, the application allows users to compare their GPA against admission averages from their high schools over recent years, providing insight into their competitiveness for various UC colleges.  

Technologies Used
Frontend:
React with Vite for a fast development environment.
Tailwind CSS for utility-first styling.
Backend:
Spring Boot for building a robust and scalable server-side application.
Node.js for server-side JavaScript runtime.
Database:
PostgreSQL for reliable and efficient data management.
Other Tools:
Axios for handling HTTP requests.
JPA (Java Persistence API) for database interactions.

API Documentation
Endpoints
1. Get High Schools
URL: /api/highschools/get

Description: Retrieves a list of high schools based on the in-state parameter.

Parameters:

cond (boolean): true for in-state high schools, false for out-of-state.
Response:

json
[
  {
    "highSchoolId": "SAMPLE HIGH SCHOOL 1_SAMPLE COUNTY",
    "inState": true,
    "countyId": "SAMPLE COUNTY"
  },
  {
    "highSchoolId": "SAMPLE HIGH SCHOOL 2_SAMPLE COUNTY 2",
    "inState": false,
    "countyId": "SAMPLE COUNTY 2"
  }
  // ... more high schools
]
2. Calculate GPA
URL: /api/highschools/findgpa

Description: Calculates the user's GPA based on input grades.

Parameters:

a (number): Number of A's.
b (number): Number of B's.
c (number): Number of C's.
d (number): Number of D's.
f (number): Number of F's.
honors (number): Number of Honors courses.
Response:

json
"3.75"
3. Get Average GPA for High School and UC
URL: /api/highschools/avg

Description: Retrieves the average GPA for a specific high school and UC campus.

Parameters:

hs_id (string): High school ID.
uc_id (string): UC campus ID (e.g., "SD" for San Diego).
Response:

json
Copy code
{
  "entryCount": 50,
  "averageGPA": "3.50"
}
4. Get County Average GPA for UC
URL: /api/highschools/county

Description: Retrieves the average GPA for a specific county and UC campus.

Parameters:

county_id (string): County ID.
uc_id (string): UC campus ID.
Response:

json
Copy code
{
  "entryCount": 30,
  "averageGPA": "3.40"
}