package com.successkoach.UCchances.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.successkoach.UCchances.model.GpaResponse;
import com.successkoach.UCchances.repositories.AdmissionEntryRepo;

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
        System.out.println("check");
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
    public float getCountyAvg(@RequestParam String county_id, @RequestParam String uc_id) {
        return cont.findCountyAvg(county_id, uc_id);
    }

    @GetMapping("/specific")
    public float getSpecificGPA(@RequestParam String hs_id, @RequestParam String uc_id, @RequestParam int year) {
        return cont.findHSgpa(hs_id, year, uc_id);
    }

}
