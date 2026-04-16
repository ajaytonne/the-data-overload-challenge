import { useState } from "react";
import { analyzeText, NLPResults } from "@/src/lib/gemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Tags, 
  Users, 
  Globe, 
  Loader2, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NLPResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans p-6 md:p-12 selection:bg-accent selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
        {/* Header */}
        <header className="flex items-center justify-between border-b-2 border-ink pb-4 mb-12">
          <div className="text-[12px] uppercase tracking-[2px] font-bold">
            Natural Language Processing
          </div>
          <div className="font-serif italic text-lg">
            Project No. 01
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-16 flex-grow">
          {/* Left Column: Info & Input */}
          <div className="flex flex-col justify-between space-y-12">
            <div>
              <h1 className="editorial-heading">
                Simple<br />Text<br />Logic.
              </h1>
              <p className="text-lg leading-relaxed opacity-80 max-w-sm">
                A lightweight sentiment analyzer designed for rapid prototyping and deep linguistic insights.
              </p>
              
              <ul className="mt-12 space-y-6">
                {[
                  { num: "01", text: "Input your raw text data" },
                  { num: "02", text: "Run polarity & entity analysis" },
                  { num: "03", text: "Extract structured insights" }
                ].map((step) => (
                  <li key={step.num} className="flex items-center gap-4 group">
                    <span className="font-serif italic text-2xl text-accent group-hover:scale-110 transition-transform">
                      {step.num}
                    </span>
                    <span className="text-sm font-medium tracking-tight">
                      {step.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input Card */}
            <div className="editorial-card relative">
              <div className="absolute -top-3 right-4 bg-bg px-2 text-[10px] uppercase tracking-widest font-bold opacity-50">
                Input Buffer
              </div>
              <Textarea 
                placeholder="Enter text to analyze..." 
                className="min-h-[150px] border-none focus-visible:ring-0 p-0 text-base leading-relaxed bg-transparent resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">
                  {text.length} Characters
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || text.length < 10}
                  className="bg-ink hover:bg-accent text-white rounded-none px-6 transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
                </Button>
              </div>
              {error && (
                <div className="mt-2 text-accent text-[10px] uppercase font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <Skeleton className="h-24 rounded-none bg-slate-200" />
                    <Skeleton className="h-24 rounded-none bg-slate-200" />
                  </div>
                  <Skeleton className="h-[400px] rounded-none bg-slate-200" />
                </div>
              ) : results ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  {/* Results Header Card */}
                  <div className="editorial-card">
                    <div className="editorial-label text-accent mb-4">Analysis Result</div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="editorial-value">{results.sentiment.score.toFixed(2)}</div>
                        <div className="editorial-label">Polarity Score</div>
                      </div>
                      <div>
                        <div className="editorial-value">{results.sentiment.label}</div>
                        <div className="editorial-label">Classification</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Tabs */}
                  <div className="editorial-card p-0 overflow-hidden">
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="w-full justify-start h-12 bg-ink rounded-none p-0">
                        {["summary", "keywords", "entities"].map((tab) => (
                          <TabsTrigger 
                            key={tab}
                            value={tab} 
                            className="h-full px-8 rounded-none text-white/50 data-[state=active]:bg-accent data-[state=active]:text-white uppercase text-[10px] tracking-[2px] font-bold"
                          >
                            {tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <div className="p-8">
                        <TabsContent value="summary" className="mt-0 space-y-6">
                          <p className="font-serif italic text-2xl leading-snug text-ink/90">
                            "{results.summary}"
                          </p>
                          <div className="pt-6 border-t border-slate-100">
                            <div className="editorial-label mb-2">Contextual Logic</div>
                            <p className="text-sm leading-relaxed opacity-70">{results.sentiment.explanation}</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="keywords" className="mt-0">
                          <div className="flex flex-wrap gap-4">
                            {results.keywords.map((keyword) => (
                              <div key={keyword} className="flex items-center gap-2 border-b border-ink/20 pb-1">
                                <span className="text-accent font-serif italic">#</span>
                                <span className="text-sm font-bold uppercase tracking-wider">{keyword}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="entities" className="mt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                            {results.entities.map((entity, i) => (
                              <div key={i} className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="font-bold text-sm uppercase tracking-tight">{entity.name}</span>
                                <span className="editorial-label !opacity-30">{entity.type}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>

                  <div className="text-right">
                    <p className="font-serif italic text-2xl max-w-sm ml-auto opacity-60 leading-tight">
                      "The art of coding is making the complex feel effortless."
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-ink/10 py-20">
                  <Sparkles className="w-12 h-12 text-ink/10 mb-4" />
                  <p className="editorial-label">Awaiting Input Data</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto pt-12 flex justify-between items-center text-[10px] uppercase tracking-[2px] font-bold opacity-40">
          <div>Run with Gemini 3.0 Flash</div>
          <div>Open in Visual Studio Code</div>
        </footer>
      </div>
    </div>
  );
}
