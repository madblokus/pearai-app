import { PageHeadline } from '@sb/webapp-core/components/pageHeadline';
import { PageLayout } from '@sb/webapp-core/components/pageLayout';
import { Button } from '@sb/webapp-core/components/buttons';
import { Alert, AlertDescription, AlertTitle } from '@sb/webapp-core/components/ui/alert';
import { Paragraph } from '@sb/webapp-core/components/typography';
import { useEffect, useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';

export const Claude = () => {
  const intl = useIntl();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string; is_default: boolean }>>([]);

  // Load available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/claude/models/', {
          headers: {
            'Content-Type': 'application/json',
            // Add your authentication headers here
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch models: ${res.status}`);
        }

        const data = await res.json();
        setAvailableModels(data.available_models || []);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load available models');
      }
    };

    fetchModels();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/claude/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication headers here
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.message || 'No response received');

      // Clear the input
      setMessage('');

    } catch (err) {
      console.error('Error generating response:', err);
      setError('Failed to generate response from Claude');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Helmet
        title={intl.formatMessage({
          defaultMessage: 'Claude AI',
          id: 'Claude / page title',
        })}
      />

      <PageHeadline
        header={<FormattedMessage defaultMessage="Claude AI Integration" id="Claude / header" />}
        subheader={
          <FormattedMessage
            defaultMessage="Interact with Claude AI via our custom API integration."
            id="Claude / subheading"
          />
        }
      />

      {availableModels.length > 0 && (
        <Alert className="mb-6">
          <AlertTitle>Available Models</AlertTitle>
          <AlertDescription>
            {availableModels.map((model) => (
              <div key={model.id}>
                {model.name} {model.is_default && '(Default)'}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Claude something..."
            rows={5}
            disabled={loading}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <Button type="submit" disabled={loading}>
          <FormattedMessage defaultMessage="Generate Response" id="Claude / Generate button" />
        </Button>
      </form>

      {response && (
        <div className="mt-8">
          <Paragraph>Response from Claude:</Paragraph>
          <div className="mt-2 rounded-md bg-muted p-4 whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </PageLayout>
  );
};
