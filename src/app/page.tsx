"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
  time: string;
};

const STORAGE_KEY = "ai-gym-trainer:chat-history";
const MAX_STORED_MESSAGES = 100;

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Message =>
        typeof item === "object" &&
        item !== null &&
        "role" in item &&
        "content" in item &&
        "time" in item &&
        ((item as Message).role === "user" ||
          (item as Message).role === "bot") &&
        typeof (item as Message).content === "string" &&
        typeof (item as Message).time === "string"
    );
  } catch {
    return [];
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
    );
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data: { reply?: unknown; error?: unknown } = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            typeof data.reply === "string"
              ? data.reply
              : "⚠️ The AI returned an invalid response.",
          time: formatTime(),
        },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Unable to reach the AI service. Please try again.",
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 bg-opacity-90 p-6"
      style={{
        backgroundImage: "url('/jack2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <h1 className="mb-6 text-4xl font-extrabold text-white drop-shadow-lg">
          💪 AI Gym Trainer
        </h1>

        <div
          className="flex h-[60vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.length === 0 && (
            <p className="m-auto text-center text-gray-500">
              Ask for a workout, exercise ideas, or fitness guidance.
            </p>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.time}-${index}`}
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
              <p className="mt-1 text-right text-xs opacity-70">
                {message.time}
              </p>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500 italic" role="status">
              🤖 Thinking...
            </p>
          )}
        </div>

        <div className="mt-4 flex w-full max-w-lg">
          <input
            type="text"
            placeholder="Ask your AI fitness trainer..."
            value={input}
            maxLength={1000}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void sendMessage();
            }}
            aria-label="Fitness question"
            className="flex-1 rounded-l-xl border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="rounded-r-xl bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
