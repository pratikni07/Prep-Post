package com.post.post.model;

import com.post.post.model.User;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "userDetails")
public class UserDetail {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
//    private List<Quiz> quiz;

    private String resume;

//    @DBRef
//    private List<Education> education;

//    @DBRef
//    private List<Skill> skills;

//    @DBRef
//    private List<Experience> experience;

//    @DBRef
//    private List<Certification> certifications;

//    @DBRef
//    private List<Language> languages;

//    @DBRef
//    private List<Project> projects;

//    @DBRef
//    private List<Achievement> achievements;

//    @DBRef
//    private List<Publication> publications;

    private Double score;

    private List<String> posts;

    @DBRef
    private List<User> connections;

    @DBRef
    private List<User> followings;

    @DBRef
    private List<User> blockedUsers;

    private Boolean subscriber = false;

    // Getters and Setters
}
