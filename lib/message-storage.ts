// Shared in-memory message storage
// In production, replace this with a database

interface Message {
  id: string
  soldierId: string
  soldierName: string
  telegramUsername: string
  telegramChatId?: number
  message: string
  timestamp: string
  read: boolean
  reply?: string
  replyTimestamp?: string
}

class MessageStorage {
  private messages: Message[] = []

  getAll(): Message[] {
    return this.messages
  }

  add(message: Message): void {
    this.messages.unshift(message)
    console.log("[v0] Message stored. Total messages:", this.messages.length)
  }

  markAsRead(messageId: string): void {
    const message = this.messages.find((m) => m.id === messageId)
    if (message) {
      message.read = true
      console.log("[v0] Message marked as read:", messageId)
    }
  }

  updateReply(messageId: string, reply: string, replyTimestamp: string): void {
    const message = this.messages.find((m) => m.id === messageId)
    if (message) {
      message.reply = reply
      message.replyTimestamp = replyTimestamp
      console.log("[v0] Reply added to message:", messageId)
    }
  }

  getById(messageId: string): Message | undefined {
    return this.messages.find((m) => m.id === messageId)
  }
}

// Export a singleton instance
export const messageStorage = new MessageStorage()
