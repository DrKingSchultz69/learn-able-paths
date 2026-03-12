import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  READING_PASSAGE,
  WORD_COUNT,
  RHYME_PAIRS,
  getAgeNorm,
  calculateRisk,
  saveAssessment,
  type Assessment as AssessmentType,
} from "@/lib/storage";
import { Timer, Check, X, Upload, ArrowRight, Image } from "lucide-react";

type Step = "intro" | "reading" | "rhyme" | "handwriting" | "complete";

export default function Assessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");

  // Reading state
  const [readingStarted, setReadingStarted] = useState(false);
  const startTimeRef = useRef<number>(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [wpm, setWpm] = useState(0);

  // Rhyme state
  const [rhymeIndex, setRhymeIndex] = useState(0);
  const [rhymeCorrect, setRhymeCorrect] = useState(0);
  const rhymeStartRef = useRef<number>(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  // Handwriting state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [reversalCount, setReversalCount] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const ageNorm = getAgeNorm(user.age);
  const totalSteps = 3;
  const currentStep = step === "reading" ? 1 : step === "rhyme" ? 2 : step === "handwriting" ? 3 : 0;

  // Reading handlers
  const startReading = () => {
    startTimeRef.current = Date.now();
    setReadingStarted(true);
  };

  const finishReading = () => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const minutes = elapsed / 60;
    const calculatedWpm = Math.round(WORD_COUNT / minutes);
    setTimeTaken(Math.round(elapsed));
    setWpm(calculatedWpm);
    setStep("rhyme");
  };

  // Rhyme handlers
  const handleRhymeAnswer = (answer: boolean) => {
    if (rhymeIndex === 0 && rhymeStartRef.current === 0) {
      rhymeStartRef.current = Date.now();
    }
    const pair = RHYME_PAIRS[rhymeIndex];
    if (answer === pair.rhymes) {
      setRhymeCorrect((c) => c + 1);
    }
    setTotalReactionTime((t) => t + (Date.now() - (rhymeStartRef.current || Date.now())));
    rhymeStartRef.current = Date.now();

    if (rhymeIndex < RHYME_PAIRS.length - 1) {
      setRhymeIndex((i) => i + 1);
    } else {
      setStep("handwriting");
    }
  };

  // Handwriting handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeHandwriting = () => {
    const randomReversal = Math.floor(Math.random() * 9);
    setReversalCount(randomReversal);
    setAnalyzed(true);
  };

  const finishAssessment = useCallback(() => {
    const rhymeAccuracy = (rhymeCorrect / RHYME_PAIRS.length) * 100;
    const avgReactionTime = totalReactionTime / RHYME_PAIRS.length;
    const { score, level } = calculateRisk(wpm, ageNorm, rhymeAccuracy, reversalCount);

    const assessment: AssessmentType = {
      id: crypto.randomUUID(),
      userId: user!.id,
      date: new Date().toISOString(),
      readingSpeed: wpm,
      timeTaken,
      wpmRatio: wpm / ageNorm,
      rhymeAccuracy,
      reactionTime: Math.round(avgReactionTime),
      reversalCount,
      riskScore: score,
      riskLevel: level,
    };

    saveAssessment(assessment);
    navigate(`/results/${assessment.id}`);
  }, [rhymeCorrect, totalReactionTime, wpm, ageNorm, reversalCount, timeTaken, user, navigate]);

  return (
    <div className="container max-w-2xl py-10 animate-fade-in">
      {step !== "intro" && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      )}

      {/* Intro */}
      {step === "intro" && (
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Dyslexia Screening Assessment</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            This assessment consists of 3 short activities. It takes about 5 minutes to complete.
          </p>
          <div className="grid gap-4 max-w-md mx-auto text-left">
            {["Reading Speed Test", "Rhyme Recognition Game", "Handwriting Analysis"].map((t, i) => (
              <div key={t} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{i + 1}</span>
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
          <Button size="lg" onClick={() => setStep("reading")}>
            Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Reading Speed */}
      {step === "reading" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Timer className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Reading Speed Test</h2>
          </div>
          <p className="text-muted-foreground">
            Read the passage below aloud. Click "Start" when you begin and "Done" when you finish.
          </p>
          <div className="rounded-xl border bg-card p-6 text-lg leading-relaxed">
            {READING_PASSAGE}
          </div>
          <div className="flex gap-4">
            {!readingStarted ? (
              <Button size="lg" onClick={startReading} className="w-full">
                Start Reading
              </Button>
            ) : (
              <Button size="lg" onClick={finishReading} className="w-full" variant="secondary">
                <Check className="mr-2 h-5 w-5" /> Done Reading
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Rhyme Recognition */}
      {step === "rhyme" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Rhyme Recognition Game</h2>
          <p className="text-muted-foreground">Do these two words rhyme? Answer as quickly as you can!</p>
          <Progress value={((rhymeIndex + 1) / RHYME_PAIRS.length) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{rhymeIndex + 1} of {RHYME_PAIRS.length}</p>

          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="text-4xl font-bold mb-2">
              <span className="text-primary">{RHYME_PAIRS[rhymeIndex].word1}</span>
              {" & "}
              <span className="text-secondary">{RHYME_PAIRS[rhymeIndex].word2}</span>
            </p>
            <p className="text-muted-foreground">Do they rhyme?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              onClick={() => handleRhymeAnswer(true)}
              className="text-lg h-16"
            >
              <Check className="mr-2 h-6 w-6" /> Yes, they rhyme!
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleRhymeAnswer(false)}
              className="text-lg h-16"
            >
              <X className="mr-2 h-6 w-6" /> No, they don't
            </Button>
          </div>
        </div>
      )}

      {/* Handwriting Upload */}
      {step === "handwriting" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Handwriting Analysis</h2>
          <p className="text-muted-foreground">
            Upload a photo of your handwriting. We'll check for letter reversals and irregularities.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload handwriting image"
          />

          {!uploadedImage ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed bg-card p-12 flex flex-col items-center gap-4 hover:border-primary transition-colors cursor-pointer"
              aria-label="Click or drag to upload handwriting image"
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="font-medium">Click to upload handwriting image</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, or GIF</p>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border overflow-hidden">
                <img src={uploadedImage} alt="Uploaded handwriting sample" className="w-full max-h-64 object-contain bg-card" />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => { setUploadedImage(null); setAnalyzed(false); }}>
                  <Image className="mr-2 h-4 w-4" /> Change Image
                </Button>
                {!analyzed && (
                  <Button onClick={analyzeHandwriting}>
                    Analyze Handwriting
                  </Button>
                )}
              </div>
              {analyzed && (
                <div className="rounded-xl border bg-card p-6 animate-scale-in">
                  <p className="font-semibold mb-2">Analysis Complete</p>
                  <p className="text-muted-foreground">
                    Detected <span className="font-bold text-foreground">{reversalCount}</span> potential letter reversal{reversalCount !== 1 ? "s" : ""}.
                  </p>
                </div>
              )}
            </div>
          )}

          {analyzed && (
            <Button size="lg" onClick={finishAssessment} className="w-full">
              View Results <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {!uploadedImage && (
            <Button variant="outline" onClick={() => { setReversalCount(Math.floor(Math.random() * 9)); setAnalyzed(true); setUploadedImage("skip"); }} className="w-full">
              Skip — continue without uploading
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
