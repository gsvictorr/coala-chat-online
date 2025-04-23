package br.com.victor.silva.chat_online.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topico"); // prefixo de saída 
        config.setApplicationDestinationPrefixes("/app"); // prefixo de entrada
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket") // endpoint que o frontend vai conectar
                .setAllowedOriginPatterns("*") // libera para qualquer origem (em dev)
                .withSockJS(); // suporte para navegadores sem WebSocket
    }
}

