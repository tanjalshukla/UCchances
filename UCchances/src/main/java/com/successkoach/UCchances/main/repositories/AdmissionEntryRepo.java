package com.successkoach.UCchances.main.repositories;

import org.springframework.data.jpa.repository.Query;

import com.successkoach.UCchances.main.model.AdmissionEntry;
import com.successkoach.UCchances.main.model.AdmissionsKey;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmissionEntryRepo extends JpaRepository<AdmissionEntry, AdmissionsKey> {
    // Query which provides the gpa based off of the information given
    @Query(value = "SELECT gpa FROM admissions WHERE high_school_id = ?1 AND year = ?2 AND uc_id = ?3", nativeQuery = true)
    Float findHSgpa(String hs_id, int year, String uc_id);

    // Query which takes every school in a county and provides average
    @Query(value = "SELECT AVG(ad.gpa) FROM admissions AS ad JOIN high_schools AS hs ON hs.high_school_id = ad.high_school_id WHERE ad.uc_id = ?1 AND hs.county_id = ?2 AND ad.gpa != 0 ", nativeQuery = true)
    Float findCountyAvg(String uc_id, String county_id);


    /*SELECT AVG(A.gpa) AS cGpa
        FROM admissions A
        JOIN high_schools hs
        ON hs.high_school_id = a.high_school_id
        WHERE a.uc_id = ? 
        AND hs.county_id = ?*/
}
