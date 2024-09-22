package com.network.service.neo4j.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.network.service.neo4j.model.UserNode;
import com.post.post.model.UserNode;

public interface UserNodeRepository extends Neo4jRepository<UserNode, Long> {
    UserNode findByUserId(String userId);
}
