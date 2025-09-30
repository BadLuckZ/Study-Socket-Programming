import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState(1); // 0: dark, 1: light
  const [isConnected, setConnected] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    // เก็บ Socket ของ localhost:3000 เอาไว้
    setSocket(newSocket);

    // เมื่อไหร่ก็ตามที่ Socket ได้รับ "connect" (พบว่ามี User เชื่อมต่อ) Code นี้จะทำงาน
    newSocket.on("connect", () => {
      console.log("Frontend: User connected");
      setConnected(true);
    });

    // เมื่อไหร่ก็ตามที่ Socket ได้รับ "disconnect" (พบว่ามี User ไม่เชื่อมต่อแล้ว) Code นี้จะทำงาน
    newSocket.on("disconnect", () => {
      console.log("Frontend: User disconnected");
      setConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const toggleTheme = () => {
    if (theme == 0) {
      setTheme(1);
    } else {
      setTheme(0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (socket) {
      // ส่ง message ไปให้ Socket พร้อม 1 ข้อมูลอย่าง input
      socket.emit("message", input);
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 bg-primary text-primary-foreground py-3 px-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Testing</h1>
        <div className="flex gap-4 items-center">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isConnected ? "text-green-500 bg-white" : "text-red-500 bg-white"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
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
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm animate-fadeIn ${
              index % 2 === 0
                ? "self-start bg-card text-card-foreground border border-border"
                : "self-end bg-primary text-primary-foreground"
            }`}
          >
            {msg}
          </li>
        ))}
      </ul>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center p-2 shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
      </form>
    </div>
  );
}
