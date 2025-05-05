import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Globe, Utensils, Umbrella, CreditCard, Phone } from "lucide-react"

interface TravelTipsProps {
  tips?: any[]
}

export function TravelTips({ tips = [] }: TravelTipsProps) {
  // Fallback tips if none are provided
  const fallbackTips = [
    {
      category: "Local Customs",
      icon: <Globe className="h-5 w-5" />,
      title: "Local Customs",
      content: [
        "Research local customs and etiquette before your trip",
        "Learn a few basic phrases in the local language",
      ],
    },
    {
      category: "Food & Drink",
      icon: <Utensils className="h-5 w-5" />,
      title: "Food & Drink",
      content: [
        "Try local specialties and street food from vendors with long lines",
        "Carry a reusable water bottle and check if tap water is safe to drink",
      ],
    },
    {
      category: "Weather Preparation",
      icon: <Umbrella className="h-5 w-5" />,
      title: "Weather Preparation",
      content: ["Check the weather forecast before packing", "Bring layers regardless of season"],
    },
    {
      category: "Money & Payments",
      icon: <CreditCard className="h-5 w-5" />,
      title: "Money & Payments",
      content: [
        "Notify your bank of travel plans to prevent card blocks",
        "Carry some local currency for small purchases",
      ],
    },
    {
      category: "Emergency Contacts",
      icon: <Phone className="h-5 w-5" />,
      title: "Emergency Contacts",
      content: [
        "Save local emergency numbers in your phone",
        "Keep a digital and physical copy of important documents",
      ],
    },
    {
      category: "Health & Safety",
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Health & Safety",
      content: ["Pack a basic first aid kit with essential medications", "Research common scams in your destination"],
    },
  ]

  const displayTips = tips.length > 0 ? tips : fallbackTips

  // Helper function to get icon based on category
  const getIconForCategory = (category: string) => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes("local") || lowerCategory.includes("custom")) {
      return <Globe className="h-5 w-5" />
    } else if (lowerCategory.includes("food") || lowerCategory.includes("drink") || lowerCategory.includes("cuisine")) {
      return <Utensils className="h-5 w-5" />
    } else if (lowerCategory.includes("weather") || lowerCategory.includes("climate")) {
      return <Umbrella className="h-5 w-5" />
    } else if (
      lowerCategory.includes("money") ||
      lowerCategory.includes("payment") ||
      lowerCategory.includes("currency")
    ) {
      return <CreditCard className="h-5 w-5" />
    } else if (
      lowerCategory.includes("emergency") ||
      lowerCategory.includes("contact") ||
      lowerCategory.includes("phone")
    ) {
      return <Phone className="h-5 w-5" />
    } else if (
      lowerCategory.includes("health") ||
      lowerCategory.includes("safety") ||
      lowerCategory.includes("security")
    ) {
      return <AlertCircle className="h-5 w-5" />
    }
    return <AlertCircle className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {displayTips.map((tip: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              {tip.icon || getIconForCategory(tip.category || tip.title || "")}
              <span className="ml-2">{tip.title || tip.category || "Travel Tip"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Array.isArray(tip.content) ? (
                tip.content.map((item: string, tipIndex: number) => (
                  <li key={tipIndex} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>No details available</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
