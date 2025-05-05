import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Globe, Utensils, Umbrella, CreditCard, Phone } from "lucide-react"

interface TravelTipsProps {
  itinerary: any
}

export function TravelTips({ itinerary }: TravelTipsProps) {
  // Ensure tips is an array and has content
  const tips = itinerary.travelTips || []

  // Fallback tips if none are provided
  const fallbackTips = [
    {
      category: "Local Customs",
      icon: <Globe className="h-5 w-5" />,
      tips: [
        "Research local customs and etiquette before your trip",
        "Learn a few basic phrases in the local language",
      ],
    },
    {
      category: "Food & Drink",
      icon: <Utensils className="h-5 w-5" />,
      tips: [
        "Try local specialties and street food from vendors with long lines",
        "Carry a reusable water bottle and check if tap water is safe to drink",
      ],
    },
    {
      category: "Weather Preparation",
      icon: <Umbrella className="h-5 w-5" />,
      tips: ["Check the weather forecast before packing", "Bring layers regardless of season"],
    },
    {
      category: "Money & Payments",
      icon: <CreditCard className="h-5 w-5" />,
      tips: [
        "Notify your bank of travel plans to prevent card blocks",
        "Carry some local currency for small purchases",
      ],
    },
    {
      category: "Emergency Contacts",
      icon: <Phone className="h-5 w-5" />,
      tips: ["Save local emergency numbers in your phone", "Keep a digital and physical copy of important documents"],
    },
    {
      category: "Health & Safety",
      icon: <AlertCircle className="h-5 w-5" />,
      tips: ["Pack a basic first aid kit with essential medications", "Research common scams in your destination"],
    },
  ]

  const displayTips = tips.length > 0 ? tips : fallbackTips

  return (
    <div className="space-y-6">
      {displayTips.map((tipCategory: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              {tipCategory.icon}
              <span className="ml-2">{tipCategory.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tipCategory.tips.map((tip: string, tipIndex: number) => (
                <li key={tipIndex} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
