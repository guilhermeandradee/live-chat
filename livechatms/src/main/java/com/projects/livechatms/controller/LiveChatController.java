package com.projects.livechatms.controller;

import com.projects.livechatms.DTOs.ChatMessage;
import com.projects.livechatms.DTOs.ObjectResponse;
import com.projects.livechatms.DTOs.UsersConnectedOutput;
import com.projects.livechatms.domain.ChatInput;
import com.projects.livechatms.domain.ChatOutput;
import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ExecutorSubscribableChannel;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;

@Controller
public class LiveChatController {

    private final List<String> usersConnected = new ArrayList<>();

    private final SimpMessagingTemplate messagingTemplate;
    public LiveChatController() {
        this.messagingTemplate = new SimpMessagingTemplate(new ExecutorSubscribableChannel());
    }

    @MessageMapping("/new-message")
    @SendTo("/topics/live-chat")
    public ChatOutput newMessage(ChatInput input){

        return new ChatOutput(input.message(), input.user(), "simple-message");
    }

    @MessageMapping("/register")
    @SendTo("/topics/live-chat")
    public ChatMessage registerUser(ChatMessage message){

        message.setMessage(message.getUser() + " conectado!");
        message.setType("connect");

        return message;
    }

    @MessageMapping("/exit")
    @SendTo("/topics/live-chat")
    public ChatMessage exitUser(ChatMessage message){

        message.setMessage(message.getUser() + " desconectado!");
        message.setType("disconnect");

        return message;
    }

    @MessageMapping("mark-as-read")
    @SendTo("/topics/live-chat")
    public ReadReceipt markAsRead(ReadReceipt receipt){
        String messageId = receipt.getMessageId();
        String user = receipt.getUser();

        receipt.setType("read-receipt");

        return receipt;
    }

    @MessageMapping("/listOfUsers")
    @SendTo("/topics/live-chat")
    public UsersConnectedOutput usersConnected(UsersConnected user){


        if(user.getType().equals("connected-user")){
            if (!usersConnected.contains(user.getUser())) {
                usersConnected.add(user.getUser());
            }

        }
        if(user.getType().equals("disconnected-user")){
            if(!usersConnected.contains(user.getUser())){
                throw new RuntimeException("Usuário não conectado");
            }
            usersConnected.remove(user.getUser());
            System.out.println("usuário removido: " + user.getUser());
        }

        System.out.println(user.getUser());
        return new UsersConnectedOutput("users-connected-list", usersConnected);
    }


}
