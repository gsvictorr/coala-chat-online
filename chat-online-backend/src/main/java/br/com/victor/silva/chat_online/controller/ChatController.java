package br.com.victor.silva.chat_online.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import br.com.victor.silva.chat_online.dto.MessageDTO;
import br.com.victor.silva.chat_online.model.Message;
import br.com.victor.silva.chat_online.repository.MessageRepository;

@Controller
public class ChatController {

    private final MessageRepository messageRepository;

    public ChatController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/enviar")
    @SendTo("/topico/mensagens")
    public Message sendMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setUsername(messageDTO.username());
        message.setContent(messageDTO.content());
        System.out.println("Usuário conectado: " + messageDTO.username());
        messageRepository.save(message);
        return message;
    }
}