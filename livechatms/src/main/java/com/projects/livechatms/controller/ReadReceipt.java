package com.projects.livechatms.controller;

public class ReadReceipt {
    private String messageId;
    private String user;
    private String type;



    public ReadReceipt( String messageId, String user){
        this.user = user;
        this.messageId = messageId;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getUser() {
        return user;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setType(String type) {
        this.type = type;
    }
}
