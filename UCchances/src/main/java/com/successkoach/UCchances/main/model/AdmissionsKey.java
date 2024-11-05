package com.successkoach.UCchances.main.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.*;

@Embeddable
public class AdmissionsKey implements Serializable {

    @Column(name = "high_school_id")
    private String high_school_id;

    @Column(name = "year")
    private int year;

    @Column(name = "uc_id")
    private String uc_id;

    public AdmissionsKey() {
    }

    public AdmissionsKey(String hsId, String ucId, int year) {
        this.high_school_id = hsId;
        this.uc_id = ucId;
        this.year = year;
    }

    public String getHS() {
        return this.high_school_id;
    }

    public int getYear() {
        return this.year;
    }

    public String getUCID() {
        return this.uc_id;
    }

    // re-done hashcode and equals as it relies on three primary keys of the object,
    // noe one

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof AdmissionsKey))
            return false;
        AdmissionsKey that = (AdmissionsKey) o;
        return year == that.year && uc_id.equals(that.uc_id) && high_school_id.equals(that.high_school_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(year, uc_id, high_school_id);
    }

}
