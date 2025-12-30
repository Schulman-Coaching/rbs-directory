'use client'

import { useState } from 'react'
import { Search, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn, getInitials } from '@/lib/utils'

// Mock conversations
const mockConversations = [
  {
    id: '1',
    name: 'שרה כהן',
    lastMessage: 'האם יש מקום בשיעור של יום ראשון?',
    time: 'לפני 5 דקות',
    unread: 2,
    listing: 'קורס אופני הרים לילדים',
  },
  {
    id: '2',
    name: 'דוד לוי',
    lastMessage: 'תודה רבה! נתראה בשיעור',
    time: 'לפני שעה',
    unread: 0,
    listing: 'סיור אופניים משפחתי',
  },
  {
    id: '3',
    name: 'רחל ישראלי',
    lastMessage: 'מה הגילאים המתאימים לקורס?',
    time: 'אתמול',
    unread: 1,
    listing: 'קורס אופני הרים לילדים',
  },
  {
    id: '4',
    name: 'משה גולדברג',
    lastMessage: 'האם אפשר לשלם במזומן?',
    time: '2 ימים',
    unread: 0,
    listing: 'שיעור פרטי',
  },
]

const mockMessages = [
  { id: '1', sender: 'other', content: 'שלום, ראיתי את החוג שלכם באתר', time: '10:30' },
  { id: '2', sender: 'me', content: 'שלום! כן, נשמח לעזור. במה אוכל לסייע?', time: '10:32' },
  { id: '3', sender: 'other', content: 'רציתי לשאול האם יש מקום בשיעור של יום ראשון?', time: '10:33' },
  { id: '4', sender: 'other', content: 'הבן שלי בן 9', time: '10:33' },
  { id: '5', sender: 'me', content: 'כן! יש לנו עדיין מקומות פנויים בשיעור של יום ראשון ב-16:00', time: '10:35' },
  { id: '6', sender: 'other', content: 'מעולה! איך נרשמים?', time: '10:36' },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.includes(search) || conv.listing.includes(search)
  )

  const handleSend = () => {
    if (!newMessage.trim()) return
    // In real app, send message
    setNewMessage('')
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-l flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">הודעות</h1>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש שיחה..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={cn(
                'w-full p-4 text-right hover:bg-muted transition-colors border-b',
                selectedConversation.id === conv.id && 'bg-muted'
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(conv.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{conv.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conv.listing}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="h-5 min-w-5">{conv.unread}</Badge>
                )}
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area - Hidden on mobile when no conversation selected */}
      <div className="hidden md:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{selectedConversation.name}</div>
              <div className="text-sm text-muted-foreground">{selectedConversation.listing}</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.sender === 'me' ? 'justify-start' : 'justify-end'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2',
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="flex gap-2"
          >
            <Input
              placeholder="כתוב הודעה..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
