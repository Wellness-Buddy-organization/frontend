import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon, 
  MicrophoneIcon,
  SpeakerWaveIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Motivational quotes array
const quotes = [
  "You are stronger than you think.",
  "Every day is a new beginning.",
  "Breathe in courage, breathe out fear.",
  "Progress, not perfection.",
  "You're not alone—support is here.",
  "Small steps still move you forward.",
  "Your mental health is a priority.",
  "It's okay to take a break.",
  "Growth happens outside your comfort zone.",
  "Be gentle with yourself today."
];

// Mood options with visual representations
const moods = [
  { value: 1, label: "Angry", emoji: "😠", color: "bg-red-100 border-red-300" },
  { value: 2, label: "Sad", emoji: "😢", color: "bg-blue-100 border-blue-300" },
  { value: 3, label: "Anxious", emoji: "😰", color: "bg-yellow-100 border-yellow-300" },
  { value: 4, label: "Neutral", emoji: "😐", color: "bg-gray-100 border-gray-300" },
  { value: 5, label: "Happy", emoji: "😊", color: "bg-green-100 border-green-300" },
];

// Journal prompts based on mood
const journalPrompts = {
  1: [ // Angry
    "What triggered my anger today?",
    "How can I respond rather than react next time?",
    "What would help me feel calmer right now?"
  ],
  2: [ // Sad
    "What am I feeling sad about specifically?",
    "What's one small thing that brought me joy today?",
    "How can I show myself compassion right now?"
  ],
  3: [ // Anxious
    "What specific worries are on my mind?",
    "Which of these concerns are within my control?",
    "What has helped me through anxiety in the past?"
  ],
  4: [ // Neutral
    "What am I grateful for today?",
    "What would make today even better?",
    "What are my intentions for tomorrow?"
  ],
  5: [ // Happy
    "What contributed to my positive mood today?",
    "How can I carry this feeling forward?",
    "Who could I share this positive energy with?"
  ]
};

// Resource library categories and items
const resourceLibrary = [
  {
    category: "Articles",
    items: [
      { title: "Understanding Stress and Your Body", duration: "5 min read" },
      { title: "Mindfulness for Beginners", duration: "8 min read" },
      { title: "Sleep Hygiene: 7 Tips for Better Rest", duration: "6 min read" },
      { title: "Building Resilience through Difficult Times", duration: "7 min read" },
    ]
  },
  {
    category: "Videos",
    items: [
      { title: "Guided Meditation for Anxiety Relief", duration: "10 min" },
      { title: "Progressive Muscle Relaxation Technique", duration: "8 min" },
      { title: "Understanding Cognitive Distortions", duration: "12 min" },
      { title: "Breathing Exercises for Stress Management", duration: "5 min" },
    ]
  },
  {
    category: "Podcasts",
    items: [
      { title: "The Science of Happiness", duration: "22 min" },
      { title: "Mindful Communication in Relationships", duration: "18 min" },
      { title: "Sleep Stories: Ocean Waves", duration: "15 min" },
      { title: "Building Healthy Habits That Last", duration: "24 min" },
    ]
  }
];

// --- Resource Library Section ---
const ResourceLibrarySection = () => {
  const [activeCategory, setActiveCategory] = useState("Articles");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredResources = resourceLibrary.find(cat => cat.category === activeCategory)?.items.filter(
    item => item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 mb-8">
      <div className="flex items-center mb-4">
        <BookOpenIcon className="w-6 h-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Resource Library</h2>
      </div>
      
      {/* Search box */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {resourceLibrary.map(cat => (
          <button
            key={cat.category}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === cat.category
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>
      
      {/* Resource items */}
      <ul className="space-y-2">
        {filteredResources.length > 0 ? (
          filteredResources.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-500">{item.duration}</span>
              </div>
            </motion.li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No results found. Try another search term.</p>
        )}
      </ul>
    </div>
  );
};

// Interactive Guided Meditation Component
const GuidedMeditationPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [volume, setVolume] = useState(80);
  const [selectedDuration, setSelectedDuration] = useState(300);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  
  // Meditation options
  const meditationOptions = [
    { value: 300, label: "5 min" },
    { value: 600, label: "10 min" },
    { value: 900, label: "15 min" }
  ];
  
  // Effect to handle play/pause and progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);
  
  // Reset meditation when duration changes
  useEffect(() => {
    setProgress(0);
    setDuration(selectedDuration);
    setIsPlaying(false);
    // In a real app, you would also update the audio source
  }, [selectedDuration]);
  
  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you would control the actual audio here
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    // In a real app, you would adjust the actual audio volume here
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-6 h-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Guided Meditation</h2>
      </div>
      
      {/* Duration options */}
      <div className="flex justify-center space-x-2 mb-6">
        {meditationOptions.map(option => (
          <button
            key={option.value}
            className={`px-4 py-2 rounded-full ${
              selectedDuration === option.value
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedDuration(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Meditation animation */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={{ 
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [0.7, 1, 0.7] : 0.7
          }}
          transition={{ 
            repeat: isPlaying ? Infinity : 0, 
            duration: 4,
            ease: "easeInOut"
          }}
          className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
            <button
              className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow focus:outline-none"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause meditation" : "Start meditation"}
            >
              {isPlaying ? (
                <PauseIcon className="w-8 h-8 text-white" />
              ) : (
                <PlayIcon className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full transition-all"
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center">
        <SpeakerWaveIcon className="w-5 h-5 text-gray-600 mr-2" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume control"
        />
      </div>
      
      {/* Hidden audio element (would be used in a real implementation) */}
      <audio ref={audioRef} />
    </div>
  );
};

// Advanced Breathing Exercise
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [breathingPattern, setBreathingPattern] = useState("4-7-8");
  const intervalRef = useRef(null);
  
  // Define breathing patterns
  const patterns = {
    "4-7-8": {
      name: "4-7-8 Technique",
      description: "Inhale for 4, hold for 7, exhale for 8",
      steps: [
        { action: "Inhale", duration: 4, color: "from-blue-300 to-blue-500" },
        { action: "Hold", duration: 7, color: "from-purple-300 to-purple-500" },
        { action: "Exhale", duration: 8, color: "from-emerald-300 to-emerald-500" }
      ]
    },
    "box": {
      name: "Box Breathing",
      description: "Equal duration for inhale, hold, exhale, and second hold",
      steps: [
        { action: "Inhale", duration: 4, color: "from-blue-300 to-blue-500" },
        { action: "Hold", duration: 4, color: "from-purple-300 to-purple-500" },
        { action: "Exhale", duration: 4, color: "from-emerald-300 to-emerald-500" },
        { action: "Hold", duration: 4, color: "from-amber-300 to-amber-500" }
      ]
    },
    "calm": {
      name: "Calming Breath",
      description: "Extended exhale for relaxation",
      steps: [
        { action: "Inhale", duration: 4, color: "from-blue-300 to-blue-500" },
        { action: "Hold", duration: 2, color: "from-purple-300 to-purple-500" },
        { action: "Exhale", duration: 6, color: "from-emerald-300 to-emerald-500" }
      ]
    }
  };
  
  // Get current breathing pattern
  const currentPattern = patterns[breathingPattern];
  
  // Current step details
  const currentStep = currentPattern.steps[step];
  
  // Start/stop breathing exercise
  const toggleExercise = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setStep(0);
      setCycles(0);
    } else {
      setIsActive(true);
      let stepCounter = 0;
      let stepTime = 0;
      intervalRef.current = setInterval(() => {
        stepTime++;
        if (stepTime >= currentPattern.steps[stepCounter].duration) {
          stepCounter = (stepCounter + 1) % currentPattern.steps.length;
          if (stepCounter === 0) {
            setCycles(c => c + 1);
          }
          stepTime = 0;
        }
        setStep(stepCounter);
      }, 1000);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Reset when pattern changes
  useEffect(() => {
    if (isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
    }
    setStep(0);
    setCycles(0);
  }, [breathingPattern]);
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Breathing Exercise</h3>
      
      {/* Pattern selection */}
      <div className="flex justify-center space-x-2 mb-6 overflow-x-auto">
        {Object.keys(patterns).map(key => (
          <button
            key={key}
            className={`px-4 py-2 rounded-lg ${
              breathingPattern === key
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setBreathingPattern(key)}
            disabled={isActive}
          >
            {patterns[key].name}
          </button>
        ))}
      </div>
      
      <p className="text-center text-gray-600 mb-6">{currentPattern.description}</p>
      
      {/* Animated breathing circle */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={{ 
            scale: currentStep.action === "Inhale" ? [1, 1.3] : 
                  currentStep.action === "Exhale" ? [1.3, 1] : 1.3,
          }}
          transition={{ 
            duration: currentStep.duration,
            ease: "easeInOut",
          }}
          className={`w-48 h-48 bg-gradient-to-r ${currentStep.color} rounded-full flex items-center justify-center shadow-lg`}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold mb-2">{currentStep.action}</div>
            <div className="text-4xl">{currentStep.duration}s</div>
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-gray-600 mb-4">
          {isActive ? `Cycles completed: ${cycles}` : "Ready to begin"}
        </p>
        
        <button
          className={`px-6 py-3 rounded-lg ${
            isActive 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-emerald-500 hover:bg-emerald-600"
          } text-white font-medium transition`}
          onClick={toggleExercise}
        >
          {isActive ? "Stop Exercise" : "Start Breathing"}
        </button>
      </div>
    </div>
  );
}

// Intelligent Journal Component with AI sentiment analysis
function IntelligentJournal({ mood = 4 }) {
  const [journal, setJournal] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [sentiment, setSentiment] = useState(null);
  
  // Generate a journal prompt based on current mood
  useEffect(() => {
    const prompts = journalPrompts[mood] || journalPrompts[4];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [mood]);
  
  // Get a new prompt
  const getNewPrompt = () => {
    const prompts = journalPrompts[mood] || journalPrompts[4];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };
  
  // Save journal entry 
  const saveJournalEntry = () => {
    if (journal.trim()) {
      // Simplified sentiment analysis (in a real app, you would use NLP)
      const dummySentimentAnalysis = () => {
        const words = journal.toLowerCase().split(/\s+/);
        const positiveWords = ["happy", "good", "great", "joy", "excited", "positive", "wonderful", "love"];
        const negativeWords = ["sad", "bad", "terrible", "anxious", "worried", "negative", "stressed", "fear"];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
          if (positiveWords.includes(word)) positiveCount++;
          if (negativeWords.includes(word)) negativeCount++;
        });
        
        if (positiveCount > negativeCount) return { type: "positive", score: 0.7 };
        if (negativeCount > positiveCount) return { type: "negative", score: 0.7 };
        return { type: "neutral", score: 0.5 };
      };
      
      const sentimentResult = dummySentimentAnalysis();
      
      const newEntry = { 
        mood, 
        journal, 
        date: new Date(), 
        prompt,
        sentiment: sentimentResult
      };
      
      setJournalEntries([newEntry, ...journalEntries]);
      setJournal("");
      setSentiment(sentimentResult);
      
      // Reset sentiment after 5 seconds
      setTimeout(() => setSentiment(null), 5000);
    }
  };
  
  // Toggle voice recording (simulated)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setJournal(prev => prev + " Voice recording transcription would appear here.");
      }, 3000);
    }
  };
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Reflective Journal</h3>
      
      {/* Current prompt */}
      <div className="bg-emerald-50 rounded-lg p-4 mb-4 flex items-start">
        <div className="flex-1 italic text-emerald-700">{prompt}</div>
        <button 
          onClick={getNewPrompt}
          className="text-emerald-600 hover:text-emerald-800 ml-2"
          aria-label="Get new prompt"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Journal input */}
      <div className="mb-4 relative">
        <textarea
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px]"
          placeholder="Write your thoughts here..."
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        ></textarea>
        
        {/* Voice input button */}
        <button
          className={`absolute bottom-2 right-2 p-2 rounded-full ${
            isRecording ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={toggleRecording}
          aria-label={isRecording ? "Stop recording" : "Start voice recording"}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Sentiment feedback */}
      <AnimatePresence>
        {sentiment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg mb-4 ${
              sentiment.type === "positive" ? "bg-green-100 text-green-800" :
              sentiment.type === "negative" ? "bg-orange-100 text-orange-800" :
              "bg-blue-100 text-blue-800"
            }`}
          >
            {sentiment.type === "positive" && "Your entry sounds positive - great job reflecting on good moments!"}
            {sentiment.type === "negative" && "Your entry suggests some challenges - remember it's okay to acknowledge difficult feelings."}
            {sentiment.type === "neutral" && "Your reflection seems balanced - thank you for sharing your thoughts."}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          onClick={saveJournalEntry}
        >
          Save Entry
        </button>
      </div>
      
      {/* Entry list */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">Previous Entries</h4>
          {journalEntries.length > 0 && (
            <button className="text-sm text-emerald-600 hover:underline">
              View All
            </button>
          )}
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {journalEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No entries yet. Start journaling today!</p>
          ) : (
            journalEntries.slice(0, 3).map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg border ${moods.find(m => m.value === entry.mood)?.color || "border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">
                      {moods.find(m => m.value === entry.mood)?.emoji || "😐"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {entry.date.toLocaleString()}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    entry.sentiment.type === "positive" ? "bg-green-100 text-green-800" :
                    entry.sentiment.type === "negative" ? "bg-orange-100 text-orange-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {entry.sentiment.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 italic mb-1">"{entry.prompt}"</div>
                <p className="text-gray-800">{entry.journal}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Crisis Support Modal
function CrisisModal({ open, onClose }) {
  // Helplines data
  const helplines = [
    { country: "United States", text: "988 Suicide & Crisis Lifeline", phone: "988" },
    { country: "United Kingdom", text: "Samaritans", phone: "116 123" },
    { country: "Sri Lanka", text: "CCCline", phone: "1333" },
    { country: "India", text: "Kiran Helpline", phone: "1800-599-0019" },
    { country: "Australia", text: "Lifeline", phone: "13 11 14" },
    { country: "Canada", text: "Crisis Services Canada", phone: "1-833-456-4566" },
  ];
  
  // Self-assessment questions (simplified)
  const assessmentQuestions = [
    { question: "Have you been feeling down, depressed, or hopeless?", weight: 3 },
    { question: "Have you had thoughts that you would be better off dead, or of hurting yourself?", weight: 5 },
    { question: "Are you having trouble sleeping or sleeping too much?", weight: 1 },
    { question: "Have you lost interest or pleasure in doing things?", weight: 2 },
  ];
  
  const [answers, setAnswers] = useState(assessmentQuestions.map(() => null));
  const [showResources, setShowResources] = useState(false);
  
  // Handle answer selection
  const selectAnswer = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    
    // Check if all questions have been answered
    if (newAnswers.every(a => a !== null)) {
      // Calculate risk score
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer ? assessmentQuestions[index].weight : 0);
      }, 0);
      
      // Show resources for medium to high scores
      if (score >= 5) {
        setShowResources(true);
      }
    }
  };
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label="Crisis Support"
          >
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" 
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-emerald-700">Crisis Support</h2>
            
            {!showResources ? (
              <>
                <p className="mb-4 text-gray-600">
                  Please take a moment to answer these few questions to help us provide you with the best resources:
                </p>
                
                <div className="space-y-4 mb-6">
                  {assessmentQuestions.map((q, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="mb-3 font-medium">{q.question}</p>
                      <div className="flex space-x-2">
                        <button
                          className={`flex-1 py-2 rounded ${
                            answers[index] === true
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => selectAnswer(index, true)}
                        >
                          Yes
                        </button>
                        <button
                          className={`flex-1 py-2 rounded ${
                            answers[index] === false
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => selectAnswer(index, false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mb-2">
                  <button
                    className="bg-emerald-500 text-white px-4 py-2 rounded shadow hover:bg-emerald-600 transition"
                    onClick={() => setShowResources(true)}
                  >
                    Skip Questions & Show Resources
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-600">
                  If you or someone you know is in crisis, please reach out immediately to one of these helplines:
                </p>
                
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <h3 className="font-bold text-red-700 mb-2">Emergency Resources</h3>
                  <ul className="space-y-2">
                    {helplines.map(h => (
                      <li key={h.phone} className="flex items-center gap-2">
                        <span className="font-bold min-w-[100px]">{h.country}:</span>
                        <span className="flex-1">{h.text}</span>
                        <a 
                          href={`tel:${h.phone}`} 
                          className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition"
                        >
                          {h.phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h3 className="font-bold text-gray-700 mb-2">Additional Resources</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                  <li>Text "HOME" to 741741 to reach the Crisis Text Line</li>
                  <li>Visit the local emergency room or urgent psychiatric care</li>
                  <li>Schedule an appointment with a mental health professional</li>
                  <li>Connect with support groups in your community</li>
                </ul>
                
                <p className="text-sm text-gray-500 mt-4">
                  Your safety matters. All calls are confidential and free. Remember, reaching out is a sign of strength, not weakness.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Mental Health Component
const MentalHealthView = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [mood, setMood] = useState(4); // Default: Neutral
  const [medOpen, setMedOpen] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("journal"); // journal, resources, meditation, breathing
  
  // Function to get a new random quote
  const getNewQuote = () => {
    let newQuote = currentQuote;
    while (newQuote === currentQuote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setCurrentQuote(newQuote);
  };
  
  // Tabs for mobile view
  const tabs = [
    { id: "journal", label: "Journal", icon: <ChevronDownIcon className="w-4 h-4" /> },
    { id: "meditation", label: "Meditation", icon: <ChevronDownIcon className="w-4 h-4" /> },
    { id: "breathing", label: "Breathing", icon: <ChevronDownIcon className="w-4 h-4" /> },
    { id: "resources", label: "Resources", icon: <ChevronDownIcon className="w-4 h-4" /> },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mental Health Support</h1>
      
      {/* Mobile Tab Navigation */}
      <div className="md:hidden mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Motivational Quote Card - Always visible */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-xl italic text-emerald-800 text-center md:text-left mb-4 md:mb-0">
            "{currentQuote}"
          </div>
          <button
            className="px-4 py-2 bg-white text-emerald-700 rounded-lg shadow hover:shadow-md transition"
            onClick={getNewQuote}
          >
            New Quote
          </button>
        </div>
      </div>
      
      {/* Emergency Help Button - Always visible */}
      <div className="mb-8">
        <button
          className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg flex items-center justify-center"
          onClick={() => setCrisisOpen(true)}
        >
          <span className="mr-2">Get Immediate Support</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood Tracker and Journal - left column on desktop */}
        {(activeTab === "journal" || window.innerWidth >= 768) && (
          <div className="space-y-8">
            {/* Mood Selection */}
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling?</h3>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((m) => (
                  <motion.button
                    key={m.value}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                      mood === m.value
                        ? `ring-2 ring-emerald-500 ${m.color}`
                        : "border-transparent hover:bg-gray-50"
                    }`}
                    onClick={() => setMood(m.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Intelligent Journal */}
            <IntelligentJournal mood={mood} />
          </div>
        )}
        
        {/* Right Column on desktop - changes with tabs on mobile */}
        <div className="space-y-8">
          {/* Guided Meditation */}
          {(activeTab === "meditation" || window.innerWidth >= 768) && (
            <GuidedMeditationPlayer />
          )}
          
          {/* Breathing Exercise */}
          {(activeTab === "breathing" || window.innerWidth >= 768) && (
            <BreathingExercise />
          )}
          
          {/* Resource Library */}
          {(activeTab === "resources" || window.innerWidth >= 768) && (
            <ResourceLibrarySection />
          )}
        </div>
      </div>
      
      {/* Crisis Support Modal */}
      <CrisisModal open={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </motion.div>
  );
};

export default MentalHealthView;