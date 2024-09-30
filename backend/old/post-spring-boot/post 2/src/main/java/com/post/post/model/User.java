package com.post.post.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "postusers")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String role = "User";
    private Boolean visibility = true;

    @DBRef
    private UserDetail userDetail;

    private Date createdDate = new Date();

    // Getters and Setters
}
