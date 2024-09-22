package com.post.post.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "networks")
public class Networks {

    @Id
    private String id;
    private String userId; // User ID (from your authentication system)
    private List<String> connections; // Connected user IDs
    private List<String> pendingRequests; // Connection requests
    private List<String> blockedUsers; // Blocked users
    private String profileVisibility = "public"; // Profile visibility settings

    // Getters and Setters
}
