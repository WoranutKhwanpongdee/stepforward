import type { Learner } from "./logic";

const today = new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const people = [
  ["l1","Nicha S.","NS",5,"Needs support","Build confidence speaking English at work.","Practiced a short introduction with a colleague.",2,"I freeze when people speak quickly.","Could we practice a short conversation?"],
  ["l2","Krit P.","KP",4,"On track","Create a simple monthly budget.","Tracked spending for two weeks and found three areas to adjust.",4,"Remembering to log cash purchases.",""],
  ["l3","Mali T.","MT",3,"Urgent","Learn spreadsheet basics for my new role.","I haven't been able to start the lessons this week.",1,"My laptop stopped working and I feel behind.","Can someone help me find a way to catch up?"],
  ["l4","Arun W.","AW",5,"On track","Finish a personal portfolio website.","Built the homepage and shared it for feedback.",5,"Choosing a color palette.",""],
  ["l5","Pimchanok R.","PR",2,"Needs support","Practice giving clear presentations.","Outlined my talk but haven't practiced aloud yet.",2,"Feeling nervous in front of a group.","A low-pressure practice session would help."],
  ["l6","Thanawat K.","TK",4,"On track","Use English emails confidently.","Wrote and sent two work emails using the template.",4,"Finding the right opening for a new contact.",""],
  ["l7","Suda L.","SL",6,"Completed","Create a weekly study routine that sticks.","Finished my six-week plan and kept a regular schedule.",5,"", ""],
  ["l8","Preecha M.","PM",3,"Needs support","Understand basic project planning.","Started a task list and set a first deadline.",3,"Not sure how to break a large task down.","Could you review my first project plan?"],
  ["l9","Kanya J.","KJ",1,"Urgent","Improve reading confidence in English.","Missed the last two check-ins and haven't opened the reading pack.",1,"Work hours changed unexpectedly.","Please help me make a realistic catch-up plan."],
  ["l10","Chai N.","CN",5,"On track","Learn to speak up in team meetings.","Shared one idea in each of my last three meetings.",4,"I still overthink my wording.",""],
];

export const demoLearners: Learner[] = people.map(([id,name,initials,week,status,goal,progress,confidence,obstacles,request], i) => ({
  id: String(id), name: String(name), initials: String(initials), cohort: "October 2026", week: Number(week), status: status as Learner["status"],
  checkIns: [{ id: `c-${id}`, date: daysAgo(i % 3), goal: String(goal), progress: String(progress), confidence: Number(confidence), obstacles: String(obstacles), request: String(request) }],
  followUps: i % 3 === 0 ? [{ id: `f-${id}`, date: daysAgo(3), action: "Shared a weekly practice plan and checked the first step together.", owner: ["Mook","Beam","Dao"][i % 3], note: "Learner has a clear next action." }] : [],
}));

export const todayISO = today;
