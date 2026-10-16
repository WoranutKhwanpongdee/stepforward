# AI Usage & Decision Log — StepForward

## 1. AI Tools Used

**Tool:** Codex

**Purpose:**
- Brainstormed the problem, the target users and the proposed solution. 
- Made a plan for the functionalities of the application and its working with users. 
- Involved AI in the process of software creation. 
- Reviewed the validation rules, possible edge cases, as well as testing scenarios. 

**Human decisions and responsibilities:**

I identified the target users of the project, developed the pilot project scope and made a decision about the most important functionalities of TIIS project. I am responsible for reviewing the already coded software and testing the application and getting validation results and for documenting all the limitations/problems that may arise during the work on the project.

## 2. Examples of AI-Assisted Work

### Example 1: Problem and Solution Planning

**Prompt:**  
"Help me design a learner progress and support tracking system for a six-week learning program with 60 participants and a three-person support team."

**Output summary:**  
ChatGPT proposed StepForward, a learner progress and support tracking system designed to help a three-person team monitor 60 learners during a six-week program. The proposed system includes learner check-ins, a support dashboard with rule-based prioritization, follow-up management, and learner progress history.

The output also suggested a data model, support statuses, pilot schedule, budget allocation, evaluation metrics, and a prototype scope using Next.js, TypeScript and Tailwind CSS.

**My decision:**  
I selected the core workflow based on the project requirements and kept the implementation small enough to build and test within the available time.

### Example 2: Software Development

**Prompt:**  
"Build a web application called StepForward — a learner progress and support tracking system for a 6-week learning program with 60 participants and a 3-person support team.
Tech stack: Next.js App Router, TypeScript, Tailwind CSS, and localStorage. Use the existing project setup if one already exists.
Core features:
1. Learner check-in form: learning goal, progress update, confidence level (1–5), obstacles, and support request.
2. Support dashboard: display learners, filter by support status, and prioritize follow-up using clear, rule-based criteria.
3. Follow-up management: record support actions, update status, and maintain a history of check-ins and follow-ups.
4. Seed the app with realistic fictional data for 10 learners.
5. Persist changes in localStorage and provide a way to restore demo data.
6. Validate required fields, prevent duplicate submissions, and show clear success and error messages.
7. Responsive, accessible UI that works well on mobile phones and desktop.
Design: Clean, professional, minimal dashboard with clear typography, restrained colors, useful status indicators, and intuitive navigation. Use Thai-friendly UI text where appropriate.
Requirements:
- Make the main workflow functional end-to-end, not just a static mockup.
- Keep the implementation simple and explainable.
- Do not add authentication, external APIs, paid services, or unnecessary AI features.
- Handle corrupted or unavailable localStorage gracefully.
- Add basic automated tests for validation and prioritization logic if time permits.
- Include a README with setup instructions, design decisions, limitations, and test instructions.
- Run the app and relevant tests, fix errors, and report what was actually verified.
- Do not claim tests passed unless they were executed successfully.
Start by inspecting the project environment, then implement the smallest complete working version. Summarize the files created, commands to run, and any remaining issues."

**Output summary:**  
The AI coding tool generated or modified application code for the requested workflow.

**My verification:**  
I ran the application and checked whether the main workflow behaved as expected. Actual test cases and results are documented separately in `docs/test-cases.md`.

## 3. Review and Changes by Humans

AI-generated ideas were seen as potential solutions, not just assumed to be accurate.

In terms of design choice, the system is made not to restrict each student to having just one check-in a day but at the same time must allow legitimate updates to progress while avoiding any potential duplications.

Another limitation imposed onto the prototype is about having only the workflow necessary for helping a student and not introducing any additional features or integrations that might make implementation longer.

## 4. Testing and Limitations

The application must be tested against normal usage and error scenarios, including incomplete input, duplicate submissions, persistence after page reload, and support-request handling.

Only tests that have actually been executed will be reported as passed. Known issues, untested behavior, and limitations will be documented honestly.

## 5. Sources and Dependencies

- Next.js documentation: https://nextjs.org/docs
- TypeScript documentation: https://www.typescriptlang.org/docs/
- Tailwind CSS documentation: https://tailwindcss.com/docs