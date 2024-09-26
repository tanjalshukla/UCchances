package com.successkoach.UCchances.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admissions")
public class AdmissionEntry {

    @EmbeddedId
    private AdmissionsKey key;

    @Column(name = "gpa")
    private float gpa;

    public AdmissionEntry() {
    }

    public AdmissionEntry(AdmissionsKey k, float g) {
        this.key = k;
        this.gpa = g;
    }

    public AdmissionsKey getKey() {
        return this.key;
    }

    public float getGPA() {
        return this.gpa;
    }

}
