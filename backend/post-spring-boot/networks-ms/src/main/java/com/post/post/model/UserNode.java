package com.post.post.model;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;
import java.util.List;

@NodeEntity
public class UserNode {

    @Id
    @GeneratedValue
    private Long id;
    private String userId;

    @Relationship(type = "CONNECTED_TO", direction = Relationship.UNDIRECTED)
    private List<UserNode> connections;

    // Getters and Setters
}
