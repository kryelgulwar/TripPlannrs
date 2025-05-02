import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Package, FileText, LinkIcon } from "lucide-react"

interface TravelTipsProps {
  tips: any[]
}

export function TravelTips({ tips }: TravelTipsProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "Contact":
        return <AlertCircle className="h-5 w-5 text-primary" />
      case "Packing":
        return <Package className="h-5 w-5 text-primary" />
      case "Etiquette":
        return <FileText className="h-5 w-5 text-primary" />
      case "Links":
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
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tip.content.map((item: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
