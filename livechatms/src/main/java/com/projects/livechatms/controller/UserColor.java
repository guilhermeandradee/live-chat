package com.projects.livechatms.controller;

public class UserColor {
    private String user;
    private String color;
    private String type;
    public UserColor(){}
    public UserColor(String user, String color) {
        this.user = user;
        this.color = color;
    }
    public UserColor(String user, String type, String color){
        this.user = user;
        this.color = color;
        this.type = type;
    }


    public String getUser() {
        return user;
    }

    public String getColor() {
        return color;
    }
    public String getType() {
        return type;
    }
}
