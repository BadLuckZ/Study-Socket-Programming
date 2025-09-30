import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MY_IP, SERVER_IP, PORT } from "../../backend/utils/config";
import type { Message } from "../../backend/utils/interface";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState(1); // 0: dark, 1: light
  const [isConnected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll to the last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket: Initialization
  useEffect(() => {
    // สร้าง Client Socket
    const newSocket = io(`${SERVER_IP}:${PORT}`, {
      transports: ["websocket"],
    });

    // เก็บ Client Socket
    setSocket(newSocket);

    // เมื่อไหร่ก็ตามที่ Client Socket ได้รับ "connect" (พบว่ามี User เชื่อมต่อ) Code นี้จะทำงาน
    newSocket.on("connect", () => {
      setConnected(true);
    });

    // เมื่อไหร่ก็ตามที่ Client Socket ได้รับ "disconnect" (พบว่ามี User ไม่เชื่อมต่อแล้ว) Code นี้จะทำงาน
    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Socket: Messages
  useEffect(() => {
    if (!socket) return;

    // เมื่อไหร่ก็ตามที่ Client Socket ได้รับ "messages" Code ชุดนี้จะทำงาน
    socket.on("messages", (newMessages: Message[]) => {
      setMessages(newMessages);
    });

    // เมื่อไหร่ก็ตามที่ Client Socket ได้รับ "typing" Code ชุดนี้จะทำงาน
    socket.on("typing", (users: string[]) => {
      setTypingUsers(users);
    });

    return () => {
      socket.off("messages");
      socket.off("typing");
    };
  }, [socket]);

  const toggleTheme = () => {
    if (theme == 0) {
      setTheme(1);
    } else {
      setTheme(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socket) return;

    socket.emit("typing", MY_IP);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msg: Message = {
      user: MY_IP,
      text: input,
      timestamp: new Date().toISOString(),
    };

    // ส่ง "message" ไปให้ Server Socket พร้อม 1 ข้อมูล คือ input
    socket.emit("message", msg);
    setInput("");
  };

  const handleConnect = () => {
    if (!socket) return;

    if (isConnected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 bg-primary text-primary-foreground py-3 px-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Testing</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-secondary-foreground px-3 py-1 rounded-full bg-secondary shadow hover:opacity-90 transition">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs font-semibold text-secondary-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <button
            onClick={() => {
              toggleTheme();
              document.documentElement.classList.toggle("dark");
            }}
            className="cursor-pointer bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm shadow hover:opacity-90 transition"
          >
            {theme == 0 ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Messages */}
      <ul className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 &&
          messages.map((msg: Message, index) => {
            const isMe = msg.user === MY_IP;
            const time = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li
                key={index}
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm animate-fadeIn ${
                  isMe
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-card text-card-foreground border border-border"
                }`}
              >
                {!isMe && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {msg.user}:
                  </span>
                )}{" "}
                <span>{msg.text}</span>
                <span className="text-[10px] text-foreground ml-2">{time}</span>
              </li>
            );
          })}
        <div ref={messagesEndRef} />
      </ul>

      {/* Typing indicator */}
      <div className="px-4 py-1 text-xs text-muted-foreground">
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </span>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center p-2 shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-grow mx-2 px-4 py-2 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder-muted-foreground"
          placeholder="Type a message..."
          autoComplete="off"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!isConnected}
          className="bg-primary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
        <button
          type="button"
          onClick={handleConnect}
          className="bg-primary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </form>
    </div>
  );
}
