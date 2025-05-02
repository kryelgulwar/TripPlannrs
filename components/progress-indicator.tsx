interface ProgressIndicatorProps {
  currentStep: number
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: "Trip" },
    { number: 2, label: "Who" },
    { number: 3, label: "Budget" },
    { number: 4, label: "Style" },
    { number: 5, label: "Food" },
    { number: 6, label: "Extras" },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-2 flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep >= step.number
                ? "bg-primary text-primary-foreground"
                : "border border-muted-foreground/30 bg-background text-muted-foreground"
            }`}
          >
            {step.number}
          </div>
        ))}

        {/* Progress Line */}
        <div className="absolute top-4 z-[-1] h-0.5 w-full -translate-y-1/2 bg-muted-foreground/30" />
        <div
          className="absolute top-4 z-[-1] h-0.5 -translate-y-1/2 bg-primary transition-all"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`w-16 text-center ${currentStep >= step.number ? "text-foreground" : "text-muted-foreground"}`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}
