# 🎮 Conversational Pong

**Conversational Pong** is a minimalist arcade game built with p5.js that observes how you play — and talks back.

It’s not just a Pong clone.  
It’s a small machine with a personality.

The game reacts to player behavior through:
- Dialogue
- Motion
- Rhythm
- Sound
- Subtle visual cues

Sometimes it encourages you.  
Sometimes it judges you.  
Sometimes it waits.

---

## 🧠 Core Concept

Conversational Pong is designed as a **living system** rather than a static game.

The game:
- Observes player performance
- Tracks emotional context
- Forms short-term “opinions”
- Communicates back using text, motion, and sound

The goal is to make the game feel like a **quiet arcade machine** — aware, responsive, and slightly playful.

---

## 🎮 Controls

- **Mouse** → Move paddle
- **Click** → Enable sound (required by browser)

There are no menus.  
The game begins when you interact.

---

## 🧩 Systems Overview

The project is structured around **clear separation of concerns**.

### `game/`
Core game entities and state:
- Ball
- Paddle
- Score & miss tracking

### `systems/`
Behavioral and sensory logic:
- **EmotionSystem** — tracks emotional state (calm, encouraging, sarcastic, tense)
- **DialogueSystem** — context-aware dialogue with cooldowns and memory
- **JuiceSystem** — screen shake, hit-stop, camera motion
- **SoundSystem** — minimal audio feedback and lifecycle control

### `ui/`
Pure rendering logic:
- Dialogue layer
- HUD
- Title & attract-mode presentation
- Subtle lo-fi / arcade visual effects

### `config.js`
Centralized tuning values for:
- UI layout
- Physics
- Motion feel
- Juice intensity

### `sketch.js`
The orchestrator:
- Connects systems together
- Handles the p5.js lifecycle
- Contains no heavy logic of its own

---

## 🎨 Visual & Interaction Design

Design goals:
- Minimalist arcade aesthetic
- High contrast and clarity
- Subtle motion over flashy effects
- Calm, lo-fi presentation

UI features:
- Dedicated dialogue panel
- Hardware-style title label
- Idle attract-mode animation
- Emotion-based color shifts
- Scanlines and vignette for texture

All effects are intentionally restrained to avoid interfering with gameplay.

---

## 🔊 Sound Design

Sound is minimal and purposeful:
- Paddle hits
- Wall bounces
- Miss feedback
- Dialogue blips

Audio reacts to game events but never overwhelms the player.

Sound is unlocked on first click to comply with browser policies.

---

## 🧠 Design Philosophy

- **Systems over scripts**
- **Behavior over features**
- **Restraint over spectacle**
- **Clarity over cleverness**

The game is intentionally small, focused, and replayable in short sessions.

---

## 🛠 Tech Stack

- **p5.js**
- **p5.sound.js**
- **JavaScript (ES Modules)**
- **HTML / CSS**
- **Git & GitHub**

No frameworks.  
No external APIs.  
Browser-native.

---

## ✨ Why This Project Exists

This project explores how **game feel, UI, and simple AI-like systems** can create personality without complex technology.

It’s an experiment in:
- Expressive systems
- Human-machine interaction
- Minimalist game design

---

## 📌 Author

Built as a creative technology and game design exercise.

Feel free to fork, remix, or experiment.



