'use client';

import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { format } from 'date-fns';

export default function Chat() {
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ username: string; content: string; timestamp: string; }[]>([]);
  const [connected, setConnected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const stompClientRef = useRef<CompatClient | null>(null); // <- aqui

  useEffect(() => {
    if (username && !stompClientRef.current) {
      const socket = new SockJS('http://localhost:8080/websocket');
      const stomp = Stomp.over(socket) as CompatClient;

      stomp.connect({}, () => {
        setConnected(true);
        stomp.subscribe('/topico/mensagens', (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
      });

      stompClientRef.current = stomp;
    }
  }, [username]);

  const sendMessage = () => {
    const stompClient = stompClientRef.current;

    if (stompClient && input.trim() !== '') {
      const message = {
        username,
        content: input.trim(),
      };
      stompClient.send('/app/enviar', {}, JSON.stringify(message));
      setInput('');
      inputRef.current?.focus();
    }
  };

  if (!username) {
    return (
      <div className="p-4">
        <h2 className="text-lg mb-2">Digite seu nome:</h2>
        <input
          type="text"
          className="border p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setUsername((e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "HH:mm");
};

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl text-gray-400 font-bold mb-4">🐨 Coala | Chat Em Tempo Real</h2>
      <div className="border rounded p-3 h-64 overflow-y-auto bg-gray-800 mb-3">
        {messages.map((msg, index) => (
          <div
          key={index}
          className={`w-full flex ${msg.username === username ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div className="inline-block max-w-[80%] break-words rounded-lg bg-blue-900 px-3 py-1 text-white">
            <span>
            🐨 <strong>{msg.username}:</strong> {msg.content}
            </span>
            <div className="text-xs text-purple-200 text-right">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="border p-2 rounded flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite uma mensagem"
        />
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer"
          onClick={sendMessage}
          disabled={!connected}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
