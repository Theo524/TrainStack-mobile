export const workoutFocusOptions = [
  "Push",
  "Pull",
  "Legs",
  "Core",
  "Full Body",
  "Speed",
  "Stamina",
  "Football",
  "Planche",
  "Handstand",
  "L-sit",
  "Mobility",
  "Custom",
];

export function buildWorkoutSuggestion({ focus }) {
  const suggestions = {
    Push: [
      "Warm-up 5 min",
      "Push-ups 4x12",
      "Pike push-ups 3x8",
      "Dips 3x8",
      "Diamond push-ups 3x10",
      "Shoulder taps 3x20",
      "Cooldown stretch 5 min",
    ],

    Pull: [
      "Warm-up 5 min",
      "Pull-ups 4x6",
      "Rows 4x10",
      "Chin-ups 3x8",
      "Dead hang 3x30s",
      "Reverse snow angels 3x12",
      "Cooldown stretch 5 min",
    ],

    Legs: [
      "Warm-up 5 min",
      "Bodyweight squats 4x15",
      "Walking lunges 3x12 each leg",
      "Bulgarian split squats 3x8 each leg",
      "Calf raises 4x20",
      "Wall sit 3x45s",
      "Cooldown stretch 5 min",
    ],

    Core: [
      "Warm-up 5 min",
      "Plank 3x45s",
      "Leg raises 4x10",
      "Hollow body hold 4x20s",
      "Russian twists 3x20",
      "Side plank 3x30s each side",
      "Cooldown stretch 5 min",
    ],

    "Full Body": [
      "Warm-up 5 min",
      "Push-ups 3x12",
      "Squats 3x15",
      "Rows 3x10",
      "Lunges 3x10 each leg",
      "Plank 3x45s",
      "Cooldown stretch 5 min",
    ],

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
      "Steady run 12 min",
      "Tempo run 4x3 min",
      "Rest walk 90s between rounds",
      "Easy jog 5 min",
      "Cooldown walk 5 min",
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

    Planche: [
      "Wrist warm-up 5 min",
      "Scapula push-ups 3x12",
      "Planche leans 5x15s",
      "Tuck planche holds 5x8s",
      "Pseudo planche push-ups 4x8",
      "L-sit support hold 4x15s",
      "Cooldown wrist stretch 5 min",
    ],

    Handstand: [
      "Wrist warm-up 5 min",
      "Shoulder mobility 5 min",
      "Wall handstand hold 5x20s",
      "Wall walks 4x3",
      "Shoulder taps 4x10",
      "Balance attempts 10 min",
      "Cooldown stretch 5 min",
    ],

    "L-sit": [
      "Wrist warm-up 3 min",
      "Support hold 4x20s",
      "Tuck L-sit 5x10s",
      "One-leg L-sit 4x8s each side",
      "Leg raises 4x10",
      "Compression lifts 3x12",
      "Cooldown stretch 5 min",
    ],

    Mobility: [
      "Neck and shoulder circles 2 min",
      "Hip openers 4 min",
      "Hamstring stretch 3x30s",
      "Couch stretch 3x30s each side",
      "Deep squat hold 3x45s",
      "Light breathing cooldown 3 min",
    ],

    Custom: [
      "Warm-up 5 min",
      "Main exercise 4x8-12",
      "Second exercise 3x10",
      "Accessory exercise 3x12",
      "Core or stability work 3 rounds",
      "Cooldown stretch 5 min",
    ],
  };

  const exercises = suggestions[focus] || suggestions.Custom;

  return {
    name: `${focus} Session`,
    exercises: exercises.join("\n"),
  };
}