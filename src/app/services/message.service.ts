import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messagesSubject = new BehaviorSubject<Message[]>([]);
    messages$ = this.messagesSubject.asObservable();
    private readonly STORAGE_KEY = 'movenest_messages';

    constructor() {
        this.loadMessages();
    }

    private loadMessages() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const messages = JSON.parse(stored);
                this.messagesSubject.next(messages);
            } catch (e) {
                console.error('Error parsing messages', e);
                this.messagesSubject.next([]);
            }
        }
    }

    getMessages(): Message[] {
        return this.messagesSubject.getValue();
    }

    addMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) {
        const newMessage: Message = {
            ...messageData,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false
        };

        const currentMessages = this.messagesSubject.getValue();
        const updatedMessages = [newMessage, ...currentMessages];

        this.messagesSubject.next(updatedMessages);
        this.saveMessages(updatedMessages);

        return newMessage;
    }

    deleteMessage(id: string) {
        const currentMessages = this.messagesSubject.getValue();
        const updatedMessages = currentMessages.filter(m => m.id !== id);

        this.messagesSubject.next(updatedMessages);
        this.saveMessages(updatedMessages);
    }

    markAsRead(id: string) {
        const currentMessages = this.messagesSubject.getValue();
        const updatedMessages = currentMessages.map(m =>
            m.id === id ? { ...m, read: true } : m
        );

        this.messagesSubject.next(updatedMessages);
        this.saveMessages(updatedMessages);
    }

    private saveMessages(messages: Message[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    }
}
