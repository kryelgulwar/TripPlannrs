import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Package, FileText, LinkIcon } from "lucide-react"

interface TravelTipsProps {
  tips: any[]
}

export function TravelTips({ tips }: TravelTipsProps) {
  // Enhanced debug logging
  console.log(
    "TravelTips received:",
    Array.isArray(tips) ? `Array with ${tips.length} items` : `Not an array: ${typeof tips}`,
  )

  if (Array.isArray(tips)) {
    tips.forEach((tip, index) => {
      console.log(`TravelTips - Item ${index}:`, tip ? JSON.stringify(tip) : "null/undefined")
    })
  }

  if (!Array.isArray(tips) || tips.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">No travel tips available.</p>
      </div>
    )
  }

  const getIcon = (category: string) => {
    if (!category) return <FileText className="h-5 w-5 text-primary" />

    switch (category.toLowerCase()) {
      case "contact":
      case "general":
      case "safety":
      case "safety & security":
        return <AlertCircle className="h-5 w-5 text-primary" />
      case "packing":
      case "transportation":
        return <Package className="h-5 w-5 text-primary" />
      case "etiquette":
      case "cultural etiquette":
        return <FileText className="h-5 w-5 text-primary" />
      case "links":
        return <LinkIcon className="h-5 w-5 text-primary" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">Travel Tips & Information</h3>
        <p className="text-muted-foreground">Important information to help you prepare for your trip.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tips.map((tip, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon(tip.category)}
                {tip.title || "Travel Tip"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Array.isArray(tip.content) && tip.content.length > 0 ? (
                  tip.content.map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>No details available</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
