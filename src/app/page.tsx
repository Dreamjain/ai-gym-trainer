"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: string; content: string; time: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

   // 🧠 Load previous chat from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 💾 Save chat history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // ⏰ Format time nicely
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 🚀 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, time: formatTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data.reply || "⚠️ Something went wrong.",
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Error connecting to the AI. Please try again.",
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900 bg-opacity-90 relative"
      style={{
        backgroundImage: "url('/jack2.png')", // 🖼 your image from /public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🔲 Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
          💪 AI Gym Trainer
        </h1>

        {/* 💬 Chat window */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 space-y-3 overflow-y-auto h-[60vh]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
              <p className="text-xs mt-1 opacity-70 text-right">{m.time}</p>
            </div>
          ))}
          {loading && <p className="text-gray-500 italic">🤖 Typing...</p>}
        </div>

        {/* ✍️ Input box */}
        <div className="flex w-full max-w-lg mt-4">
          <input
            type="text"
            placeholder="supp jack-ass, seems u finally leave the bed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-l-xl border border-gray-400 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 rounded-r-xl font-semibold"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
