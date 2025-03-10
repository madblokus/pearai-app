import * as vscode from 'vscode';
import SaasClaudeAPI from './SaasClaudeAPI';
import { loadConfig } from './config';

export function activate(context: vscode.ExtensionContext) {
  console.log('Claude Django Bridge extension has been activated');
  
  // Load configuration
  const config = loadConfig(context);
  
  // Create a disposable command to register the SaasClaudeAPI provider
  const disposable = vscode.commands.registerCommand('claude-django-bridge.register', () => {
    vscode.window.showInformationMessage('Registering SaasClaudeAPI provider with pearAI');
    
    try {
      // Get the pearAI API from the global namespace
      const pearaiApi = (global as any).pearai;
      
      if (pearaiApi && pearaiApi.registerLLMProvider) {
        // Check if we have an API key
        if (!config.apiKey || config.apiKey === 'your_api_token_here') {
          vscode.window.showErrorMessage(
            'No valid API key found in .env file. Please add your API key to SAAS_CLAUDE_API_KEY in the .env file.'
          );
          console.error('No valid API key provided');
          return;
        }
        
        // Update the default options with our configuration
        SaasClaudeAPI.defaultOptions = {
          ...SaasClaudeAPI.defaultOptions,
          apiBase: config.apiUrl,
          apiKey: config.apiKey,
        };
        
        // Register our SaasClaudeAPI provider
        pearaiApi.registerLLMProvider(SaasClaudeAPI);
        vscode.window.showInformationMessage(
          `SaasClaudeAPI provider registered successfully. Using endpoint: ${config.apiUrl}`
        );
        console.log(`SaasClaudeAPI registered with endpoint: ${config.apiUrl}`);
      } else {
        vscode.window.showErrorMessage('pearAI API not found or registerLLMProvider method not available');
        console.error('pearAI API not found or registerLLMProvider method not available');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to register SaasClaudeAPI provider: ${error}`);
      console.error('Failed to register SaasClaudeAPI provider:', error);
    }
  });
  
  // Add the command to the context subscriptions
  context.subscriptions.push(disposable);
  
  // Try to register the provider automatically on activation
  vscode.commands.executeCommand('claude-django-bridge.register');
}

export function deactivate() {
  console.log('Claude Django Bridge extension has been deactivated');
} 