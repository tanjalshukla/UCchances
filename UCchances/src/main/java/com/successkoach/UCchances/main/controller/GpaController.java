package com.successkoach.UCchances.main.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/highschools")
public class GpaController {
    @GetMapping("/findgpa/semester")
    public float gpaCalc(@RequestParam int a, @RequestParam int b, @RequestParam int c, @RequestParam int d,
            @RequestParam int f, @RequestParam int honors) {
        if (a + b + c + d + f == 0) {
            return 0;
        }
        return Math.round((((float) a * 4 + b * 3 + c * 2 + d + Math.min(honors, 8)) / (a + b + c + d + f)) * 100)
                / (float) 100.00;
    }

    @GetMapping("/findgpa/trimester")
    public float gpaSem(@RequestParam int a, @RequestParam int b, @RequestParam int c, @RequestParam int d,
            @RequestParam int f, @RequestParam int honors) {
        if (a + b + c + d + f == 0) {
            return 0;
        }
        return Math
                .round((((float) a * 4 + b * 3 + c * 2 + d + Math.min(honors, 12) * 0.6666666666667f)
                        / (a + b + c + d + f)) * 100)
                / (float) 100.00;
    }

    @GetMapping("/findgpa/quarter")
    public float gpaCalcQuart(@RequestParam int a, @RequestParam int b, @RequestParam int c, @RequestParam int d,
            @RequestParam int f, @RequestParam int honors) {
        if (a + b + c + d + f == 0) {
            return 0;
        }
        return Math
                .round((((float) a * 4 + b * 3 + c * 2 + d + Math.min(honors, 16) * 0.5f) / (a + b + c + d + f)) * 100)
                / (float) 100.00;
    }

}