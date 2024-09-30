package com.successkoach.UCchances.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/highschools")
public class GpaController {
    @GetMapping("/findgpa")
    public float gpaCalc(@RequestParam int a, @RequestParam int b, @RequestParam int c, @RequestParam int d,
            @RequestParam int f, @RequestParam int honors) {
        return Math.round((((float) a * 4 + b * 3 + c * 2 + d + Math.min(honors, 8)) / (a + b + c + d + f)) * 100)
                / (float) 100.00;
    }

}