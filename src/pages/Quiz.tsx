import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
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

  const courseNames = {
    'IFT212.2': 'Computer Architecture',
    'IFT235.2': 'Mobile App Performance'
  };

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
        .from('questions')
        .select('*')
        .eq('course_code', courseId)
        .limit(50); // Get more than 30 to randomize

      if (error) throw error;

      // Randomize and select 30 questions
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 30);
      
      setQuestions(selected);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
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
        isCorrect
      };

      const updatedAnswers = [...answers];
      const existingIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id);
      
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
        // Quiz completed
        submitQuiz(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex - 1].id);
      setSelectedAnswer(previousAnswer?.selectedAnswer || "");
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    try {
      const score = finalAnswers.filter(a => a.isCorrect).length;
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      const questionsData = questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        correct_answer: q.correct_answer,
        user_answer: finalAnswers.find(a => a.questionId === q.id)?.selectedAnswer || '',
        is_correct: finalAnswers.find(a => a.questionId === q.id)?.isCorrect || false,
        topic: q.topic,
        difficulty: q.difficulty_level
      }));

      // For demo purposes, we'll navigate to results without saving to DB
      // In a real app with auth, you'd save the attempt here
      navigate('/results', {
        state: {
          score,
          totalQuestions: questions.length,
          timeTaken,
          courseId,
          courseName: courseNames[courseId as keyof typeof courseNames],
          questionsData
        }
      });
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/30">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">No questions available for this course.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Exit
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">
                  {courseNames[courseId as keyof typeof courseNames]}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <Badge variant="secondary" className="font-medium">
                {currentQuestion.topic}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-quiz">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswer === option.key || currentAnswer?.selectedAnswer === option.key
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedAnswer === option.key || currentAnswer?.selectedAnswer === option.key
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30'
                    }`}>
                      <span className="text-sm font-medium">{option.key}</span>
                    </div>
                    <span className="text-foreground">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  {currentQuestion.difficulty_level}
                </Badge>
                Answered: {answers.length} / {questions.length}
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswer && !currentAnswer}
                className="min-w-[120px]"
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