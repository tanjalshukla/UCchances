package com.successkoach.UCchances.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.successkoach.UCchances.model.HighSchool;
import com.successkoach.UCchances.repositories.HighSchoolRepo;

import java.util.List;

@RestController
@RequestMapping("/api/findHighSchool")
public class HighSchoolController {

    @Autowired
    private HighSchoolRepo cont;

    @GetMapping("/get")
    public List<HighSchool> getHighSchools(@RequestParam boolean cond) {
        return cont.getInState(cond);
    }

    @GetMapping("/county")
    public String getCounty(@RequestParam String high_school_id) {
        return cont.getCounty(high_school_id);
    }

}
