package com.raxrot.back.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
