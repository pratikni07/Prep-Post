const User = require("../models/User");
const cacheService = require("./cacheService");
const { Kafka } = require("kafkajs");
const config = require("../config");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [config.kafkaBroker],
});

const producer = kafka.producer();

class UserService {
  async createUser(userData) {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already exists.");
    }

    const user = new User(userData);
    await user.save();
    // Uncomment this to send a message to Kafka after user creation
    // await producer.send({
    //   topic: "user-created",
    //   messages: [{ value: JSON.stringify(user) }],
    // });
    return user;
  }

  async loginUser(email, password) {
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    await cacheService.set(`user:${user._id}`, JSON.stringify(user));
    return { user, token };
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
    await cacheService.set(`user:${user._id}`, JSON.stringify(user));
    await producer.send({
      topic: "user-updated",
      messages: [{ value: JSON.stringify(user) }],
    });
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await cacheService.del(`user:${userId}`);
    await producer.send({
      topic: "user-deleted",
      messages: [{ value: userId }],
    });
  }
}

module.exports = new UserService();
