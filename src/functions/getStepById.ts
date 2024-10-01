import { Step, Story } from "@/types/Step";

export function getStepById(id: string, story: Story): Step {
   if (typeof id !== "string") throw Error("Id is not a string");
   if (Array.isArray(story)) throw Error("Story is not an array");

   const step = story.chapitres.find((step: Step) => step.identifiant === id);
   return step
} 