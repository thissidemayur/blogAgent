
export const CREDIT_PACK = {
  starter: {
    id: "starter",
    label: "Starter",
    credit: 5,
    amountInInr: 99,
    amountInPaise: 9900,
    description: "Perfect for trying out the platform",
  },
  pro: {
    id: "pro",
    label: "Pro",
    credit: 15,
    amountInInr: 249,
    amountInPaise: 24900,
    description: "For regular content creators",
  },
  power: {
    id: "power",
    label: "Power",
    credit: 35,
    amountInInr: 499,
    amountInPaise: 49900,
    description: "For agencies and heavy user",
  },
} as const;

export type PackId = keyof typeof CREDIT_PACK
