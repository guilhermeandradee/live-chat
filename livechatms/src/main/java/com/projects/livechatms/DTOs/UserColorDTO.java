package com.projects.livechatms.DTOs;

import com.projects.livechatms.controller.UserColor;

import java.util.List;

public record UserColorDTO(String type, List<UserColor> userColors) {
}
