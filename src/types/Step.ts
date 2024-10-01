
export type Story = {
   chapitres: Step[]
}

export type Step = {
   identifiant: string
   image: string
   perso: string
   texte: string
   options: Option[]
}

export type Option = {
   question: string
   vers: string
   condition: Condition[]
   consequence: Consequence[]

   [key: string]: any;
}

export type Consequence = [string, boolean]
export type Condition = [string, boolean]