import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  RotateCcw, 
  Home, 
  CheckCircle, 
  XCircle,
  Target,
  TrendingUp 
} from "lucide-react";

interface QuestionData {
  id: string;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  user_answer: string;
  is_correct: boolean;
  topic: string;
  difficulty: string;
}

interface ResultsState {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  courseId: string;
  courseName: string;
  questionsData: QuestionData[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/30">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground mb-4">No results data available.</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { score, totalQuestions, timeTaken, courseId, courseName, questionsData } = state;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent performance! 🌟";
    if (percentage >= 80) return "Great work! 🎉";
    if (percentage >= 70) return "Good job! 👍";
    if (percentage >= 60) return "Keep practicing! 📚";
    return "More study needed. 💪";
  };

  const topicPerformance = questionsData.reduce((acc, question) => {
    if (!acc[question.topic]) {
      acc[question.topic] = { correct: 0, total: 0 };
    }
    acc[question.topic].total++;
    if (question.is_correct) {
      acc[question.topic].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quiz Results</h1>
              <p className="text-muted-foreground">{courseName}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to={`/quiz/${courseId}`}>
                <Button size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Score Overview */}
          <Card className="shadow-result">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold">
                <span className={getScoreColor(percentage)}>
                  {score} / {totalQuestions}
                </span>
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                {percentage}% Score
              </p>
              <p className="text-muted-foreground">
                {getPerformanceMessage(percentage)}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{percentage}%</div>
                  <Progress value={percentage} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">Time Taken</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{formatTime(timeTaken)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ~{Math.round(timeTaken / totalQuestions)}s per question
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span className="font-semibold">Questions</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {score} correct, {totalQuestions - score} incorrect
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Topic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(topicPerformance).map(([topic, performance]) => {
                  const topicPercentage = Math.round((performance.correct / performance.total) * 100);
                  return (
                    <div key={topic} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{topic}</div>
                        <div className="text-sm text-muted-foreground">
                          {performance.correct} / {performance.total} correct
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(topicPercentage)}`}>
                          {topicPercentage}%
                        </div>
                        <Progress value={topicPercentage} className="w-20 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <p className="text-muted-foreground">
                Review all questions with correct answers
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {questionsData.map((question, index) => (
                <div key={question.id} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        question.is_correct 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {question.is_correct ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">Question {index + 1}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {question.topic}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-foreground mb-3">
                    {question.question_text}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div 
                        key={key}
                        className={`p-2 rounded text-sm border ${
                          key === question.correct_answer
                            ? 'border-success bg-success/5 text-success'
                            : key === question.user_answer && !question.is_correct
                            ? 'border-destructive bg-destructive/5 text-destructive'
                            : 'border-border/30'
                        }`}
                      >
                        <span className="font-medium">{key}.</span> {value}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {question.is_correct ? (
                      <span className="text-success">✓ Correct answer: {question.correct_answer}</span>
                    ) : (
                      <span>
                        Your answer: <span className="text-destructive">{question.user_answer || 'Not answered'}</span>
                        {' • '}
                        Correct answer: <span className="text-success">{question.correct_answer}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/quiz/${courseId}`}>
              <Button size="lg" className="w-full sm:w-auto">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Test
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">Built by <span className="font-semibold text-primary">Z10N</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Results;