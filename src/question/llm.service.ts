import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import * as https from 'https';
import { FeedbackContext } from '../feedback/feedback.service';

export interface GeneratedMCQ {
  questionText: string;
  options: { key: string; value: string }[];
  correctAnswer: string;
  explanation: string;
  questionType?: string;
  imageUrl?: string;
  imagePrompt?: string;
  imageDescription?: string;
  patternData?: { shape: string; color: string; size: string }[];
  chartData?: { title: string; yLabel: string; bars: { label: string; value: number }[] };
  clockData?: { hours: number; minutes: number; label?: string };
  scaleData?: { left: { items: { name: string; weight: number; emoji?: string }[] }; right: { items: { name: string; weight: number; emoji?: string }[] } };
}

const IMAGE_QUESTION_TYPES = ['observation', 'visual-reasoning', 'image-pattern', 'image-data', 'image-clock', 'image-scale'];

const QUESTION_TYPE_PROMPTS: Record<string, string> = {
  'scenario': `QUESTION TYPE: Scenario Based
Create a real-life situation relevant to Indian students (school, market, home, farm, festival, travel).
The student must APPLY their learning to solve the scenario.
Format: Start with a 2-3 sentence scenario, then ask the question.
Example style: "Riya wants to buy 3 notebooks at ₹15 each. She has ₹50. How much change will she get?"`,

  'cause-effect': `QUESTION TYPE: Cause and Effect
Present a situation or event. The student must identify WHAT WILL HAPPEN NEXT or WHY something happened.
Must require reasoning, not just recall.
Format: State the cause/situation clearly, then ask about the effect/reason.
Example style: "Mohan left his iron nail outside during the rainy season for a week. What will most likely happen to the nail?"`,

  'comprehension': `QUESTION TYPE: Reading Comprehension
Write a SHORT passage (4-6 sentences) on a topic related to the competency.
Then ask ONE inferential question — student must UNDERSTAND and INFER, NOT copy from the passage.
BAD question: "What was the name of the river mentioned?" (recall)
GOOD question: "Why did the villagers depend on the river even during summer?" (inference)
Put the passage in the questionText before the actual question.`,

  'pattern': `QUESTION TYPE: Pattern Recognition
Create a number sequence, shape pattern, or logical series.
The student must identify the rule and find the missing element.
For younger grades: simple patterns (2, 4, 6, __, 10)
For higher grades: complex patterns (1, 4, 9, 16, __, 36)
Can also be alphabetical or mixed patterns.
Format: Show the pattern clearly and ask what comes next or what is missing.`,

  'data-interpretation': `QUESTION TYPE: Data Interpretation
Create a small data set presented as a TABLE, TIMETABLE, PRICE LIST, or SIMPLE CHART in text form.
Use markdown table format for the data.
The student must READ and INTERPRET the data to answer.
Topics: school timetable, market prices, temperature data, sports scores, travel time.
The question must require comparison or calculation, not just reading a single cell.
Example: Create a price list of 4 fruits and ask which 2 can be bought within ₹100.`,

  'visual-reasoning': `QUESTION TYPE: Visual Reasoning (Image Based)

STEP 1 — DESIGN THE IMAGE FIRST:
Decide exactly what the image will show. Be very specific about every visible element.
Good image scenes: weighing scale with specific objects, a clock showing an exact time, a thermometer at a specific reading, a ruler measuring an object, a market stall with specific items and prices written on labels, a map with labeled locations and a compass, a playground with specific number of children doing specific activities.

STEP 2 — WRITE THE QUESTION BASED ONLY ON WHAT IS IN THAT IMAGE:
The question must be fully answerable from the image description. Do NOT ask about anything not visible in the image.
The question must require REASONING about what is seen — comparing, deducing, calculating — NOT just naming something visible.

STEP 3 — WRITE imageDescription (shown to students as text below the image):
Write a clear 2-3 sentence description of exactly what is in the image, as if describing it to a blind student. This must match the image perfectly.

IMPORTANT — your JSON must include:
- "imagePrompt": highly specific scene description for image generation, mention exact numbers/colors/positions
- "imageDescription": 2-3 sentences describing the image for the student (matches imagePrompt exactly)
- questionText must say "Look at the image above." at the start`,

  'image-pattern': `QUESTION TYPE: Visual Pattern Recognition (Rendered as SVG)

STEP 1 — DESIGN THE PATTERN FIRST:
Choose a clear visual pattern with exactly 5 elements (4 shown + 1 missing).
Pattern types:
- Shape: circle, square, triangle, rectangle, star, hexagon
- Colors: red, blue, green, orange, purple, yellow
- Size: small, medium, large
Only ONE rule should change per step. Keep it unambiguous.

STEP 2 — WRITE THE QUESTION referencing "the pattern shown above".

STEP 3 — Provide "patternData" as a JSON array of exactly 5 objects.
Each object must have: "shape" (circle/square/triangle/rectangle/star), "color" (red/blue/green/orange/purple/yellow/gray), "size" (small/medium/large).
The 5th element must be: { "shape": "?", "color": "gray", "size": "medium" }

IMPORTANT — your JSON must include:
- "patternData": [ {"shape":"circle","color":"red","size":"medium"}, ... ] — EXACTLY 5 elements
- "imageDescription": describe each element e.g. "1: red circle, 2: blue square, 3: green triangle, 4: red circle, 5: ?"
- Do NOT include "imagePrompt" — the pattern will be drawn as SVG`,

  'image-data': `QUESTION TYPE: Data Interpretation — Bar Chart (Rendered as SVG)

STEP 1 — DEFINE EXACT DATA:
Choose a topic and exactly 4 data points. Keep values as multiples of 5 (Class 3/6) or any integer (Class 9).
Example: Books read — Anita:20, Rohan:15, Priya:25, Suresh:10

STEP 2 — WRITE THE QUESTION using ONLY those exact values.
Good types: highest/lowest, difference, total, comparison.
Format: "Look at the bar chart above. [Question]"

STEP 3 — Provide "chartData" as a JSON object with title and bars array.

IMPORTANT — your JSON must include:
- "chartData": { "title": "Chart title", "yLabel": "unit", "bars": [ {"label":"Anita","value":20}, {"label":"Rohan","value":15}, {"label":"Priya","value":25}, {"label":"Suresh","value":10} ] }
- "imageDescription": full text description of the chart e.g. "Bar chart: Anita=20, Rohan=15, Priya=25, Suresh=10 books"
- Do NOT include "imagePrompt" — the chart will be drawn as SVG`,

  'image-clock': `QUESTION TYPE: Clock Reading (Rendered as SVG)

STEP 1 — DECIDE THE TIME:
Pick a specific time. Use whole or half hours for Class 3. Use any time with 5-minute intervals for Class 6/9.
Examples: 3:00, 7:30, 11:15, 4:45

STEP 2 — WRITE THE QUESTION based ONLY on what can be deduced from that time.
Good questions: What time does the clock show? How many minutes until 5:00? How many hours since school started at 8:00? If the activity takes 45 minutes, what time does it end?
The question must require reasoning or calculation — NOT just reading the time.

STEP 3 — Provide "clockData" with exact hours and minutes.

IMPORTANT — your JSON must include:
- "clockData": { "hours": 3, "minutes": 30, "label": "School Clock" }
- "imageDescription": "The clock shows 3:30. The hour hand points between 3 and 4, and the minute hand points to 6."
- Do NOT include "imagePrompt" — the clock will be drawn as SVG`,

  'image-scale': `QUESTION TYPE: Weighing Scale (Rendered as SVG)

STEP 1 — DECIDE WHAT IS ON EACH PAN:
Put 1-2 objects on each side with specific weights. The scale MUST be unbalanced (left heavier OR right heavier) OR balanced — decide first.
Objects: apple (150g), mango (200g), orange (130g), banana (120g), book (300g), stone (500g), bottle (400g), ball (250g)
Use real approximate weights. Keep total values simple.

STEP 2 — WRITE THE QUESTION based on the scale:
Good questions: Which side is heavier? By how much? What weight must be added to balance? Which object weighs more?
Must require comparison or calculation.

STEP 3 — Provide "scaleData" with exact objects and weights on each side.

IMPORTANT — your JSON must include:
- "scaleData": { "left": { "items": [{"name":"apple","weight":150},{"name":"orange","weight":130}] }, "right": { "items": [{"name":"mango","weight":200}] } }
- "imageDescription": "A weighing scale with an apple (150g) and orange (130g) on the left pan, and a mango (200g) on the right pan. The left side is heavier."
- Do NOT include "imagePrompt" — the scale will be drawn as SVG`,

  'observation': `QUESTION TYPE: Observation Based
DESCRIBE a scene, diagram, or visual in vivid text (since we cannot show actual images).
The student must READ the description carefully and OBSERVE details to answer.
Scenes can be: classroom, market, playground, science experiment, map description, clock showing a time, weighing scale with objects.
Format: Start with "Read the description carefully:" then describe the scene in 3-5 sentences with specific details. Then ask an observational question.
Example: "Read the description carefully: A clock shows the hour hand pointing to 3 and the minute hand pointing to 12. There is a school bus in the background. Children are coming out of school gates carrying bags..."`,
};


@Injectable()
export class LlmService {
  constructor(private config: ConfigService) {}

  private buildPrompt(grade: string, subject: string, competency: string, instructions: string, questionType = 'scenario', feedbackContext?: FeedbackContext): string {
    const typePrompt = QUESTION_TYPE_PROMPTS[questionType] ?? QUESTION_TYPE_PROMPTS['scenario'];

    let ragSection = '';
    if (feedbackContext) {
      if (feedbackContext.approvedExamples.length > 0) {
        ragSection += `\n=== APPROVED EXAMPLES (mimic this quality and style) ===\n`;
        ragSection += `These questions were reviewed and APPROVED by human experts. Generate questions of similar quality:\n\n`;
        feedbackContext.approvedExamples.forEach((ex, i) => {
          const optionStr = ex.options.length > 0
            ? ex.options.map(o => `${o.key}) ${o.value}`).join(' | ')
            : '(options not stored)';
          ragSection += `Example ${i + 1}:\n`;
          ragSection += `Question: ${ex.questionText}\n`;
          if (optionStr !== '(options not stored)') ragSection += `Options: ${optionStr}\n`;
          ragSection += `Correct Answer: ${ex.correctAnswer}\n`;
          if (ex.explanation) ragSection += `Explanation: ${ex.explanation}\n`;
          ragSection += `\n`;
        });
      }

      if (feedbackContext.rejectedExamples.length > 0) {
        ragSection += `\n=== AVOID THESE PATTERNS (previously rejected) ===\n`;
        ragSection += `These questions were REJECTED by human experts. Do NOT repeat these mistakes:\n\n`;
        feedbackContext.rejectedExamples.forEach((ex, i) => {
          ragSection += `Bad Example ${i + 1}:\n`;
          ragSection += `Question: ${ex.questionText}\n`;
          if (ex.rejectionReason) ragSection += `Reason rejected: ${ex.rejectionReason}\n`;
          ragSection += `\n`;
        });
      }
    }

    return `You are an expert MCQ question setter for KV (Kendriya Vidyalaya) schools.
You follow the CAMS AI Question Generation Framework and PARAKH/LAT assessment philosophy.

GRADE: ${grade}
SUBJECT: ${subject}
COMPETENCY: ${competency}
ADDITIONAL INSTRUCTIONS: ${instructions || 'None'}
${ragSection}
=== QUESTION TYPE INSTRUCTIONS ===
${typePrompt}

=== CAMS FRAMEWORK RULES (STRICTLY FOLLOW) ===

QUESTION MUST assess one of:
- Understanding, Application, Observation, Comparison, Classification,
  Logical Reasoning, Cause and Effect, Pattern Recognition, Decision Making, Real-Life Problem Solving

QUESTION TYPES ALLOWED (pick the most suitable):
- Cause and Effect: Student identifies a relationship (e.g. "Rohan forgot to water his plant. What is most likely to happen?")
- Scenario Based: Student applies learning to daily life
- Reading Comprehension: Short passage + inferential question (NOT sentence recall)
- Pattern Recognition: Number/shape/visual pattern
- Data Interpretation: Table/calendar/timetable/price list based question

STRICTLY FORBIDDEN:
- Memory recall (definitions, direct facts, textbook sentences, chapter recall)
- Copy-paste textbook wording
- Double negatives or ambiguous language
- Adult vocabulary (use age-appropriate language for ${grade})
- Any question whose answer only requires remembering a fact

DISTRACTOR RULES:
- All 4 options must be plausible and believable
- Wrong options must be from the same category as the correct answer
- BAD example: A. Cat  B. Dog  C. Airplane  D. Elephant
- GOOD example: A. June  B. August  C. September  D. October

GRADE-SPECIFIC RULES:
- Class 3: Simple vocabulary, short sentences, 1-2 reasoning steps, no abstract concepts
- Class 6: Moderate complexity, 2-3 reasoning steps, real-life application
- Class 9: Higher-order thinking, multi-step reasoning, analytical questions

QUALITY CHECKLIST (your question must pass ALL):
✓ Original question (not from textbook)
✓ Competency-based (not memory/recall)
✓ Age-appropriate language
✓ All distractors are plausible
✓ Only ONE correct answer exists
✓ Aligned to the stated competency

=== OUTPUT FORMAT ===
Return ONLY a valid JSON object (no markdown, no extra text).

For TEXT-BASED question types (scenario, cause-effect, comprehension, pattern, data-interpretation, observation):
{
  "questionText": "The full question here",
  "options": [
    { "key": "A", "value": "Option A" },
    { "key": "B", "value": "Option B" },
    { "key": "C", "value": "Option C" },
    { "key": "D", "value": "Option D" }
  ],
  "correctAnswer": "A",
  "explanation": "Why A is correct and the others are not"
}

For VISUAL REASONING (visual-reasoning):
{
  "imagePrompt": "Exact scene description for AI image generation",
  "imageDescription": "2-3 sentences describing the image for the student",
  "questionText": "Look at the image above. [Question based ONLY on image content]",
  "options": [{"key":"A","value":"..."},{"key":"B","value":"..."},{"key":"C","value":"..."},{"key":"D","value":"..."}],
  "correctAnswer": "A",
  "explanation": "Explain using exact image elements"
}

For VISUAL PATTERN (image-pattern) — NO imagePrompt, pattern is drawn as SVG:
{
  "patternData": [{"shape":"circle","color":"red","size":"medium"},{"shape":"square","color":"blue","size":"medium"},{"shape":"triangle","color":"green","size":"medium"},{"shape":"circle","color":"red","size":"medium"},{"shape":"?","color":"gray","size":"medium"}],
  "imageDescription": "1: red circle, 2: blue square, 3: green triangle, 4: red circle, 5: ?",
  "questionText": "Look at the pattern above. What shape and color should replace the question mark?",
  "options": [{"key":"A","value":"..."},{"key":"B","value":"..."},{"key":"C","value":"..."},{"key":"D","value":"..."}],
  "correctAnswer": "A",
  "explanation": "The pattern repeats every 3 shapes..."
}

For CLOCK (image-clock) — NO imagePrompt, clock is drawn as SVG:
{
  "clockData": {"hours":3,"minutes":30,"label":"School Clock"},
  "imageDescription": "The clock shows 3:30. Hour hand between 3 and 4, minute hand at 6.",
  "questionText": "Look at the clock above. [Question about the time]",
  "options": [{"key":"A","value":"..."},{"key":"B","value":"..."},{"key":"C","value":"..."},{"key":"D","value":"..."}],
  "correctAnswer": "A",
  "explanation": "The clock shows 3:30..."
}

For WEIGHING SCALE (image-scale) — NO imagePrompt, scale is drawn as SVG:
{
  "scaleData": {"left":{"items":[{"name":"apple","weight":150,"emoji":"🍎"},{"name":"orange","weight":130,"emoji":"🍊"}]},"right":{"items":[{"name":"mango","weight":200,"emoji":"🥭"}]}},
  "imageDescription": "Scale with apple+orange (280g) on left, mango (200g) on right. Left is heavier by 80g.",
  "questionText": "Look at the weighing scale above. [Question]",
  "options": [{"key":"A","value":"..."},{"key":"B","value":"..."},{"key":"C","value":"..."},{"key":"D","value":"..."}],
  "correctAnswer": "A",
  "explanation": "Left pan has 280g, right pan has 200g..."
}

For BAR CHART (image-data) — NO imagePrompt, chart is drawn as SVG:
{
  "chartData": {"title":"Books Read by Students","yLabel":"Books","bars":[{"label":"Anita","value":20},{"label":"Rohan","value":15},{"label":"Priya","value":25},{"label":"Suresh","value":10}]},
  "imageDescription": "Bar chart: Anita=20, Rohan=15, Priya=25, Suresh=10 books",
  "questionText": "Look at the bar chart above. [Question]",
  "options": [{"key":"A","value":"..."},{"key":"B","value":"..."},{"key":"C","value":"..."},{"key":"D","value":"..."}],
  "correctAnswer": "A",
  "explanation": "From the chart, Priya read 25 books which is the highest..."
}`;
  }

  private parseResponse(raw: string): GeneratedMCQ {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.options) parsed.options = [];
      return parsed;
    } catch (e) {
      console.error('LLM parse error. Raw response:', raw);
      throw new Error('LLM returned invalid JSON. Please try again.');
    }
  }

  async generateWithGemini(grade: string, subject: string, competency: string, instructions: string, questionType: string, feedbackContext?: FeedbackContext): Promise<GeneratedMCQ> {
    const genAI = new GoogleGenerativeAI(this.config.get('GEMINI_API_KEY') ?? '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(this.buildPrompt(grade, subject, competency, instructions, questionType, feedbackContext));
    const text = result.response.text();
    return this.parseResponse(text);
  }

  async generateWithGroq(grade: string, subject: string, competency: string, instructions: string, questionType: string, feedbackContext?: FeedbackContext): Promise<GeneratedMCQ> {
    const groq = new Groq({ apiKey: this.config.get('GROQ_API_KEY') ?? '' });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: this.buildPrompt(grade, subject, competency, instructions, questionType, feedbackContext) }],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(completion.choices[0].message.content ?? '{}');
  }

  async generateWithOpenAI(grade: string, subject: string, competency: string, instructions: string, questionType: string, feedbackContext?: FeedbackContext): Promise<GeneratedMCQ> {
    const openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: this.buildPrompt(grade, subject, competency, instructions, questionType, feedbackContext) }],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(completion.choices[0].message.content ?? '{}');
  }

  private buildImageUrl(imagePrompt: string): string {
    const encoded = encodeURIComponent(
      `${imagePrompt}, educational illustration, clean white background, simple and clear, suitable for school children, no text`
    );
    return `https://image.pollinations.ai/prompt/${encoded}?width=600&height=400&nologo=true&enhance=false&model=flux`;
  }

  async generate(llm: string, grade: string, subject: string, competency: string, instructions: string, questionType: string, feedbackContext?: FeedbackContext): Promise<GeneratedMCQ> {
    let mcq: GeneratedMCQ;
    switch (llm) {
      case 'gemini': mcq = await this.generateWithGemini(grade, subject, competency, instructions, questionType, feedbackContext); break;
      case 'groq': mcq = await this.generateWithGroq(grade, subject, competency, instructions, questionType, feedbackContext); break;
      case 'openai': mcq = await this.generateWithOpenAI(grade, subject, competency, instructions, questionType, feedbackContext); break;
      default: throw new BadRequestException(`Unknown LLM: ${llm}`);
    }

    if (IMAGE_QUESTION_TYPES.includes(questionType) && mcq.imagePrompt) {
      mcq.imageUrl = this.buildImageUrl(mcq.imagePrompt);
    }

    return mcq;
  }
}
