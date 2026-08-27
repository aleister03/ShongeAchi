export const VISIT_QUESTIONS = [
  { id: "q1", category: "Overall condition", prompt: "How does the elder appear to be feeling today compared with their usual condition?",
    type: "choice", options: ["Better than usual", "About the same", "Worse than usual"] },
  { id: "q2", category: "Overall condition", prompt: "Has the elder reported or shown any new physical discomfort or difficulty?",
    type: "choice", options: ["No", "Yes"], detail: true },

  { id: "q3", category: "Daily functioning", prompt: "Has the elder been able to carry out their usual daily activities?",
    type: "choice", options: ["Fully", "Partially", "Not able to"] },
  { id: "q4", category: "Daily functioning", prompt: "Has the elder experienced any noticeable difficulty with movement or independence?",
    type: "choice", options: ["No", "Yes"], detail: true },
  { id: "q4b", category: "Daily functioning", prompt: "Has the elder taken their medication as prescribed?",
    type: "choice", options: ["Yes", "Partially", "No"] }, // added — not in your original list, drop if unwanted

  { id: "q5", category: "Food, sleep, and routine", prompt: "Has the elder been eating and drinking normally?",
    type: "choice", options: ["Yes, normally", "Somewhat reduced", "Poor intake"] },
  { id: "q6", category: "Food, sleep, and routine", prompt: "Has the elder's sleep or daily routine changed noticeably?",
    type: "choice", options: ["No change", "Yes"], detail: true },

  { id: "q7", category: "Emotional wellbeing", prompt: "How does the elder appear emotionally during the visit?",
    type: "choice", options: ["Cheerful / positive", "Neutral / calm", "Withdrawn", "Distressed / anxious"] },
  { id: "q8", category: "Emotional wellbeing", prompt: "Has the elder shown any noticeable change in mood, behavior, communication, or engagement?",
    type: "choice", options: ["No", "Yes"], detail: true },

  { id: "q9", category: "Social and lifestyle", prompt: "Has the elder interacted with family, friends, caregivers, or others since the previous visit?",
    type: "choice", options: ["Yes", "No", "Unknown"], detail: true },
  { id: "q10", category: "Social and lifestyle", prompt: "Has the elder participated in their usual activities or interests?",
    type: "choice", options: ["Yes, as usual", "Less than usual", "Not at all"] },

  { id: "q11", category: "Environment and support", prompt: "Does the elder's living environment appear safe and suitable for their current needs?",
    type: "choice", options: ["Yes", "Some concerns", "No"], detail: true },
  { id: "q12", category: "Environment and support", prompt: "Does the elder appear to have the necessary support and basic necessities?",
    type: "choice", options: ["Yes", "Some gaps", "No"], detail: true },

  { id: "q13", category: "Change detection", prompt: "What is the most noticeable change, if any, since the previous visit?",
    type: "text" },
  { id: "q14", category: "Change detection", prompt: "Did the checker observe anything that may require follow-up or attention?",
    type: "choice", options: ["No", "Yes"], detail: true }
];