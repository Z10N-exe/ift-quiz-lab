import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Clock, Sun, Moon } from "lucide-react";

const Landing = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Persist theme in localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const courses = [
    {
      id: "IFT212.2",
      title: "IFT 212.2 - Computer Architecture",
      description: "Master flip-flops, modulation, and computer system fundamentals",
      topics: ["Flip-Flops (SR, D, JK, T)", "Modulation & Demodulation", "Computer Systems"],
      color: "gradient-primary",
      questions: "30 questions",
      duration: "45 minutes",
    },
    {
      id: "IFT235.2",
      title: "IFT 235.2 - Mobile App Performance",
      description: "Optimize mobile apps with KPIs, network efficiency, and data processing",
      topics: ["KPIs & Metrics", "Network Optimization", "Data Processing"],
      color: "gradient-success",
      questions: "30 questions",
      duration: "45 minutes",
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-academic font-sans transition-all duration-300 ${isDark ? "dark" : ""}`}>
      {/* Header */}
      <header className="border-b bg-card/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CBT MOCK PLATFORM FOR IFT
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Computer-Based Testing Platform</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Academic Excellence</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 sm:px-6 sm:py-10">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            Choose Your Course
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Select a course to begin your assessment. Each test contains 30 randomly selected questions from our comprehensive question bank.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className="group hover:shadow-quiz transition-all duration-300 border-border hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring animate-accordion-down"
              role="article"
              aria-labelledby={`course-title-${course.id}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className={`h-1 w-full bg-${course.color} rounded-full mb-3`} />
                <CardTitle
                  id={`course-title-${course.id}`}
                  className="text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors"
                >
                  {course.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Focus Topics
                  </h4>
                  <ul className="space-y-1.5">
                    {course.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 sm:mb-0">
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
                      className="w-full sm:w-auto bg-gradient-primary text-primary-foreground hover:bg-primary/90 hover:animate-button-pulse group-hover:shadow-academic transition-all duration-300"
                      size="lg"
                      aria-label={`Start ${course.title} test`}
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
        <div className="mt-10 sm:mt-12 text-center animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-primary" />,
                title: "Randomized Questions",
                description: "30 questions randomly selected from our comprehensive question bank",
                bg: "bg-accent",
              },
              {
                icon: <Trophy className="h-6 w-6 text-success" />,
                title: "Instant Results",
                description: "Get detailed feedback and correct answers immediately after submission",
                bg: "bg-success/10",
              },
              {
                icon: <Users className="h-6 w-6 text-warning" />,
                title: "Unlimited Retakes",
                description: "Practice as many times as you want with different question sets",
                bg: "bg-warning/10",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`space-y-3 p-4 rounded-md ${feature.bg} hover:bg-accent/50 transition-all duration-300 animate-accordion-down`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mx-auto">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-10 sm:mt-12">
        <div className="container px-4 py-6 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Built by <span className="font-semibold text-primary">Z10N</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;