package com.projects.livechatms.DTOs;

public class ChatMessage {
    private String type;
    private String user;
    private String message;
    private String sessionId;

    // Getters e setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
