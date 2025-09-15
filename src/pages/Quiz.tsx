import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  topic: string;
  difficulty_level: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

const Quiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (courseId) {
      fetchQuestions();
    }
  }, [courseId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("course_code", courseId)
        .limit(50);

      if (error) throw error;

      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 30);
      setQuestions(selected);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
      };

      const updatedAnswers = [...answers];
      const existingIndex = updatedAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingIndex >= 0) {
        updatedAnswers[existingIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }

      setAnswers(updatedAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer("");
      } else {
        submitQuiz(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestionIndex - 1].id
      );
      setSelectedAnswer(previousAnswer?.selectedAnswer || "");
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    try {
      const score = finalAnswers.filter((a) => a.isCorrect).length;
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const questionsData = questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d,
        },
        correct_answer: q.correct_answer,
        user_answer:
          finalAnswers.find((a) => a.questionId === q.id)?.selectedAnswer || "",
        is_correct:
          finalAnswers.find((a) => a.questionId === q.id)?.isCorrect || false,
        topic: q.topic,
        difficulty: q.difficulty_level,
      }));

      navigate("/results", {
        state: {
          score,
          totalQuestions: questions.length,
          timeTaken,
          courseId,
          courseName: courseNames[courseId as keyof typeof courseNames],
          questionsData,
        },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-academic transition-all duration-300 ${isDark ? "dark" : ""}`}>
        <Card className="w-full max-w-md border-border animate-accordion-down">
          <CardContent className="flex items-center justify-center p-6 sm:p-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground text-sm">Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-academic transition-all duration-300 ${isDark ? "dark" : ""}`}>
        <Card className="w-full max-w-md border-border animate-accordion-down">
          <CardContent className="text-center p-6 sm:p-8">
            <p className="text-muted-foreground text-sm">
              No questions available for this course.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-gradient-primary text-primary-foreground hover:bg-primary/90 hover:animate-button-pulse"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className={`min-h-screen bg-gradient-academic transition-all duration-300 ${isDark ? "dark" : ""}`}>
      {/* Header */}
      <header className="border-b bg-card/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                aria-label="Exit quiz"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Exit
              </Button>
              <div>
                <h1 className="font-semibold text-foreground text-base sm:text-lg">
                  {courseNames[courseId as keyof typeof courseNames]}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono" aria-live="polite">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="font-medium bg-secondary text-secondary-foreground"
              >
                {currentQuestion.topic}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-checked={isDark}
                className="hover:bg-accent/50 hover:animate-button-pulse transition-all duration-300"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <Progress
              value={progress}
              className="h-2 bg-muted [&>div]:bg-gradient-primary"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 sm:px-6 sm:py-8 animate-fade-in">
        <Card
          className="w-full max-w-full sm:max-w-3xl mx-auto border-border shadow-quiz animate-accordion-down"
          role="region"
          aria-labelledby={`question-${currentQuestion.id}`}
        >
          <CardHeader>
            <CardTitle
              id={`question-${currentQuestion.id}`}
              className="text-lg sm:text-xl text-foreground leading-relaxed"
            >
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-2">
              {[
                { key: "A", text: currentQuestion.option_a },
                { key: "B", text: currentQuestion.option_b },
                { key: "C", text: currentQuestion.option_c },
                { key: "D", text: currentQuestion.option_d },
              ].map((option, index) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full p-3 sm:p-4 text-left rounded-md border transition-all duration-300 animate-accordion-down ${
                    selectedAnswer === option.key ||
                    currentAnswer?.selectedAnswer === option.key
                      ? "border-primary bg-primary/10 shadow-academic"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-checked={
                    selectedAnswer === option.key ||
                    currentAnswer?.selectedAnswer === option.key
                  }
                  role="radio"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div
                      className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedAnswer === option.key ||
                        currentAnswer?.selectedAnswer === option.key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-sm font-medium">{option.key}</span>
                    </div>
                    <span className="text-foreground text-sm sm:text-base">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto border-border hover:bg-accent/50 hover:animate-button-pulse"
                aria-label="Previous question"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="outline" className="mr-2 border-border">
                  {currentQuestion.difficulty_level}
                </Badge>
                Answered: {answers.length} / {questions.length}
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswer && !currentAnswer}
                className="w-full sm:w-auto bg-gradient-primary text-primary-foreground hover:bg-primary/90 hover:animate-button-pulse min-w-[120px]"
                aria-label={
                  currentQuestionIndex === questions.length - 1
                    ? "Submit quiz"
                    : "Next question"
                }
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    Submit
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Quiz;