import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  supportApi,
  type ConversationSummary,
  type SupportMessage,
} from "@/api/support";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

const QUICK_REPLIES = [
  "Thanks for your patience, we're looking into this now.",
  "Could you share your order number so we can look into it?",
  "This has been resolved - let us know if anything else comes up!",
  "We've forwarded this to the relevant vendor and will follow up soon.",
];

const AdminSupportPage = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    const data = await supportApi.getConversations();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations().finally(() => setIsLoadingList(false));
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadThread = async (customerId: string) => {
    const data = await supportApi.getConversationById(customerId);
    setMessages(data);
  };

  useEffect(() => {
    if (!selectedCustomerId) return;
    setIsLoadingThread(true);
    loadThread(selectedCustomerId).finally(() => setIsLoadingThread(false));
    const interval = setInterval(() => loadThread(selectedCustomerId), 5000);
    return () => clearInterval(interval);
  }, [selectedCustomerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setConversations((prev) =>
      prev.map((c) =>
        c.customerId === customerId ? { ...c, unreadByAdminCount: 0 } : c
      )
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedCustomerId) return;

    setIsSending(true);
    try {
      const updated = await supportApi.sendAdminMessage(selectedCustomerId, input.trim());
      setMessages(updated);
      setInput("");
      loadConversations();
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.customerId === selectedCustomerId
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation list */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-100">
        <div className="border-b border-gray-100 p-4">
          <h1 className="font-display text-lg font-bold tracking-tight text-ink">
            Support Inbox
          </h1>
        </div>

        {isLoadingList ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            No conversations yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <button
                key={conv.customerId}
                onClick={() => handleSelect(conv.customerId)}
                className={`w-full px-4 py-3 text-left transition hover:bg-gray-50 ${
                  selectedCustomerId === conv.customerId ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {conv.customerName}
                  </p>
                  {conv.unreadByAdminCount > 0 && (
                    <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-semibold text-white">
                      {conv.unreadByAdminCount}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {conv.lastSenderRole === "admin" ? "You: " : ""}
                  {conv.lastMessage}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Thread */}
      <div className="flex flex-1 flex-col">
        {!selectedCustomerId ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Select a conversation to view messages.
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-900">
                {selectedConversation?.customerName}
              </p>
              <p className="text-xs text-gray-500">
                {selectedConversation?.customerEmail}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {isLoadingThread ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderRole === "admin";
                  const isSystem = msg.senderRole === "system";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                          isAdmin
                            ? "bg-ink text-white"
                            : isSystem
                              ? "bg-gray-100 text-gray-500 italic"
                              : "bg-gray-50 text-gray-800"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`mt-1 text-[10px] ${isAdmin ? "text-gray-300" : "text-gray-400"}`}
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

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 pt-3">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setInput(reply)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-100"
                >
                  {reply.length > 40 ? `${reply.slice(0, 40)}…` : reply}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-4"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reply…"
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
              <Button type="submit" isLoading={isSending} disabled={!input.trim()}>
                Send
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;