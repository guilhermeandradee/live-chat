package com.projects.livechatms.controller;

import java.util.List;

public class UsersConnected {

    private String type;
    private String user;
    private List<String> usersConnected;

    public UsersConnected(){

    }

    public UsersConnected(String type, String user){
        this.type = type;
        this.user = user;
    }
    public UsersConnected(List<String> usersConnected, String type){
        this.type = type;
        this.usersConnected = usersConnected;
    }


    public String getType() {
        return type;
    }

    public String getUser() {
        return user;
    }
}
