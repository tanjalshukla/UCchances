package com.successkoach.UCchances.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.successkoach.UCchances.main.model.GpaResponse;
import com.successkoach.UCchances.main.repositories.AdmissionEntryRepo;

@RestController
@RequestMapping("/api/highschools")
public class AdmissionController {

    public final int START = 2020;
    public final int END = 2023;

    @Autowired
    private AdmissionEntryRepo cont;

    @GetMapping("/avg")
    public GpaResponse getAvgGPA(@RequestParam String hs_id, @RequestParam String uc_id) {

        int count = 0;
        Float val;
        float total = 0;
        //System.out.println("check");
        for (int i = START; i < END; i++) {
            val = cont.findHSgpa(hs_id, i, uc_id);
            if (val != null && val > 0) {
                count++;
                total += val;
            }
        }
        // System.out.print("check 2");
        if (count == 0) {
            return new GpaResponse(0, 0);
        }
        // System.out.println((float) Math.round((total / count) * 100) / 100);
        return new GpaResponse((float) Math.round((total / count) * 100) / 100, count);
    }

    @GetMapping("/county")
    public float getCountyAvg(@RequestParam String uc_id, @RequestParam String county_id) {
        return (float) Math.round(cont.findCountyAvg(uc_id, county_id) * 100) / 100;
    }

    @GetMapping("/specific")
    public Float getSpecificGPA(@RequestParam String hs_id, @RequestParam String uc_id, @RequestParam int year) {
        return cont.findHSgpa(hs_id, year, uc_id);
    }

}
