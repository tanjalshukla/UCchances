package com.successkoach.UCchances.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.successkoach.UCchances.model.AdmissionEntry;
import com.successkoach.UCchances.model.AdmissionsKey;

public interface AdmissionEntryRepo extends JpaRepository<AdmissionEntry, AdmissionsKey> {
    // Query which provides the gpa based off of the information given
    @Query(value = "SELECT gpa FROM admissions WHERE high_school_id = ?1 AND year = ?2 AND uc_id = ?3", nativeQuery = true)
    Float findHSgpa(String hs_id, int year, String uc_id);

    // Query which takes every school in a county and provides average
    @Query(value = "SELECT AVG(gpa) FROM admissions where county_id = ?1 AND uc_id = ?2", nativeQuery = true)
    Float findCountyAvg(String county_id, String uc_id);
}
