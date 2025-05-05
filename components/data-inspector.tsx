"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Code } from "lucide-react"

interface DataInspectorProps {
  data: any
  title?: string
  expanded?: boolean
  maxDepth?: number
}

export function DataInspector({ data, title = "Data Inspector", expanded = false, maxDepth = 3 }: DataInspectorProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [showRaw, setShowRaw] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowRaw(!showRaw)} className="h-7 px-2 text-xs">
              <Code className="mr-1 h-3.5 w-3.5" />
              {showRaw ? "Hide Raw" : "Show Raw"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 px-2 text-xs">
              {isExpanded ? (
                <>
                  <ChevronDown className="mr-1 h-3.5 w-3.5" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronRight className="mr-1 h-3.5 w-3.5" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {showRaw ? (
          <pre className="max-h-96 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
        ) : isExpanded ? (
          <div className="max-h-96 overflow-auto">
            <TreeView data={data} depth={0} maxDepth={maxDepth} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {data === null
              ? "null"
              : data === undefined
                ? "undefined"
                : Array.isArray(data)
                  ? `Array with ${data.length} items`
                  : typeof data === "object"
                    ? `Object with ${Object.keys(data).length} properties`
                    : String(data)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TreeViewProps {
  data: any
  depth: number
  maxDepth: number
  label?: string
}

function TreeView({ data, depth, maxDepth, label }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)

  if (data === null) {
    return (
      <div className="flex items-center py-1 pl-6" style={{ marginLeft: `${depth * 16}px` }}>
        {label && <span className="mr-2 font-medium">{label}:</span>}
        <span className="text-muted-foreground">null</span>
      </div>
    )
  }

  if (data === undefined) {
    return (
      <div className="flex items-center py-1 pl-6" style={{ marginLeft: `${depth * 16}px` }}>
        {label && <span className="mr-2 font-medium">{label}:</span>}
        <span className="text-muted-foreground">undefined</span>
      </div>
    )
  }

  if (typeof data !== "object") {
    return (
      <div className="flex items-center py-1 pl-6" style={{ marginLeft: `${depth * 16}px` }}>
        {label && <span className="mr-2 font-medium">{label}:</span>}
        <span className={typeof data === "string" ? "text-green-500" : "text-blue-500"}>
          {typeof data === "string" ? `"${data}"` : String(data)}
        </span>
      </div>
    )
  }

  if (depth >= maxDepth) {
    return (
      <div className="flex items-center py-1 pl-6" style={{ marginLeft: `${depth * 16}px` }}>
        {label && <span className="mr-2 font-medium">{label}:</span>}
        <span className="text-muted-foreground">
          {Array.isArray(data) ? `Array(${data.length})` : `Object(${Object.keys(data).length})`}
        </span>
      </div>
    )
  }

  const toggleExpand = () => setIsExpanded(!isExpanded)

  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: `${depth * 16}px` }}>
        <div className="flex items-center py-1 pl-6">
          <button onClick={toggleExpand} className="mr-1 flex items-center">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {label && <span className="mr-2 font-medium">{label}:</span>}
          <span className="text-muted-foreground">{`Array(${data.length})`}</span>
        </div>
        {isExpanded && (
          <div>
            {data.map((item, index) => (
              <TreeView key={index} data={item} depth={depth + 1} maxDepth={maxDepth} label={`${index}`} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <div className="flex items-center py-1 pl-6">
        <button onClick={toggleExpand} className="mr-1 flex items-center">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {label && <span className="mr-2 font-medium">{label}:</span>}
        <span className="text-muted-foreground">{`Object(${Object.keys(data).length})`}</span>
      </div>
      {isExpanded && (
        <div>
          {Object.entries(data).map(([key, value]) => (
            <TreeView key={key} data={value} depth={depth + 1} maxDepth={maxDepth} label={key} />
          ))}
        </div>
      )}
    </div>
  )
}
