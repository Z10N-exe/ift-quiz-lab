import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Clock } from "lucide-react";

const Landing = () => {
  const courses = [
    {
      id: "IFT212.2",
      title: "IFT 212.2 - Computer Architecture",
      description: "Master flip-flops, modulation, and computer system fundamentals",
      topics: ["Flip-Flops (SR, D, JK, T)", "Modulation & Demodulation", "Computer Systems"],
      color: "from-primary to-primary-glow",
      questions: "30 questions",
      duration: "45 minutes"
    },
    {
      id: "IFT235.2", 
      title: "IFT 235.2 - Mobile App Performance",
      description: "Optimize mobile apps with KPIs, network efficiency, and data processing",
      topics: ["KPIs & Metrics", "Network Optimization", "Data Processing"],
      color: "from-success to-success/80",
      questions: "30 questions",
      duration: "45 minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                CBT Quiz Lab
              </h1>
              <p className="text-muted-foreground mt-1">Computer-Based Testing Platform</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Academic Excellence</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Course
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a course to begin your assessment. Each test contains 30 randomly selected questions
            from our comprehensive question bank.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-quiz transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className={`h-2 w-full bg-gradient-to-r ${course.color} rounded-full mb-4`} />
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  {course.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Focus Topics
                  </h4>
                  <ul className="space-y-2">
                    {course.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.questions}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <Link to={`/quiz/${course.id}`}>
                    <Button 
                      className="group-hover:shadow-lg transition-all duration-300"
                      size="lg"
                    >
                      Start Test
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Randomized Questions</h3>
              <p className="text-sm text-muted-foreground">
                30 questions randomly selected from our comprehensive question bank
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed feedback and correct answers immediately after submission
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground">Unlimited Retakes</h3>
              <p className="text-sm text-muted-foreground">
                Practice as many times as you want with different question sets
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">Built by <span className="font-semibold text-primary">Z10N</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;