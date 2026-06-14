import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  Switch,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// NOTE: This file is the interactive visualizer component.
// Expo Router entry point is src/app/_layout.tsx — not this file.

// Premium Dark Theme Palette
const DARK_THEME = {
  background: '#0d0e12',
  surface: '#161822',
  surfaceSecondary: '#1f2235',
  primary: '#6366f1', // Indigo
  primaryGlow: 'rgba(99, 102, 241, 0.15)',
  secondary: '#10b981', // Emerald green
  secondaryGlow: 'rgba(16, 185, 129, 0.15)',
  accent: '#a855f7', // Purple
  accentGlow: 'rgba(168, 85, 247, 0.15)',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#2e3248',
  cardBg: '#1b1d2e',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

// Premium Light Theme Palette
const LIGHT_THEME = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  primary: '#4f46e5',
  primaryGlow: 'rgba(79, 70, 229, 0.08)',
  secondary: '#059669',
  secondaryGlow: 'rgba(5, 150, 105, 0.08)',
  accent: '#7c3aed',
  accentGlow: 'rgba(124, 58, 237, 0.08)',
  text: '#0f172a',
  textMuted: '#475569',
  border: '#e2e8f0',
  cardBg: '#ffffff',
  glass: 'rgba(0, 0, 0, 0.03)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
};

// ─── Visualizer Component (used inside Expo Router screens) ────────────────
function App({ signOut, userEmail }: { signOut: () => void; userEmail: string }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // Read screen dimensions dynamically
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth >= 850;

  // View Mode for Mobile Layout only: 'app' (mock user screens) vs 'sandbox' (developer tools)
  const [mobileActiveTab, setMobileActiveTab] = useState<'app' | 'sandbox'>('app');

  // APP PREVIEW STATE (Simulating client navigation)
  const [appScreen, setAppScreen] = useState<'onboarding' | 'feed' | 'dashboard' | 'tutor'>('onboarding');

  // Onboarding states
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['AI Models']);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Feed states (TikTok-style feed mockup)
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const feedSwipeAnim = useRef(new Animated.Value(0)).current;

  // Dashboard states
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // SANDBOX STATE
  const [activeSandboxTab, setActiveSandboxTab] = useState<'layout' | 'animations' | 'db'>('layout');
  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('space-between');
  const [alignItems, setAlignItems] = useState<'flex-start' | 'center' | 'flex-end' | 'stretch'>('center');
  const [gapSize, setGapSize] = useState<number>(12);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  // Animation values
  const [animationSpeed, setAnimationSpeed] = useState<number>(300);
  const springAnimValue = useRef(new Animated.Value(1)).current;
  const rotateAnimValue = useRef(new Animated.Value(0)).current;

  // AI Tutor / SSE simulator state
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; sources?: string[] }>>([
    { id: '1', sender: 'ai', text: 'Hello! Select a preset question in the AI Tutor workspace, and watch facts stream chunk-by-chunk.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentPromptName, setCurrentPromptName] = useState('');

  // Pulse animation for stream cursor
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // SVG Progress calculation
  const progressVal = 68; // mock current completion percentage
  const strokeWidth = 10;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // Mock global user details state (Zustand client mockup)
  const [userState, setUserState] = useState({
    username: 'learning_champion',
    streakCount: 6,
    xpTotal: 920,
    role: 'STUDENT',
    offlineQueue: 0,
    badges: ['Daily Streak', 'AI Pathfinder']
  });

  const goalsList = ['AI Models', 'Python Syntax', 'Data Science', 'Cloud Clusters', 'Neural Networks'];

  // Trigger Spring bounce badge
  const triggerSpring = () => {
    springAnimValue.setValue(0.6);
    Animated.spring(springAnimValue, {
      toValue: 1.0,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  // Trigger rotation
  const triggerRotation = () => {
    rotateAnimValue.setValue(0);
    Animated.timing(rotateAnimValue, {
      toValue: 1,
      duration: animationSpeed * 2,
      useNativeDriver: true,
    }).start();
  };

  // Toggle goal tags
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  // Videos List for Feed Preview
  const MOCK_VIDEOS = [
    {
      id: '1',
      title: 'Neural Networks Explained',
      desc: 'Master the core forward-pass equations and activation curves in under 1 minute!',
      author: 'Prof. Sarah Jenkins',
      tag: 'Neural Nets'
    },
    {
      id: '2',
      title: 'Setting up PostgreSQL Vector Search',
      desc: 'Configure pgvector extension and upload embeddings for instant context matching.',
      author: 'Dev Guru Alex',
      tag: 'pgvector'
    },
    {
      id: '3',
      title: 'FastAPI SSE streaming endpoints',
      desc: 'Write custom SSE async generators to stream response packets to mobile clients in real-time.',
      author: 'Eng. David Miller',
      tag: 'SSE FastAPI'
    }
  ];

  const handleNextVideo = () => {
    Animated.timing(feedSwipeAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setCurrentVideoIdx(prev => (prev + 1) % MOCK_VIDEOS.length);
      setIsLiked(false);
      setIsBookmarked(false);
      feedSwipeAnim.setValue(0);
    });
  };

  // Mock SSE response streams
  const PRESET_QUERIES = {
    'RAG Pipeline': {
      text: 'Retrieval-Augmented Generation (RAG) optimizes LLM outputs. It queries a vector database (like `pgvector`) for context matching your prompt, appends these facts, and sends the rich package to the model. This eliminates hallucinations and keeps knowledge up to date!',
      sources: ['docs/skillsprint_enterprise/13_AI_Tutor.md', 'Database Chunks L12-L18']
    },
    'Backpropagation': {
      text: 'Backpropagation computes the gradient of the loss function with respect to weights. It moves backwards through a neural network using the chain rule, updating weights to reduce error iteratively. It is the math engine driving deep learning.',
      sources: ['Course 1: Deep Learning Fundamentals', 'Lesson 4 Workbook']
    },
    'Zustand Store': {
      text: 'Zustand is a lightweight state management solution. It uses a single store with simple hooks, ensuring React renders are atomic. In SkillSprint, it handles user authentication, theme modes, and an offline action queue.',
      sources: ['docs/skillsprint_enterprise/10_State_Management.md']
    }
  };

  const startStreamingSimulation = (key: keyof typeof PRESET_QUERIES) => {
    if (isTyping) return;
    const query = PRESET_QUERIES[key];
    
    // Add user message
    const newUserMsg = { id: Date.now().toString(), sender: 'user' as const, text: `Explain ${key}` };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);
    setStreamingText('');
    setCurrentPromptName(key);

    const words = query.text.split(' ');
    let currentIdx = 0;
    let accumulatedText = '';

    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        accumulatedText += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        setStreamingText(accumulatedText);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Save complete message
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: query.text,
          sources: query.sources
        }]);
        setStreamingText('');
        // Award user XP
        setUserState(prev => ({
          ...prev,
          xpTotal: prev.xpTotal + 35
        }));
      }
    }, 80);
  };

  const handleQuizSubmit = (ans: string) => {
    setSelectedQuizAnswer(ans);
    if (ans === 'B') {
      setQuizScore(100);
      setUserState(prev => ({
        ...prev,
        xpTotal: prev.xpTotal + 100,
        streakCount: prev.streakCount + 1
      }));
    } else {
      setQuizScore(0);
    }
  };

  /* ======================== RENDER FUNCTIONS FOR APPSCREENS ======================== */
  const renderAppScreen = () => {
    switch (appScreen) {
      case 'onboarding':
        return (
          <ScrollView contentContainerStyle={styles.appScreenScroll}>
            <Text style={[styles.screenHeroTitle, { color: theme.text }]}>Define Your Learning Sprint</Text>
            <Text style={[styles.screenHeroDesc, { color: theme.textMuted }]}>
              SkillSprint blends short-form mechanics with technical academy depth. Select goals to build your feed.
            </Text>

            {/* Goal Selections */}
            <View style={styles.goalGroup}>
              <Text style={[styles.groupLabel, { color: theme.text }]}>Learning Tracks</Text>
              <View style={styles.glassTagsContainer}>
                {goalsList.map((g) => {
                  const isSel = selectedGoals.includes(g);
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.glassTag,
                        { backgroundColor: isSel ? theme.primaryGlow : theme.glass, borderColor: isSel ? theme.primary : theme.glassBorder }
                      ]}
                      onPress={() => toggleGoal(g)}
                    >
                      <Text style={[styles.glassTagText, { color: isSel ? theme.primary : theme.text }]}>
                        {isSel ? '✓ ' : '+ '} {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Experience Selector */}
            <View style={styles.experienceGroup}>
              <Text style={[styles.groupLabel, { color: theme.text }]}>Your Level</Text>
              <View style={[styles.experienceTabs, { backgroundColor: theme.surfaceSecondary }]}>
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.expTabItem, experienceLevel === lvl ? { backgroundColor: theme.cardBg } : null]}
                    onPress={() => setExperienceLevel(lvl as any)}
                  >
                    <Text style={[styles.expTabText, { color: experienceLevel === lvl ? theme.primary : theme.textMuted }]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Confirm CTA */}
            <TouchableOpacity
              style={[styles.appPrimaryBtn, { backgroundColor: theme.primary }]}
              onPress={() => setAppScreen('feed')}
            >
              <Text style={styles.appPrimaryBtnText}>Initialize My Feed →</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 'feed':
        return (
          <View style={[styles.feedScreenSurface, { backgroundColor: '#05060b' }]}>
            <Animated.View style={[
              styles.feedMediaBox,
              { transform: [{ translateY: feedSwipeAnim }] }
            ]}>
              <View style={[styles.videoOverlayGradient, { backgroundColor: currentVideoIdx === 0 ? '#1b1435' : currentVideoIdx === 1 ? '#0a1d1a' : '#171a2b' }]} />
              
              {/* Details Overlay */}
              <View style={styles.videoDetailsOverlay}>
                <View style={[styles.videoTagBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.videoTagText}>{MOCK_VIDEOS[currentVideoIdx].tag}</Text>
                </View>
                <Text style={[styles.videoAuthor, { color: '#ffffff' }]}>@{MOCK_VIDEOS[currentVideoIdx].author}</Text>
                <Text style={[styles.videoTitle, { color: '#ffffff' }]}>{MOCK_VIDEOS[currentVideoIdx].title}</Text>
                <Text style={[styles.videoDesc, { color: '#d1d5db' }]}>{MOCK_VIDEOS[currentVideoIdx].desc}</Text>
              </View>

              {/* Interaction sidebar */}
              <View style={styles.feedSidebar}>
                <View style={styles.sidebarAvatar}>
                  <Text style={{ fontSize: 16 }}>🎓</Text>
                </View>

                <TouchableOpacity 
                  style={styles.sidebarAction} 
                  onPress={() => {
                    setIsLiked(!isLiked);
                    if (!isLiked) {
                      setUserState(prev => ({ ...prev, xpTotal: prev.xpTotal + 10 }));
                    }
                  }}
                >
                  <Text style={styles.actionEmoji}>{isLiked ? '❤️' : '🤍'}</Text>
                  <Text style={styles.actionText}>{isLiked ? '1.4k' : '1.3k'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarAction} onPress={() => setIsBookmarked(!isBookmarked)}>
                  <Text style={styles.actionEmoji}>{isBookmarked ? '⭐' : '☆'}</Text>
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.sidebarAction, { backgroundColor: theme.primary, borderRadius: 25, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }]}
                  onPress={() => {
                    setAppScreen('tutor');
                    startStreamingSimulation(
                      currentVideoIdx === 0 ? 'Backpropagation' : currentVideoIdx === 1 ? 'RAG Pipeline' : 'Zustand Store'
                    );
                  }}
                >
                  <Text style={{ fontSize: 18 }}>🤖</Text>
                  <Text style={{ fontSize: 7, color: '#fff', fontWeight: 'bold', marginTop: 1 }}>TUTOR</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <TouchableOpacity style={styles.swipeTriggerOverlay} onPress={handleNextVideo}>
              <Text style={styles.swipeTriggerText}>TAP SURFACE TO SWIPE FEED ⇅</Text>
            </TouchableOpacity>
          </View>
        );

      case 'dashboard':
        return (
          <ScrollView contentContainerStyle={styles.appScreenScroll}>
            {/* Stats Card */}
            <View style={[styles.dashboardStatsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.dashboardStatsLeft}>
                <Text style={[styles.dashboardLevel, { color: theme.text }]}>Level 4 Explorer</Text>
                <Text style={[styles.dashboardSub, { color: theme.textMuted }]}>Weekly Goal Progress</Text>
                <View style={styles.dashboardStreakRow}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                  <Text style={[styles.streakLabel, { color: theme.secondary }]}>{userState.streakCount}-Day Streak Active</Text>
                </View>
              </View>

              <View style={styles.svgWrapper}>
                <Svg width="120" height="120" viewBox="0 0 120 120">
                  <Defs>
                    <LinearGradient id="dashboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={theme.secondary} />
                      <Stop offset="100%" stopColor={theme.primary} />
                    </LinearGradient>
                  </Defs>
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={theme.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="url(#dashboardGrad)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={circumference - (progressVal / 100) * circumference}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </Svg>
                <View style={styles.svgCenterContent}>
                  <Text style={[styles.svgPercentText, { color: theme.text, fontSize: 18 }]}>{progressVal}%</Text>
                  <Text style={[styles.svgSubtext, { color: theme.textMuted, fontSize: 8 }]}>XP Done</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.groupLabel, { color: theme.text, marginTop: 12 }]}>Course Modules</Text>

            {/* Accordion 1 */}
            <View style={[styles.accordionItem, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpandedLesson(expandedLesson === 1 ? null : 1)}>
                <Text style={[styles.accordionTitle, { color: theme.text }]}>📚 Module 1: Vector Storage</Text>
                <Text style={{ color: theme.textMuted }}>{expandedLesson === 1 ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {expandedLesson === 1 && (
                <View style={[styles.accordionBody, { borderTopColor: theme.border }]}>
                  <Text style={[styles.accordionText, { color: theme.textMuted }]}>
                    Learn how vectors index semantic similarities inside text passages using SQL vectors.
                  </Text>
                  <TouchableOpacity 
                    style={[styles.smallActionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      setSelectedQuizAnswer(null);
                      setQuizScore(null);
                      setShowQuizModal(true);
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✍ Take Module Quiz</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Accordion 2 */}
            <View style={[styles.accordionItem, { backgroundColor: theme.cardBg, borderColor: theme.border, marginTop: 10 }]}>
              <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpandedLesson(expandedLesson === 2 ? null : 2)}>
                <Text style={[styles.accordionTitle, { color: theme.text }]}>⚡ Module 2: Gradient Descents</Text>
                <Text style={{ color: theme.textMuted }}>{expandedLesson === 2 ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {expandedLesson === 2 && (
                <View style={[styles.accordionBody, { borderTopColor: theme.border }]}>
                  <Text style={[styles.accordionText, { color: theme.textMuted }]}>
                    Optimize weights back and forth iteratively via derivatives and calculus rules.
                  </Text>
                </View>
              )}
            </View>

            {/* Quiz Modal Mockup */}
            {showQuizModal && (
              <View style={[styles.quizModalBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.primary }]}>
                <Text style={[styles.quizQuestion, { color: theme.text }]}>Which database extension handles vectors inside PostgreSQL?</Text>
                <View style={styles.quizAnswersRow}>
                  {['A) pg_search', 'B) pgvector', 'C) pg_relation'].map((opt, i) => {
                    const optLetter = opt.charAt(0);
                    const isSel = selectedQuizAnswer === optLetter;
                    let btnBg = theme.cardBg;
                    let btnBorder = theme.border;
                    if (isSel) {
                      btnBg = optLetter === 'B' ? theme.secondaryGlow : theme.accentGlow;
                      btnBorder = optLetter === 'B' ? theme.secondary : theme.accent;
                    }
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.quizAnswerBtn, { backgroundColor: btnBg, borderColor: btnBorder }]}
                        onPress={() => handleQuizSubmit(optLetter)}
                      >
                        <Text style={[styles.quizAnswerText, { color: isSel ? (optLetter === 'B' ? theme.secondary : theme.accent) : theme.text }]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {quizScore !== null && (
                  <View style={styles.quizScoreRow}>
                    <Text style={{ fontSize: 24 }}>{quizScore === 100 ? '🎉' : '❌'}</Text>
                    <Text style={[styles.quizResultText, { color: quizScore === 100 ? theme.secondary : theme.accent }]}>
                      {quizScore === 100 ? 'Correct! +100 XP Earned!' : 'Incorrect. Try again!'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.border, marginTop: 12 }]} onPress={() => setShowQuizModal(false)}>
                  <Text style={{ color: theme.text }}>Close Quiz</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        );

      case 'tutor':
        return (
          <View style={styles.tutorScreenContainer}>
            <View style={[styles.tutorHeaderBar, { backgroundColor: theme.surfaceSecondary }]}>
              <Text style={[styles.tutorTitleText, { color: theme.text }]}>Ask Live AI Tutor</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                {Object.keys(PRESET_QUERIES).map((k) => (
                  <TouchableOpacity
                    key={k}
                    style={[styles.presetTopicBtn, { backgroundColor: theme.primary }]}
                    onPress={() => startStreamingSimulation(k as any)}
                  >
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView style={styles.chatScroll}>
              {messages.map((m) => (
                <View key={m.id} style={[styles.chatBubbleContainer, m.sender === 'user' ? styles.userBubbleAlign : styles.aiBubbleAlign]}>
                  <View style={[
                    styles.chatBubble,
                    m.sender === 'user'
                      ? { backgroundColor: theme.primary, borderBottomRightRadius: 2 }
                      : { backgroundColor: theme.cardBg, borderBottomLeftRadius: 2, borderColor: theme.border, borderWidth: 1 }
                  ]}>
                    <Text style={[styles.chatText, { color: m.sender === 'user' ? '#ffffff' : theme.text }]}>
                      {m.text}
                    </Text>
                  </View>
                  {m.sources && m.sources.length > 0 && (
                    <View style={styles.sourcesContainer}>
                      <View style={styles.sourcesRow}>
                        {m.sources.map((src, i) => (
                          <View key={i} style={[styles.sourceTag, { backgroundColor: theme.primaryGlow, borderColor: theme.primary }]}>
                            <Text style={[styles.sourceTagText, { color: theme.primary }]}>{src.split('/').pop()}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}

              {isTyping && (
                <View style={[styles.chatBubbleContainer, styles.aiBubbleAlign]}>
                  <View style={[styles.chatBubble, { backgroundColor: theme.cardBg, borderBottomLeftRadius: 2, borderColor: theme.border, borderWidth: 1 }]}>
                    <Text style={[styles.chatText, { color: theme.text }]}>
                      {streamingText}
                      <Animated.Text style={{ color: theme.accent, opacity: pulseAnim }}> ▍</Animated.Text>
                    </Text>
                  </View>
                  <Text style={{ color: theme.accent, fontSize: 8, marginTop: 2, marginLeft: 6, fontWeight: 'bold' }}>
                    ⚡ STREAMING RESPONSE VIA SSE...
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={[styles.chatInputRow, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
              <TextInput
                placeholder="Ask customized questions..."
                placeholderTextColor={theme.textMuted}
                editable={false}
                style={[styles.chatInput, { color: theme.text, backgroundColor: theme.surfaceSecondary }]}
              />
              <TouchableOpacity style={[styles.chatSendBtn, { backgroundColor: theme.border }]} disabled>
                <Text style={{ color: theme.textMuted }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  /* ======================== RENDER FUNCTIONS FOR DEV SANDBOX ======================== */
  const renderDevSandbox = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.sandboxTabsRow}>
          {['layout', 'animations', 'db'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.sandboxTabBtn,
                { backgroundColor: theme.surface },
                activeSandboxTab === tab ? { backgroundColor: theme.primaryGlow, borderColor: theme.primary } : { borderColor: 'transparent' }
              ]}
              onPress={() => setActiveSandboxTab(tab as any)}
            >
              <Text style={[styles.sandboxTabText, { color: activeSandboxTab === tab ? theme.primary : theme.textMuted }]}>
                {tab === 'layout' ? '🎨 Grid Layout' : tab === 'animations' ? '⚡ Animations' : '🗄️ Zustand / DB'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {activeSandboxTab === 'layout' && (
            <View>
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Flexbox Layout Rules</Text>
                
                <View style={styles.controlRow}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Flex Direction:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.controlBtnScroll}>
                    {['row', 'row-reverse', 'column', 'column-reverse'].map((dir) => (
                      <TouchableOpacity
                        key={dir}
                        style={[styles.smallBtn, flexDirection === dir ? { backgroundColor: theme.primary } : { backgroundColor: theme.surfaceSecondary }]}
                        onPress={() => setFlexDirection(dir as any)}
                      >
                        <Text style={[styles.smallBtnText, { color: flexDirection === dir ? '#fff' : theme.text }]}>{dir}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.controlRow}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Justify Content:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.controlBtnScroll}>
                    {['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map((jc) => (
                      <TouchableOpacity
                        key={jc}
                        style={[styles.smallBtn, justifyContent === jc ? { backgroundColor: theme.primary } : { backgroundColor: theme.surfaceSecondary }]}
                        onPress={() => setJustifyContent(jc as any)}
                      >
                        <Text style={[styles.smallBtnText, { color: justifyContent === jc ? '#fff' : theme.text }]}>{jc}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.controlRow}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Align Items:</Text>
                  <View style={styles.flexRow}>
                    {['flex-start', 'center', 'flex-end', 'stretch'].map((ai) => (
                      <TouchableOpacity
                        key={ai}
                        style={[styles.smallBtn, alignItems === ai ? { backgroundColor: theme.primary } : { backgroundColor: theme.surfaceSecondary }]}
                        onPress={() => setAlignItems(ai as any)}
                      >
                        <Text style={[styles.smallBtnText, { color: alignItems === ai ? '#fff' : theme.text }]}>{ai}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.controlRowBetween}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Gap Size: {gapSize}px</Text>
                  <View style={styles.flexRowCenter}>
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => setGapSize(Math.max(0, gapSize - 4))}>
                      <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary, marginLeft: 8 }]} onPress={() => setGapSize(Math.min(40, gapSize + 4))}>
                      <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.controlRowBetween}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Show Guidelines Overlay</Text>
                  <Switch value={showGuidelines} onValueChange={setShowGuidelines} trackColor={{ true: theme.primary }} />
                </View>
              </View>

              {/* Preview Box */}
              <View style={[styles.previewWrapper, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.previewHeader}>
                  <View style={styles.dots} />
                  <Text style={[styles.previewTitle, { color: theme.textMuted }]}>Interactive Layout Preview</Text>
                </View>
                <View style={[styles.previewArea, { flexDirection, justifyContent, alignItems, gap: gapSize, padding: 16 }]}>
                  <View style={[styles.mockCard, { backgroundColor: theme.cardBg, borderColor: showGuidelines ? theme.accent : theme.border, borderWidth: showGuidelines ? 1.5 : 1 }]}>
                    {showGuidelines && <View style={[styles.guidelineOverlay, { borderColor: theme.accent }]} />}
                    <Text style={[styles.mockCardIndex, { color: theme.accent }]}>01</Text>
                    <Text style={[styles.mockCardText, { color: theme.text }]}>Video Feed</Text>
                  </View>
                  <View style={[styles.mockCard, { backgroundColor: theme.cardBg, borderColor: showGuidelines ? theme.primary : theme.border, borderWidth: showGuidelines ? 1.5 : 1 }]}>
                    {showGuidelines && <View style={[styles.guidelineOverlay, { borderColor: theme.primary }]} />}
                    <Text style={[styles.mockCardIndex, { color: theme.primary }]}>02</Text>
                    <Text style={[styles.mockCardText, { color: theme.text }]}>AI Tutor</Text>
                  </View>
                  <View style={[styles.mockCard, { backgroundColor: theme.cardBg, borderColor: showGuidelines ? theme.secondary : theme.border, borderWidth: showGuidelines ? 1.5 : 1 }]}>
                    {showGuidelines && <View style={[styles.guidelineOverlay, { borderColor: theme.secondary }]} />}
                    <Text style={[styles.mockCardIndex, { color: theme.secondary }]}>03</Text>
                    <Text style={[styles.mockCardText, { color: theme.text }]}>Zustand Store</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeSandboxTab === 'animations' && (
            <View>
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Animations Physics Settings</Text>
                <View style={styles.controlRowBetween}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Duration: {animationSpeed}ms</Text>
                  <View style={styles.flexRowCenter}>
                    {[150, 300, 600].map((ms) => (
                      <TouchableOpacity
                        key={ms}
                        style={[styles.smallBtn, { backgroundColor: theme.surfaceSecondary }, animationSpeed === ms ? { backgroundColor: theme.primary } : null]}
                        onPress={() => setAnimationSpeed(ms)}
                      >
                        <Text style={[styles.smallBtnText, { color: animationSpeed === ms ? '#fff' : theme.text }]}>
                          {ms === 150 ? 'Fast' : ms === 300 ? 'Normal' : 'Slow'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Spring Badge */}
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Interactive Spring Badge Scale</Text>
                <View style={styles.animationShowcaseBox}>
                  <Animated.View style={[styles.springBadge, { backgroundColor: theme.accentGlow, borderColor: theme.accent, transform: [{ scale: springAnimValue }] }]}>
                    <Text style={styles.springBadgeEmoji}>🔥</Text>
                    <Text style={[styles.springBadgeText, { color: theme.accent }]}>6-Day Streak unlocked!</Text>
                  </Animated.View>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.accent }]} onPress={triggerSpring}>
                    <Text style={styles.primaryBtnText}>Trigger Bounce</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Linear Rotation */}
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Linear Spin Rotation</Text>
                <View style={styles.animationShowcaseBox}>
                  <Animated.View style={[styles.rotateBox, { borderColor: theme.primary, backgroundColor: theme.primaryGlow, transform: [{ rotate: rotateAnimValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
                    <Text style={{ color: theme.primary, fontSize: 24 }}>⚡</Text>
                  </Animated.View>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={triggerRotation}>
                    <Text style={styles.primaryBtnText}>Trigger Rotation Loop</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeSandboxTab === 'db' && (
            <View>
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Zustand client values</Text>
                <View style={[styles.jsonBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Text style={[styles.jsonText, { color: theme.secondary }]}>{"{"}</Text>
                  <Text style={[styles.jsonText, { color: theme.text }]}>  "user": "{userState.username}",</Text>
                  <Text style={[styles.jsonText, { color: theme.text }]}>  "xpAccumulated": {userState.xpTotal},</Text>
                  <Text style={[styles.jsonText, { color: theme.text }]}>  "streakCount": {userState.streakCount},</Text>
                  <Text style={[styles.jsonText, { color: theme.text }]}>  "badges": {JSON.stringify(userState.badges)},</Text>
                  <Text style={[styles.jsonText, { color: theme.text }]}>  "darkMode": {isDarkMode.toString()}</Text>
                  <Text style={[styles.jsonText, { color: theme.secondary }]}>{"}"}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.smallBtn, { backgroundColor: theme.secondary, marginTop: 12, alignSelf: 'flex-start' }]}
                  onPress={() => setUserState(prev => ({ ...prev, streakCount: prev.streakCount + 1, xpTotal: prev.xpTotal + 50 }))}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Simulate Claim Daily Streak (+50 XP)</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>PostgreSQL pgvector Schema</Text>
                <View style={[styles.tableSchemaBox, { borderColor: theme.border }]}>
                  <Text style={[styles.tableHeading, { color: theme.text }]}>📁 TABLE: micro_lessons</Text>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableField, { color: theme.textMuted }]}>id (INT)</Text>
                    <Text style={[styles.tableField, { color: theme.textMuted }]}>title (VARCHAR)</Text>
                    <Text style={[styles.tableField, { color: theme.textMuted }]}>vector_embedding (vector(1536))</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: theme.background },
      !isDesktop && Platform.OS === 'android' ? { paddingTop: (StatusBar.currentHeight || 24) } : null
    ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* HEADER SECTION */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>SkillSprint</Text>
          <View style={[styles.badgeContainer, { backgroundColor: theme.primaryGlow }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>RESPONSIVE WORKSPACE</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* User badge */}
          {userEmail ? (
            <View style={[styles.userBadge, { backgroundColor: theme.primaryGlow, borderColor: 'rgba(99,102,241,0.35)' }]}>
              <Text style={{ fontSize: 10 }}>👤</Text>
              <Text style={[styles.userBadgeText, { color: theme.primary }]} numberOfLines={1}>
                {userEmail.split('@')[0]}
              </Text>
            </View>
          ) : null}

          {/* Sign out */}
          <TouchableOpacity
            style={[styles.signOutBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => signOut()}
          >
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Sign Out</Text>
          </TouchableOpacity>

          {/* Theme switcher */}
          <Text style={[styles.themeLabel, { color: theme.textMuted }]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* WORKSPACE CONTENT LAYOUT */}
      {isDesktop ? (
        /* ======================== DESKTOP INTERFACE (SPLIT SCREEN LAYOUT) ======================== */
        <View style={styles.desktopWorkspace}>
          {/* Left Area: Mobile Device Shell Frame */}
          <View style={[styles.desktopLeftPanel, { borderRightColor: theme.border }]}>
            <Text style={[styles.workspaceSubheading, { color: theme.textMuted, marginBottom: 10 }]}>
              📱 Real-Time Mobile Screen Preview
            </Text>
            
            <View style={[styles.phoneShell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              {/* Phone Status bar Notch */}
              <View style={styles.phoneNotchRow}>
                <Text style={[styles.phoneNotchTime, { color: theme.textMuted }]}>7:17</Text>
                <View style={styles.phoneNotchSpeaker} />
                <View style={styles.phoneNotchIcons}>
                  <Text style={{ color: theme.textMuted, fontSize: 10 }}>📶 🔋 98%</Text>
                </View>
              </View>

              {/* Onboarding top progress bar */}
              {appScreen === 'onboarding' && (
                <View style={styles.progressBarWrapper}>
                  <View style={[styles.progressBarGlow, { backgroundColor: theme.primary }]} />
                </View>
              )}

              {/* Phone Content Frame */}
              <View style={styles.phoneRouterBody}>
                {renderAppScreen()}
              </View>

              {/* Bottom Nav Bar inside the phone */}
              <View style={[styles.phoneBottomNav, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('onboarding')}>
                  <Text style={{ fontSize: 16 }}>📋</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'onboarding' ? theme.primary : theme.textMuted }]}>Onboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('feed')}>
                  <Text style={{ fontSize: 16 }}>🎬</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'feed' ? theme.primary : theme.textMuted }]}>Feed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('dashboard')}>
                  <Text style={{ fontSize: 16 }}>📊</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'dashboard' ? theme.primary : theme.textMuted }]}>Dash</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('tutor')}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'tutor' ? theme.primary : theme.textMuted }]}>Tutor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Right Area: Interactive Developer Sandbox Panels */}
          <View style={styles.desktopRightPanel}>
            <Text style={[styles.workspaceSubheading, { color: theme.textMuted, marginBottom: 10 }]}>
              🛠️ Design System & State Playground
            </Text>
            {renderDevSandbox()}
          </View>
        </View>
      ) : (
        /* ======================== MOBILE / PHONE INTERFACE (VIEWPORT ADAPTED) ======================== */
        <View style={styles.mobileWorkspace}>
          {/* Top Tabs: App View vs Dev Inspector */}
          <View style={[styles.mobileHeaderTabs, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
            <TouchableOpacity 
              style={[styles.mobileTabBtn, mobileActiveTab === 'app' ? { backgroundColor: theme.primaryGlow, borderColor: theme.primary } : { borderColor: 'transparent' }]}
              onPress={() => setMobileActiveTab('app')}
            >
              <Text style={[styles.mobileTabText, { color: mobileActiveTab === 'app' ? theme.primary : theme.textMuted }]}>
                📱 Mobile App View
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mobileTabBtn, mobileActiveTab === 'sandbox' ? { backgroundColor: theme.primaryGlow, borderColor: theme.primary } : { borderColor: 'transparent' }]}
              onPress={() => setMobileActiveTab('sandbox')}
            >
              <Text style={[styles.mobileTabText, { color: mobileActiveTab === 'sandbox' ? theme.primary : theme.textMuted }]}>
                🛠️ Dev Tools
              </Text>
            </TouchableOpacity>
          </View>

          {/* Render Active View directly inside phone viewport without thick shells */}
          {mobileActiveTab === 'app' ? (
            <View style={styles.mobileViewArea}>
              
              {/* App screen viewport */}
              <View style={styles.phoneRouterBody}>
                {renderAppScreen()}
              </View>

              {/* Bottom Nav Bar */}
              <View style={[styles.phoneBottomNav, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('onboarding')}>
                  <Text style={{ fontSize: 16 }}>📋</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'onboarding' ? theme.primary : theme.textMuted }]}>Onboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('feed')}>
                  <Text style={{ fontSize: 16 }}>🎬</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'feed' ? theme.primary : theme.textMuted }]}>Feed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('dashboard')}>
                  <Text style={{ fontSize: 16 }}>📊</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'dashboard' ? theme.primary : theme.textMuted }]}>Dash</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setAppScreen('tutor')}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                  <Text style={[styles.navLabel, { color: appScreen === 'tutor' ? theme.primary : theme.textMuted }]}>Tutor</Text>
                </TouchableOpacity>
              </View>

            </View>
          ) : (
            /* Dev tools directly full screen */
            <View style={styles.mobileDevSandboxArea}>
              {renderDevSandbox()}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 13,
    marginRight: 8,
    fontWeight: '600',
  },
  desktopWorkspace: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopLeftPanel: {
    width: 380,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    paddingVertical: 12,
  },
  desktopRightPanel: {
    flex: 1,
    padding: 16,
  },
  workspaceSubheading: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  phoneShell: {
    width: 330,
    height: 580,
    borderRadius: 36,
    borderWidth: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  phoneNotchRow: {
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  phoneNotchTime: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  phoneNotchSpeaker: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#374151',
  },
  phoneNotchIcons: {
    flexDirection: 'row',
  },
  progressBarWrapper: {
    height: 3,
    width: '100%',
    position: 'relative',
  },
  progressBarGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
  },
  phoneRouterBody: {
    flex: 1,
    position: 'relative',
  },
  phoneBottomNav: {
    height: 54,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  mobileWorkspace: {
    flex: 1,
  },
  mobileHeaderTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  mobileTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mobileViewArea: {
    flex: 1,
  },
  mobileDevSandboxArea: {
    flex: 1,
    padding: 16,
  },
  appScreenScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  screenHeroTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  screenHeroDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  goalGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  glassTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  glassTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  glassTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  experienceGroup: {
    marginBottom: 24,
  },
  experienceTabs: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  expTabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  appPrimaryBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appPrimaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedScreenSurface: {
    flex: 1,
    position: 'relative',
  },
  feedMediaBox: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  videoOverlayGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9,
  },
  videoDetailsOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 14,
    right: 70,
    gap: 6,
  },
  videoTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  videoTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  videoAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  videoDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  feedSidebar: {
    position: 'absolute',
    right: 12,
    bottom: 30,
    alignItems: 'center',
    gap: 16,
  },
  sidebarAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  sidebarAction: {
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  swipeTriggerOverlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  swipeTriggerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  dashboardStatsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardStatsLeft: {
    flex: 1,
    paddingRight: 8,
  },
  dashboardLevel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardSub: {
    fontSize: 11,
    marginTop: 2,
  },
  dashboardStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  svgWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  svgCenterContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgPercentText: {
    fontWeight: '900',
  },
  svgSubtext: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  accordionItem: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  accordionBody: {
    borderTopWidth: 1,
    padding: 12,
  },
  accordionText: {
    fontSize: 12,
    lineHeight: 16,
  },
  smallActionBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  quizModalBox: {
    marginTop: 14,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
  },
  quizQuestion: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
    marginBottom: 12,
  },
  quizAnswersRow: {
    gap: 8,
  },
  quizAnswerBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  quizAnswerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quizScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  quizResultText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tutorScreenContainer: {
    flex: 1,
  },
  tutorHeaderBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  tutorTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  presetTopicBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  chatScroll: {
    flex: 1,
    padding: 12,
  },
  chatBubbleContainer: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  userBubbleAlign: {
    alignSelf: 'flex-end',
  },
  aiBubbleAlign: {
    alignSelf: 'flex-start',
  },
  chatBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chatText: {
    fontSize: 12,
    lineHeight: 16,
  },
  sourcesContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sourceTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  sourceTagText: {
    fontSize: 8,
    fontWeight: '700',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  chatSendBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  sandboxTabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  sandboxTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sandboxTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  controlDescription: {
    fontSize: 13,
    lineHeight: 16,
  },
  controlRow: {
    marginVertical: 8,
  },
  controlRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  controlBtnScroll: {
    flexDirection: 'row',
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewWrapper: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  previewArea: {
    minHeight: 200,
    width: '100%',
  },
  mockCard: {
    padding: 14,
    borderRadius: 10,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mockCardIndex: {
    fontSize: 18,
    fontWeight: '900',
  },
  mockCardText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  guidelineOverlay: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    opacity: 0.4,
  },
  animationShowcaseBox: {
    alignItems: 'center',
    paddingVertical: 18,
    gap: 16,
  },
  springBadge: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  springBadgeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  springBadgeText: {
    fontSize: 15,
    fontWeight: '900',
  },
  primaryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 240,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rotateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jsonBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  jsonText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  tableSchemaBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  tableHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tableField: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
    fontWeight: '600',
  },

  // Clerk / Auth header additions
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
    maxWidth: 90,
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  primaryBorder: {
    borderColor: 'rgba(99,102,241,0.4)',
  },
  signOutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
});
