
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Key } from "lucide-react";

const HalalChecker = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  const checkHalal = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Bruh moment 💀",
        description: "Type something first fam!",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "No API Key 🔑",
        description: "Add your OpenAI API key first!",
        variant: "destructive",
      });
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = "You are a halal-or-haram expert with an edgy and funny personality. Be direct, sarcastic, and suitable for Gen Alpha teens. Use slang, humor, and memes where appropriate. Your task is to determine if something is halal (permissible) or haram (forbidden) in Islam. Respond with a clear verdict (HALAL or HARAM) and a brief, humorous explanation. Use emojis. Keep answers short and teen-friendly.";
      
      const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!result.ok) {
        const error = await result.json();
        throw new Error(error.error?.message || "Failed to get response");
      }

      const data = await result.json();
      setResponse(data.choices[0].message.content);
      
      // Save API key to localStorage for future use
      localStorage.setItem("openai_api_key", apiKey);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Astagfirullah! 😩",
        description: error instanceof Error ? error.message : "Something went wrong! Check your API key or try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load API key from localStorage on component mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiInput(true);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {showApiInput && (
        <div className="mb-4 relative">
          <div className="flex items-center mb-2">
            <Key className="h-4 w-4 mr-2 text-emerald" />
            <span className="text-white text-sm">Enter your OpenAI API key:</span>
          </div>
          <Input
            className="bg-white/10 backdrop-blur-md border-emerald/30 text-white placeholder:text-white/50"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="mt-1">
            <span className="text-white/50 text-xs">Your key is stored locally and never sent to our servers</span>
          </div>
          {apiKey && (
            <Button 
              className="mt-2 bg-emerald hover:bg-emerald-dark transition-all duration-300"
              size="sm"
              onClick={() => setShowApiInput(false)}
            >
              Save Key
            </Button>
          )}
        </div>
      )}

      <div className="relative">
        <Input
          className="bg-white/10 backdrop-blur-md border-emerald/30 text-white placeholder:text-white/50 h-14 pr-32"
          placeholder="Is it halal if..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkHalal()}
        />
        <Button
          className="absolute right-2 top-2 bg-emerald hover:bg-emerald-dark transition-all duration-300"
          onClick={checkHalal}
          disabled={loading}
        >
          {loading ? (
            "Checking..."
          ) : (
            <>
              Check <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {!apiKey && !showApiInput && (
        <div className="flex justify-end mt-1">
          <button
            onClick={() => setShowApiInput(true)}
            className="text-emerald underline text-xs hover:text-emerald-dark"
          >
            Change API Key
          </button>
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-purple/30 animate-float">
          <p className="text-white text-lg">{response}</p>
        </div>
      )}
    </div>
  );
};

export default HalalChecker;
