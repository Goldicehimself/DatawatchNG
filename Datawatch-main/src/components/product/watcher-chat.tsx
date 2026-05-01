"use client";

import { Bot, Mic, Send, Volume2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { getChatHistory, sendAssistantMessage } from "@/lib/api";
import { useAppStore, type ChatMessage } from "@/lib/app-store";

export function WatcherChat() {
  const queryClient = useQueryClient();
  const token = useAppStore((state) => state.token);
  const pidginResponses = useAppStore((state) => state.pidginResponses);
  const storedMessages = useAppStore((state) => state.watcherMessages);
  const addWatcherMessages = useAppStore((state) => state.addWatcherMessages);
  const resetWatcher = useAppStore((state) => state.resetWatcher);
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);

  const chatQuery = useQuery({
    queryKey: ["watcher-chat"],
    queryFn: getChatHistory,
    enabled: Boolean(token),
  });

  const messages: ChatMessage[] =
    chatQuery.data?.map((message) => ({
      role: message.role,
      text: message.content,
    })) || storedMessages;
  const loadingChat = Boolean(token) && chatQuery.isLoading;

  const sendMutation = useMutation({
    mutationFn: (message: string) =>
      sendAssistantMessage(message, pidginResponses ? "pidgin" : "english"),
    onSuccess: (backendMessages) => {
      addWatcherMessages(
        backendMessages.map((message) => ({
          role: message.role,
          text: message.content,
        })),
      );
      void queryClient.invalidateQueries({ queryKey: ["watcher-chat"] });
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  useEffect(() => {
    if (chatQuery.data?.length) {
      resetWatcher();
    }
  }, [chatQuery.data?.length, resetWatcher]);

  function send() {
    const message = input.trim();

    if (!message || sendMutation.isPending) {
      return;
    }

    if (!token) {
      addWatcherMessages([
        { role: "user", text: message },
        {
          role: "assistant",
          text: "Start demo mode or verify your phone so I can read your backend usage context.",
        },
      ]);
      setInput("");
      return;
    }

    sendMutation.mutate(message);
    setInput("");
  }

  return (
    <AppShell>
      <p className="text-sm font-semibold text-[#008751]">Ask Watcher</p>
      <h1 className="mt-2 text-3xl font-semibold">
        AI help in simple language
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
        Watcher explains usage, subscriptions, fraud alerts, and data-saving
        actions using backend context.
      </p>

      {!token ? (
        <ProductCard className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            Connect a backend session to unlock real demo context.
          </p>
          <ButtonLink href="/demo" className="shrink-0">
            Start demo
          </ButtonLink>
        </ProductCard>
      ) : null}

      <ProductCard className="mt-6 flex min-h-[620px] flex-col p-0">
        <div className="flex items-center justify-between border-b border-black/[0.06] p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#008751] text-white">
              <Bot size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-semibold">Watcher</h2>
              <p className="text-xs text-[#6B7280]">
                English and Pidgin support
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="h-10 px-3"
            onClick={() => setVoiceMode((value) => !value)}
          >
            {voiceMode ? (
              <Volume2 size={16} strokeWidth={1.5} />
            ) : (
              <Mic size={16} strokeWidth={1.5} />
            )}
            Voice
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {loadingChat ? (
            <>
              <div className="max-w-[86%] rounded-[20px] bg-black/[0.04] p-4">
                <TextSkeleton className="w-56" />
                <TextSkeleton className="mt-3 w-40" />
              </div>
              <div className="ml-auto max-w-[76%] rounded-[20px] bg-[#008751]/15 p-4">
                <TextSkeleton className="ml-auto w-44" />
              </div>
              <div className="max-w-[86%] rounded-[20px] bg-black/[0.04] p-4">
                <TextSkeleton className="w-52" />
                <TextSkeleton className="mt-3 w-48" />
              </div>
            </>
          ) : messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[86%] rounded-[20px] p-4 text-sm leading-6 ${
                message.role === "assistant"
                  ? "bg-black/[0.04] text-[#0A0A0A]"
                  : "ml-auto bg-[#008751] text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
          {sendMutation.isPending ? (
            <div className="max-w-[86%] rounded-[20px] bg-black/[0.04] p-4 text-sm text-[#6B7280]">
              Watcher is checking your data...
            </div>
          ) : null}
          {voiceMode ? (
            <div className="rounded-[20px] border border-dashed border-[#008751]/40 bg-[#008751]/5 p-4 text-sm text-[#005C35]">
              Voice note mode is ready for speech-to-text integration.
            </div>
          ) : null}
        </div>

        <div className="border-t border-black/[0.06] p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  send();
                }
              }}
              className="h-12 min-w-0 flex-1 rounded-[14px] border border-black/10 px-4 text-sm"
              placeholder="Ask about usage, charges, or savings"
            />
            <Button className="h-12 w-12 px-0" onClick={send} aria-label="Send">
              {sendMutation.isPending ? (
                <Skeleton className="h-4 w-4 rounded-full bg-white/40" />
              ) : (
                <Send size={18} strokeWidth={1.5} />
              )}
            </Button>
          </div>
          {messages.length > 1 ? (
            <button
              type="button"
              onClick={resetWatcher}
              className="mt-3 text-xs font-semibold text-[#6B7280]"
            >
              Reset local conversation
            </button>
          ) : null}
        </div>
      </ProductCard>
    </AppShell>
  );
}
