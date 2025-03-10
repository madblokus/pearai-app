import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export interface Config {
  apiUrl: string;
  apiKey?: string;
}

export function loadConfig(context: vscode.ExtensionContext): Config {
  const config: Config = {
    apiUrl: 'http://localhost:5001/api/claude/stream/',
  };
  
  try {
    // Try to read the .env file
    const envPath = path.join(context.extensionPath, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        // Skip comments and empty lines
        if (line.startsWith('#') || !line.trim()) {
          continue;
        }
        
        const [key, value] = line.split('=');
        if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          
          if (trimmedKey === 'SAAS_CLAUDE_API_URL') {
            config.apiUrl = trimmedValue;
          } else if (trimmedKey === 'SAAS_CLAUDE_API_KEY') {
            config.apiKey = trimmedValue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  return config;
} 