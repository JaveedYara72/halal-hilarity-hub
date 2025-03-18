import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
const HalalChecker = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  // API key
  const apiKey = "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";
  const {
    toast
  } = useToast();

  // Basic fallback responses when API is unavailable
  const fallbackResponses = {
    alcohol: "HARAM! 🚫 Bruh, alcohol is definitely haram in Islam! No cap, that's like Islam 101. Find yourself a halal drink instead! 🧃",
    pork: "HARAM! 🚫 Pork is a big no-no in Islam! Always has been, always will be. Maybe try some chicken or beef instead? 🥩",
    prayer: "HALAL! ✅ Praying is literally one of the five pillars of Islam! Keep those prayers coming, fam! 🕌",
    music: "DEBATED! 🤔 Some scholars say music is haram, others say it's fine if the content is clean. It's complicated, bestie! 🎵",
    default: "I can't check that right now! The halal-meter is offline! Maybe try something simple like 'pork' or 'prayer'? 🤷‍♂️"
  };
  const getFallbackResponse = (query: string) => {
    query = query.toLowerCase();
    if (query.includes('alcohol') || query.includes('beer') || query.includes('wine')) {
      return fallbackResponses.alcohol;
    } else if (query.includes('pork') || query.includes('bacon') || query.includes('ham')) {
      return fallbackResponses.pork;
    } else if (query.includes('pray') || query.includes('prayer') || query.includes('salah') || query.includes('salat')) {
      return fallbackResponses.prayer;
    } else if (query.includes('music') || query.includes('singing') || query.includes('song')) {
      return fallbackResponses.music;
    }
    return fallbackResponses.default;
  };
  const checkHalal = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Bruh moment 💀",
        description: "Type something first fam!",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // If using fallback mode, don't make API call
      if (useFallback) {
        setTimeout(() => {
          setResponse(getFallbackResponse(prompt));
          setLoading(false);
        }, 700); // Slight delay to simulate processing
        return;
      }
      const systemPrompt = "You are a halal-or-haram expert with an edgy and funny personality. Be direct, sarcastic, and suitable for Gen Alpha teens. Use slang, humor, and memes where appropriate. Your task is to determine if something is halal (permissible) or haram (forbidden) in Islam. Respond with a clear verdict (HALAL or HARAM) and a brief, humorous explanation. Use emojis. Keep answers short and teen-friendly.";
      const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: systemPrompt
          }, {
            role: "user",
            content: prompt
          }],
          max_tokens: 500,
          temperature: 0.7
        })
      });
      if (!result.ok) {
        const error = await result.json();

        // Specific handling for quota exceeded error
        if (error.error?.code === "insufficient_quota") {
          throw new Error("API quota exceeded! Try the offline mode instead.");
        }
        throw new Error(error.error?.message || "Failed to get response");
      }
      const data = await result.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong! Check your API key or try again later.";

      // Special message for quota errors
      if (errorMessage.includes("quota exceeded")) {
        toast({
          title: "Astagfirullah! 😩",
          description: "API quota exceeded! Try switching to offline mode below.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Astagfirullah! 😩",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        <Input className="bg-white/10 backdrop-blur-md border-emerald/30 text-white placeholder:text-white/50 h-14 pr-32" placeholder="Is it halal if..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && checkHalal()} />
        <Button className="absolute right-2 top-2 bg-emerald hover:bg-emerald-dark transition-all duration-300" onClick={checkHalal} disabled={loading}>
          {loading ? "Checking..." : <>
              Check <Sparkles className="ml-2 h-4 w-4" />
            </>}
        </Button>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-2">
        
      </div>
      
      {useFallback && <Alert className="mt-4 bg-amber-500/20 border-amber-500/50 text-white">
          <AlertDescription>
            ⚠️ Running in offline mode with limited responses. Only basic halal/haram questions will work.
          </AlertDescription>
        </Alert>}

      {response && <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-purple/30 animate-float">
          <p className="text-white text-lg">{response}</p>
        </div>}
    </div>;
};
export default HalalChecker;