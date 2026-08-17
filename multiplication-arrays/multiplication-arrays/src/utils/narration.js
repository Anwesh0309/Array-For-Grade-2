import { say, ask, cheer, emphasize, think, encourage, instruct } from './audio.js';

// ── Wonder Phase ─────────────────────────────────────────────────────────────
export function wonderNarration() {
  return [
    say("Welcome, young mathematician! I am LearnFlow, your learning companion."),
    think("Imagine this... It is morning at school. The lunch lady is arranging muffins on a tray."),
    say("She places 3 rows of muffins, with 4 muffins in each row."),
    ask("Can you figure out how many muffins there are in all, without counting one by one?"),
    emphasize("That is the magic of arrays! Rows and columns help us multiply!"),
    say("Get ready to discover how arrays make multiplication easy and fun!"),
  ];
}

// ── Story Phase ───────────────────────────────────────────────────────────────
export function storyNarration() {
  return [
    say("Let me tell you about Ryan. Ryan is a second grade student at Maplewood Elementary School."),
    say("One day, his teacher asked him to help set up chairs in the gym for an assembly."),
    say("Ryan placed 4 rows of chairs, with 5 chairs in each row."),
    ask("Ryan wondered: how many chairs did he set up in all?"),
    emphasize("Ryan looked carefully. He saw 4 rows, each with 5 chairs."),
    say("He wrote it as a multiplication sentence: 4 times 5 equals 20."),
    say("The chairs were arranged in an array! An array has equal rows and equal columns."),
    emphasize("Rows go across. Columns go up and down. And rows times columns gives us the total!"),
    say("Ryan counted: 5, 10, 15, 20. Yes! 20 chairs in all. Ryan did it!"),
    cheer("Now YOU will learn to read and build arrays just like Ryan!"),
  ];
}

// ── Simulate Phase ────────────────────────────────────────────────────────────
export function simulateStationAIntro() {
  return [
    instruct("Welcome to Station A — the Array Builder!"),
    say("Use the plus and minus buttons to add or remove rows and columns."),
    emphasize("Watch the multiplication sentence update as you build your array!"),
    ask("Can you build an array with 3 rows and 4 columns? What is the total?"),
  ];
}

export function simulateStationBIntro() {
  return [
    instruct("Great work! Now try Station B — the Missing Factor Finder!"),
    say("I will show you an array, but one part is hidden with a question mark."),
    emphasize("Look at the array carefully. How many rows or columns are missing?"),
    say("Type your answer using the number pad and press Check to see if you are right!"),
  ];
}

export function simulateStationCIntro() {
  return [
    instruct("Excellent! You have reached Station C — the Multiplication Sentence!"),
    say("Here you will see a multiplication sentence with one blank to fill in."),
    emphasize("Use what you know about rows and columns to find the missing number!"),
    say("If you need help, tap the hint button to see the array diagram!"),
  ];
}

// ── Reflect Phase ─────────────────────────────────────────────────────────────
export function reflectNarration() {
  return [
    cheer("Amazing work today! You have completed the entire lesson on arrays!"),
    say("You learned that an array is a group of objects arranged in equal rows and columns."),
    emphasize("Rows go across. Columns go down. Rows times columns equals the total."),
    say("You also discovered that multiplication is just a fast way to count equal groups!"),
    ask("Before we finish, take a moment to think about what you learned today."),
    encourage("Tell me one thing that surprised you, or one thing you found tricky. I am here to help!"),
  ];
}

// ── Question narration ────────────────────────────────────────────────────────
export function getQuestionNarration(question) {
  if (!question) return [];
  return [ask(question.questionText)];
}

export function getCorrectNarration(explanation) {
  return [cheer("That is correct! Fantastic work!"), say(explanation)];
}

export function getWrongNarration() {
  return [encourage("Not quite! Let us try again. Count the rows and columns carefully.")];
}

export function getHint1Narration(hint1) { return [think(hint1)]; }
export function getHint2Narration(hint2) { return [say(hint2)]; }

export function getExplanationNarration(explanation) {
  return [say("Here is the answer and explanation."), emphasize(explanation)];
}

export function getBadgeNarration(badgeLabel) {
  return [cheer(`Congratulations! You have earned the ${badgeLabel} badge!`)];
}

export function getStreakNarration(streak) {
  return [cheer(`Wow! You are on a ${streak} answer streak! Keep it up!`)];
}

export function getWorldCompleteNarration(world, stars) {
  const starText = stars === 3 ? "three stars" : stars === 2 ? "two stars" : "one star";
  return [cheer(`You completed ${world}! You earned ${starText}! Well done!`)];
}
