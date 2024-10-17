package com.successkoach.UCchances.repositories;

import com.successkoach.UCchances.model.HighSchool;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HighSchoolRepo extends JpaRepository<HighSchool, String> {

    // query which returns either all in-state or non in-state based on paramaters
    // into a list
    @Query(value = "SELECT * FROM high_schools WHERE in_state = ?1 ORDER BY high_school_id", nativeQuery = true)
    List<HighSchool> getInState(boolean is_in_state);

}
