// This is a simplified implementation that will be registered with pearAI
// It avoids direct imports from pearai-submodule to prevent compilation issues

// These types are simplified versions of what's in pearAI
interface ChatMessage {
  role: string;
  content: string | any[];
}

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stop?: string[];
  stream?: boolean;
  model?: string;
}

interface LLMOptions {
  model: string;
  contextLength: number;
  completionOptions: CompletionOptions;
  apiBase?: string;
  apiKey?: string;
}

// This class will be properly registered with pearAI at runtime
export class SaasClaudeAPI {
  static providerName = "saas-claude";
  static defaultOptions: Partial<LLMOptions> = {
    model: "claude-3-7-sonnet-20250219",
    contextLength: 200_000,
    completionOptions: {
      model: "claude-3-7-sonnet-20250219",
      maxTokens: 4096,
    },
    apiBase: "http://localhost:5001/api/claude_api/stream/",
  };

  // These properties will be set by pearAI when instantiating
  apiBase: string = "http://localhost:5001/api/claude_api/stream/";
  apiKey?: string;
  model: string = "claude-3-7-sonnet-20250219";
  systemMessage?: string;

  constructor(options?: Partial<LLMOptions>) {
    if (options) {
      this.apiBase = options.apiBase || this.apiBase;
      this.apiKey = options.apiKey;
      this.model = options.model || this.model;
    }
  }

  // Helper method to convert messages to the format expected by the Django API
  private _convertMessages(msgs: ChatMessage[]): any[] {
    return msgs.filter((m) => m.role !== "system");
  }

  // Method to make fetch requests with proper error handling
  async fetch(url: URL | string, options: RequestInit): Promise<Response> {
    try {
      console.log(`Making request to: ${url.toString()}`);
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}: ${response.statusText}`);
        const errorText = await response.text();
        console.error(`Error details: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error("Error making request to Django API:", error);
      throw error;
    }
  }

  // Stream chat messages from the API
  async *_streamChat(
    messages: ChatMessage[],
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    // Create headers with authentication token if available
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // If apiKey is available, use it as a Bearer token
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      console.log("Using Bearer token authentication");
    } else {
      console.warn("No API key provided, request may fail due to authentication requirements");
    }

    // Log the request being made
    console.log(`Sending request to ${this.apiBase} with ${messages.length} messages`);
    
    const requestBody = {
      messages: this._convertMessages(messages),
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      system: this.systemMessage,
    };
    
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    // Make the request to the Django API endpoint
    const response = await this.fetch(this.apiBase, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    // Process the streaming response
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body returned");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let position;
        while ((position = buffer.indexOf("\n\n")) >= 0) {
          const line = buffer.slice(0, position);
          buffer = buffer.slice(position + 2);
          
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                yield { role: "assistant", content: data.text };
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      throw error;
    }
  }

  // Stream complete text from the API
  async *_streamComplete(
    prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    const messages = [{ role: "user", content: prompt }];
    for await (const update of this._streamChat(messages, options)) {
      yield typeof update.content === "string" 
        ? update.content 
        : JSON.stringify(update.content);
    }
  }
}

export default SaasClaudeAPI; 