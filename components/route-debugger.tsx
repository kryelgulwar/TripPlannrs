"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code } from "lucide-react"

export function RouteDebugger() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Extract route parameters from pathname
  const segments = pathname.split("/").filter(Boolean)
  const params = segments.reduce(
    (acc, segment, index) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const paramName = segment.slice(1, -1)
        const paramValue = segments[index]
        acc[paramName] = paramValue
      }
      return acc
    },
    {} as Record<string, string>,
  )

  // Convert search params to object
  const queryParams: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    queryParams[key] = value
  })

  return (
    <Card className="bg-slate-50 dark:bg-slate-900 mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
          <Code className="mr-2 h-4 w-4" />
          Route Debugger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Current Path:</h3>
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{pathname}</code>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Route Segments:</h3>
            <div className="flex flex-wrap gap-2">
              {segments.map((segment, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {segment}
                </Badge>
              ))}
            </div>
          </div>

          {Object.keys(params).length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Route Parameters:</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(params, null, 2)}
              </pre>
            </div>
          )}

          {Object.keys(queryParams).length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Query Parameters:</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(queryParams, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
