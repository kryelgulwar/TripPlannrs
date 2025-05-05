"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Code } from "lucide-react"

interface DataInspectorProps {
  data: any
  title?: string
}

export function DataInspector({ data, title = "Data Inspector" }: DataInspectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="bg-slate-50 dark:bg-slate-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
            <Code className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <pre className="max-h-[500px] overflow-auto rounded bg-slate-100 p-4 text-xs dark:bg-slate-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
