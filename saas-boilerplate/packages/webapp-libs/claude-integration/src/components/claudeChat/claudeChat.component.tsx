import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { 
  Container, 
  Header, 
  ChatContainer, 
  MessageList, 
  MessageItem, 
  UserMessage, 
  AssistantMessage,
  InputContainer,
  SendButton,
  TextareaStyled,
  ModelSelector,
  ModelOption,
  LoadingDots
} from './claudeChat.styles';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeChatProps {
  apiEndpoint?: string;
  initialMessages?: Message[];
  temperature?: number;
  maxTokens?: number;
  authToken?: string;
  className?: string;
}

export const ClaudeChat: React.FC<ClaudeChatProps> = ({
  apiEndpoint = '/api/claude_api/generate/',
  initialMessages = [],
  temperature = 0.7,
  maxTokens = 1000,
  authToken,
  className,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-7-sonnet-20250219');
  const [availableModels, setAvailableModels] = useState([
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
    { id: 'claude-3-7-haiku-20250211', name: 'Claude 3.7 Haiku' },
    { id: 'claude-3-7-opus-20250211', name: 'Claude 3.7 Opus' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch('/api/claude_api/models/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      if (data.available_models) {
        setAvailableModels(data.available_models);
        // Set the default model to the one marked as default
        const defaultModel = data.available_models.find((model: any) => model.is_default);
        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        }
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || loading) return;

    const newUserMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude');
      }

      const data = await response.json();
      
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      // Add an error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  return (
    <Container className={className}>
      <Header>
        <h2>
          <FormattedMessage 
            defaultMessage="Chat with Claude 3.7" 
            id="ClaudeChat.header" 
          />
        </h2>
        <ModelSelector value={selectedModel} onChange={handleModelChange}>
          {availableModels.map(model => (
            <ModelOption key={model.id} value={model.id}>
              {model.name}
            </ModelOption>
          ))}
        </ModelSelector>
      </Header>
      
      <ChatContainer>
        <MessageList>
          {messages.map((message, index) => (
            <MessageItem key={index}>
              {message.role === 'user' ? (
                <UserMessage>{message.content}</UserMessage>
              ) : (
                <AssistantMessage>{message.content}</AssistantMessage>
              )}
            </MessageItem>
          ))}
          {loading && (
            <MessageItem>
              <AssistantMessage>
                <LoadingDots>
                  <span>.</span><span>.</span><span>.</span>
                </LoadingDots>
              </AssistantMessage>
            </MessageItem>
          )}
          <div ref={messagesEndRef} />
        </MessageList>
      </ChatContainer>
      
      <InputContainer>
        <TextareaStyled
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={3}
          disabled={loading}
        />
        <SendButton onClick={handleSendMessage} disabled={inputValue.trim() === '' || loading}>
          <FormattedMessage 
            defaultMessage="Send" 
            id="ClaudeChat.sendButton" 
          />
        </SendButton>
      </InputContainer>
    </Container>
  );
}; 