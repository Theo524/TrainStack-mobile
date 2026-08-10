export const workoutFocusOptions = [
  "Speed",
  "Stamina",
  "Football",
  "Back + Biceps",
  "Chest + Back",
  "Legs",
  "Core",
  "Planche",
  "Handstand",
  "L-sit",
  "Mobility",
];

export const levelOptions = ["Beginner", "Intermediate", "Advanced"];

export const timeOptions = ["20", "30", "45", "60"];

export function buildWorkoutSuggestion({ focus, level, time }) {
  const title = `${focus} Session`;

  const suggestions = {
    Speed: [
      "Warm-up jog 5 min",
      "Dynamic stretches 5 min",
      "A-skips 3x20m",
      "High knees 3x20m",
      "Acceleration sprints 6x20m",
      "Flying sprints 4x30m",
      "Cooldown walk 5 min",
    ],

    Stamina: [
      "Easy jog 8 min",
      "Tempo run 4x4 min",
      "Rest walk 90s between rounds",
      "Steady jog 10 min",
      "Cooldown walk 5 min",
      "Light stretching 5 min",
    ],

    Football: [
      "Warm-up jog 5 min",
      "Dynamic mobility 5 min",
      "Cone dribbles 4 rounds",
      "Short sprints 6x20m",
      "Change of direction drills 5x30s",
      "Tempo runs 6x60m",
      "Cooldown 5 min",
    ],

    "Back + Biceps": [
      "Pull-ups 4x6",
      "Rows 4x10",
      "Chin-ups 3x8",
      "Bicep curls 3x12",
      "Hammer curls 3x12",
      "Dead hang 3x30s",
    ],

    "Chest + Back": [
      "Push-ups 4x12",
      "Pull-ups 4x6",
      "Rows 4x10",
      "Dips 3x8",
      "Wide push-ups 3x12",
      "Dead hang 3x30s",
    ],

    Legs: [
      "Bodyweight squats 4x15",
      "Walking lunges 3x12 each leg",
      "Bulgarian split squats 3x8 each leg",
      "Calf raises 4x20",
      "Wall sit 3x45s",
      "Light stretch 5 min",
    ],

    Core: [
      "Plank 3x45s",
      "Leg raises 4x10",
      "Hollow body hold 4x20s",
      "Russian twists 3x20",
      "Mountain climbers 3x30s",
      "Side plank 3x30s each side",
    ],

    Planche: [
      "Wrist warm-up 5 min",
      "Scapula push-ups 3x12",
      "Planche leans 5x15s",
      "Tuck planche holds 5x8s",
      "Pseudo planche push-ups 4x8",
      "L-sit support hold 4x15s",
    ],

    Handstand: [
      "Wrist warm-up 5 min",
      "Shoulder mobility 5 min",
      "Wall handstand hold 5x20s",
      "Wall walks 4x3",
      "Shoulder taps 4x10",
      "Freestanding balance attempts 10 min",
    ],

    "L-sit": [
      "Wrist warm-up 3 min",
      "Support hold 4x20s",
      "Tuck L-sit 5x10s",
      "One-leg L-sit 4x8s each side",
      "Leg raises 4x10",
      "Compression lifts 3x12",
    ],

    Mobility: [
      "Neck and shoulder circles 2 min",
      "Hip openers 4 min",
      "Hamstring stretch 3x30s",
      "Couch stretch 3x30s each side",
      "Deep squat hold 3x45s",
      "Light breathing cooldown 3 min",
    ],
  };

  let exercises = suggestions[focus] || suggestions.Speed;

  if (level === "Beginner") {
    exercises = exercises.slice(0, 5);
  }

  if (level === "Advanced") {
    exercises = [
      ...exercises,
      "Optional finisher: 3 extra rounds at controlled intensity",
    ];
  }

  if (time === "20") {
    exercises = exercises.slice(0, 4);
  }

  if (time === "60") {
    exercises = [
      ...exercises,
      "Extra technique work 10 min",
      "Long cooldown 8 min",
    ];
  }

  return {
    name: title,
    exercises: exercises.join("\n"),
  };
}