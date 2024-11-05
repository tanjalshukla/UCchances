package com.successkoach.UCchances.main.model;

import jakarta.persistence.*;

@Entity
@Table(name = "high_schools")
public class HighSchool {

    @Id
    @Column(name = "high_school_id", nullable = false)
    private String high_school_id;

    @Column(name = "in_state", nullable = false)
    private boolean in_state;

    @Column(name = "county_id", nullable = false)
    private String county_id;

    // private String high_school_name;

    public HighSchool() {

    }

    // sets the high school's name from the id
    public HighSchool(String highSchoolId, String countyID, boolean inState) {
        this.high_school_id = highSchoolId;
        this.county_id = countyID;
        this.in_state = inState;
        // high_school_name = high_school_id.substring(0, high_school_id.indexOf("_"));
    }

    public String getHighSchoolName() {
        return getHighSchoolId().substring(0, getHighSchoolId().indexOf("_"));
    }

    public String getHighSchoolId() {
        return high_school_id;
    }

    public void setHighSchoolId(String highSchoolId) {
        this.high_school_id = highSchoolId;
    }

    public boolean isInState() {
        return in_state;
    }

    public void setInState(boolean inState) {
        this.in_state = inState;
    }

    public String getCountyId() {
        return county_id;
    }

    public void setCountyId(String countyId) {
        this.county_id = countyId;
    }

}