export const exerciseCategories = [
  "All",
  "Push",
  "Pull",
  "Legs",
  "Core",
  "Speed",
  "Football",
  "Skills",
  "Mobility",
];

export const exerciseLibrary = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "Push",
    level: "Beginner",
    target: "Chest, shoulders, triceps",
    description:
      "A basic upper-body exercise. Keep your body straight, lower your chest, then push back up.",
  },
  {
    id: "diamond-push-ups",
    name: "Diamond Push-ups",
    category: "Push",
    level: "Intermediate",
    target: "Triceps, chest",
    description:
      "A harder push-up variation with your hands close together in a diamond shape.",
  },
  {
    id: "pike-push-ups",
    name: "Pike Push-ups",
    category: "Push",
    level: "Intermediate",
    target: "Shoulders",
    description:
      "A shoulder-focused push-up. Keep your hips high and lower your head toward the floor.",
  },
  {
    id: "dips",
    name: "Dips",
    category: "Push",
    level: "Intermediate",
    target: "Chest, triceps",
    description:
      "Lower and press your body using parallel bars, a bench, or sturdy supports.",
  },

  {
    id: "pull-ups",
    name: "Pull-ups",
    category: "Pull",
    level: "Intermediate",
    target: "Back, biceps",
    description:
      "Hang from a bar and pull your chin above the bar. Use assistance if needed.",
  },
  {
    id: "chin-ups",
    name: "Chin-ups",
    category: "Pull",
    level: "Intermediate",
    target: "Back, biceps",
    description:
      "Like pull-ups, but with palms facing you. Usually a bit easier than pull-ups.",
  },
  {
    id: "rows",
    name: "Rows",
    category: "Pull",
    level: "Beginner",
    target: "Back, rear shoulders",
    description:
      "Pull your chest toward a bar, rings, table edge, or band while keeping your body controlled.",
  },
  {
    id: "dead-hang",
    name: "Dead Hang",
    category: "Pull",
    level: "Beginner",
    target: "Grip, shoulders",
    description:
      "Hang from a bar with straight arms. Great for grip strength and shoulder control.",
  },

  {
    id: "squats",
    name: "Bodyweight Squats",
    category: "Legs",
    level: "Beginner",
    target: "Quads, glutes",
    description:
      "Stand with feet around shoulder width, sit down into a squat, then stand back up.",
  },
  {
    id: "lunges",
    name: "Walking Lunges",
    category: "Legs",
    level: "Beginner",
    target: "Quads, glutes, balance",
    description:
      "Step forward, lower your back knee, then drive back up and repeat on the other leg.",
  },
  {
    id: "bulgarian-split-squats",
    name: "Bulgarian Split Squats",
    category: "Legs",
    level: "Intermediate",
    target: "Quads, glutes",
    description:
      "Put one foot behind you on a bench or chair and squat with the front leg.",
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    category: "Legs",
    level: "Beginner",
    target: "Calves",
    description:
      "Raise your heels off the ground, squeeze your calves, then lower slowly.",
  },

  {
    id: "plank",
    name: "Plank",
    category: "Core",
    level: "Beginner",
    target: "Abs, core stability",
    description:
      "Hold a straight body position on your elbows or hands without letting your hips drop.",
  },
  {
    id: "leg-raises",
    name: "Leg Raises",
    category: "Core",
    level: "Intermediate",
    target: "Lower abs, hip flexors",
    description:
      "Lie down and raise your legs with control. Keep your lower back from arching too much.",
  },
  {
    id: "hollow-body-hold",
    name: "Hollow Body Hold",
    category: "Core",
    level: "Intermediate",
    target: "Abs, full-body tension",
    description:
      "Hold your arms and legs off the floor while keeping your lower back pressed down.",
  },
  {
    id: "russian-twists",
    name: "Russian Twists",
    category: "Core",
    level: "Beginner",
    target: "Obliques",
    description:
      "Sit slightly leaned back and rotate your torso side to side with control.",
  },

  {
    id: "high-knees",
    name: "High Knees",
    category: "Speed",
    level: "Beginner",
    target: "Speed, warm-up",
    description:
      "Run on the spot while driving your knees up quickly. Stay light on your feet.",
  },
  {
    id: "a-skips",
    name: "A-Skips",
    category: "Speed",
    level: "Intermediate",
    target: "Sprint technique",
    description:
      "A sprint drill that trains rhythm, knee drive, and foot placement.",
  },
  {
    id: "acceleration-sprints",
    name: "Acceleration Sprints",
    category: "Speed",
    level: "Intermediate",
    target: "Explosive speed",
    description:
      "Short sprints focused on building speed quickly from a standing start.",
  },
  {
    id: "flying-sprints",
    name: "Flying Sprints",
    category: "Speed",
    level: "Advanced",
    target: "Top speed",
    description:
      "Build up speed first, then sprint through a short fast zone at maximum speed.",
  },

  {
    id: "cone-dribbles",
    name: "Cone Dribbles",
    category: "Football",
    level: "Beginner",
    target: "Ball control",
    description:
      "Dribble through cones using small touches and both feet.",
  },
  {
    id: "change-direction-drills",
    name: "Change of Direction Drills",
    category: "Football",
    level: "Intermediate",
    target: "Agility",
    description:
      "Sprint, cut, turn, and react quickly like you would in a match.",
  },
  {
    id: "tempo-runs",
    name: "Tempo Runs",
    category: "Football",
    level: "Intermediate",
    target: "Match stamina",
    description:
      "Controlled running intervals that build football fitness without full sprinting.",
  },
  {
    id: "short-sprints",
    name: "Short Sprints",
    category: "Football",
    level: "Beginner",
    target: "Acceleration",
    description:
      "Repeated 10m to 30m sprints for match sharpness and quick bursts.",
  },

  {
    id: "planche-leans",
    name: "Planche Leans",
    category: "Skills",
    level: "Intermediate",
    target: "Shoulders, wrists, core",
    description:
      "Lean your shoulders forward past your hands while keeping strong straight arms.",
  },
  {
    id: "tuck-planche-hold",
    name: "Tuck Planche Hold",
    category: "Skills",
    level: "Advanced",
    target: "Planche strength",
    description:
      "Hold your body off the floor with knees tucked. This is a hard skill move.",
  },
  {
    id: "wall-handstand",
    name: "Wall Handstand Hold",
    category: "Skills",
    level: "Intermediate",
    target: "Shoulders, balance",
    description:
      "Hold a handstand position against a wall while keeping your body tight.",
  },
  {
    id: "l-sit",
    name: "L-Sit",
    category: "Skills",
    level: "Intermediate",
    target: "Core, hip flexors, triceps",
    description:
      "Support your body with straight arms while holding your legs out in front.",
  },

  {
    id: "hip-openers",
    name: "Hip Openers",
    category: "Mobility",
    level: "Beginner",
    target: "Hips",
    description:
      "Controlled mobility movements to loosen the hips before or after training.",
  },
  {
    id: "hamstring-stretch",
    name: "Hamstring Stretch",
    category: "Mobility",
    level: "Beginner",
    target: "Hamstrings",
    description:
      "Stretch the back of your legs gently without bouncing.",
  },
  {
    id: "couch-stretch",
    name: "Couch Stretch",
    category: "Mobility",
    level: "Intermediate",
    target: "Hip flexors, quads",
    description:
      "Place one foot behind you on a wall or couch and stretch the front of the hip.",
  },
  {
    id: "deep-squat-hold",
    name: "Deep Squat Hold",
    category: "Mobility",
    level: "Beginner",
    target: "Hips, ankles",
    description:
      "Hold the bottom of a squat position while staying relaxed and balanced.",
  },
];