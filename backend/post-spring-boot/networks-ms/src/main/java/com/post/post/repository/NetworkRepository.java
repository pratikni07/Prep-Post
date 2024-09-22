package com.post.post.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.post.post.model.Networks;

public interface NetworkRepository extends MongoRepository<Networks, String> {
    Networks findByUserId(String userId);
}
