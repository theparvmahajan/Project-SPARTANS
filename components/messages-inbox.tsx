"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, Clock, CheckCheck, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  soldierId: string
  soldierName: string
  telegramUsername: string
  message: string
  timestamp: string
  read: boolean
  reply?: string
  replyTimestamp?: string
}

interface MessagesInboxProps {
  soldiers: Array<{ id: string; name: string }>
}

export function MessagesInbox({ soldiers }: MessagesInboxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch("/api/telegram/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages.sort((a: Message, b: Message) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ))
      }
    } catch (error) {
      console.error("[v0] Failed to load messages:", error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/telegram/messages/${messageId}/read`, {
        method: "POST",
      })
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
      setMessages(updatedMessages)
    } catch (error) {
      console.error("[v0] Failed to mark as read:", error)
    }
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      markAsRead(message.id)
    }
    setReplyText("")
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    setIsSending(true)
    try {
      const response = await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: replyText.trim(),
        }),
      })

      if (response.ok) {
        const updatedMessages = messages.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, reply: replyText.trim(), replyTimestamp: new Date().toISOString() }
            : msg
        )
        setMessages(updatedMessages)
        setSelectedMessage({
          ...selectedMessage,
          reply: replyText.trim(),
          replyTimestamp: new Date().toISOString(),
        })
        setReplyText("")
      }
    } catch (error) {
      console.error("Failed to send reply:", error)
    } finally {
      setIsSending(false)
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-card/50 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-accent">MESSAGES INBOX</h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {unreadCount} New
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-border">
        {/* Messages list */}
        <div className="h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <MessageSquare className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground">
                Messages from soldiers will appear here
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors ${
                  selectedMessage?.id === message.id ? "bg-accent/10" : ""
                } ${!message.read ? "bg-accent/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold text-sm">{message.soldierName}</p>
                    {!message.read && (
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">@{message.telegramUsername}</p>
                <p className="text-sm line-clamp-2 text-foreground/80">{message.message}</p>
                {message.reply && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-accent">
                    <CheckCheck className="w-3 h-3" />
                    Replied
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Message detail and reply */}
        <div className="h-[500px] flex flex-col">
          {selectedMessage ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Original message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{selectedMessage.soldierName}</p>
                        <p className="text-xs text-muted-foreground">
                          @{selectedMessage.telegramUsername}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <p className="text-sm leading-relaxed">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Reply if exists */}
                {selectedMessage.reply && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">YOUR REPLY</p>
                      <span className="text-xs text-muted-foreground">
                        {selectedMessage.replyTimestamp &&
                          new Date(selectedMessage.replyTimestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-muted border border-border rounded-lg p-3">
                      <p className="text-sm leading-relaxed">{selectedMessage.reply}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="border-t border-border p-4 space-y-3">
                <Textarea
                  placeholder="Type your response to the soldier..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="resize-none min-h-[80px] bg-secondary"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply to {selectedMessage.soldierName}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <MessageSquare className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Select a message to view and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
