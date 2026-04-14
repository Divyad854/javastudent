package com.app;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin
public class StudentController {

    private final StudentRepository studentRepo;
    private final UserRepository userRepo;

    public StudentController(StudentRepository studentRepo, UserRepository userRepo) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
    }

    // -------- REGISTER --------
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists";
        }
        userRepo.save(user);
        return "Registered";
    }

    // -------- LOGIN --------
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> existing = userRepo.findByEmail(user.getEmail());

        if (existing.isPresent() &&
            existing.get().getPassword().equals(user.getPassword())) {
            return "Login Success";
        }
        return "Invalid Credentials";
    }

    // -------- ADD STUDENT --------
    @PostMapping("/students")
    public Student addStudent(@RequestBody Student s) {
        return studentRepo.save(s);
    }

    // -------- GET USER STUDENTS --------
    @GetMapping("/students/{email}")
    public List<Student> getStudents(@PathVariable String email) {
        return studentRepo.findByEmail(email);
    }
}