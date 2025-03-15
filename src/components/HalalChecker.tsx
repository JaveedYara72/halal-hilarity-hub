
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

const HalalChecker = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const systemPrompt = "You are a halal-or-haram expert with an edgy and funny personality. Be direct, sarcastic, and suitable for Gen Alpha teens. Use slang, humor, and memes where appropriate.";
      
      // This is a mock response for now - you'll need to integrate with an actual API
      const mockResponse = "Yo fam! That's totally HALAL! 🔥 Keep it 100 my brother/sister in Islam! *dabs respectfully*";
      
      setTimeout(() => {
        setResponse(mockResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Astagfirullah! 😩",
        description: "Something went wrong! Try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
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

      {response && (
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-purple/30 animate-float">
          <p className="text-white text-lg">{response}</p>
        </div>
      )}
    </div>
  );
};

export default HalalChecker;
