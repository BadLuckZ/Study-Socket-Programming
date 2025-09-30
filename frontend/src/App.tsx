import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState(1);
  // 0: dark, 1: light

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
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 bg-primary text-primary-foreground py-3 px-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Testing</h1>
        <button
          onClick={() => {
            toggleTheme();
            document.documentElement.classList.toggle("dark");
          }}
          className="cursor-pointer bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm shadow hover:opacity-90 transition"
        >
          {theme == 0 ? <Sun size={16} /> : <Moon size={16} />}
        </button>
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
        />
        <button
          type="submit"
          className="bg-primary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-full shadow-md hover:opacity-90 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
