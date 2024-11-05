package com.successkoach.UCchances.main.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.successkoach.UCchances.main.model.HighSchool;

public interface HighSchoolRepo extends JpaRepository<HighSchool, String> {

    // query which returns either all in-state or non in-state based on paramaters
    // into a list
    @Query(value = "SELECT * FROM high_schools WHERE in_state = ?1 ORDER BY high_school_id", nativeQuery = true)
    List<HighSchool> getInState(boolean is_in_state);

    // query which returns county based on high school id
    @Query(value = "SELECT county_id FROM high_schools WHERE high_school_id = ?1", nativeQuery = true)
    String getCounty(String high_school_id);

}
