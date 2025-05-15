import React from 'react';
import ConversationInterface from './components/ConversationInterface';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Chat</h1>
          <p className="text-gray-600">Start a conversation with your AI assistant</p>
        </header>
        <ConversationInterface />
      </div>
    </div>
  );
}

export default App;