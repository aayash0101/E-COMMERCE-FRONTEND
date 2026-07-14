import { useEffect, useRef, useState, type FormEvent } from "react";
import { supportApi, type SupportMessage } from "@/api/support";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

const SupportPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const data = await supportApi.getMyConversation();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages().finally(() => setIsLoading(false));
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSending(true);
    try {
      const updated = await supportApi.sendMyMessage(input.trim());
      setMessages(updated);
      setInput("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Contact Support
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Have a question or an issue with an order? Send us a message and
        we'll get back to you here.
      </p>

      <div className="mt-6 flex h-[500px] flex-col rounded-2xl border border-gray-100 bg-gray-50/50">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : messages.length === 0 ? (
            <p className="mt-12 text-center text-sm text-gray-500">
              No messages yet — send one below to get started.
            </p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderRole === "customer";
              const isSystem = msg.senderRole === "system";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine
                        ? "bg-ink text-white"
                        : isSystem
                          ? "bg-gray-100 text-gray-500 italic"
                          : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    {!isMine && !isSystem && (
                      <p className="mb-0.5 text-[11px] font-semibold text-primary-600">
                        Support Team
                      </p>
                    )}
                    <p>{msg.message}</p>
                    <p
                      className={`mt-1 text-[10px] ${isMine ? "text-gray-300" : "text-gray-400"}`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              user ? "Type your message…" : "Please log in to contact support"
            }
            disabled={!user}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
          <Button type="submit" isLoading={isSending} disabled={!user || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;