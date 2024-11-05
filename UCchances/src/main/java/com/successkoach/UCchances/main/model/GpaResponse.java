package com.successkoach.UCchances.main.model;

public class GpaResponse {
    private Float averageGPA;
    private int entryCount;

    public GpaResponse(float avgGpa, int e) {
        this.averageGPA = avgGpa;
        this.entryCount = e;
    }

    public float getAverageGPA() {
        return this.averageGPA;
    }

    public int getEntryCount() {
        return this.entryCount;
    }

    public void setAverageGPA(float avgGpa) {
        this.averageGPA = avgGpa;
    }

    public void setEntryCount(int e) {
        this.entryCount = e;
    }
}
