package br.com.victor.silva.chat_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.victor.silva.chat_online.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
