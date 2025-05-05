"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TableOfContents from "./table-of-contents"
import Chapter1Template from "./chapter-1-template"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export default function DocumentViewer() {
  const [activeTab, setActiveTab] = useState("toc")

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // This is a placeholder - in a real application, you would generate
    // and download a PDF or other document format
    alert("In a real application, this would download the document as a PDF")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Viewer</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="toc">Table of Contents</TabsTrigger>
          <TabsTrigger value="chapter1">Chapter 1: Introduction</TabsTrigger>
        </TabsList>
        <TabsContent value="toc">
          <TableOfContents />
        </TabsContent>
        <TabsContent value="chapter1">
          <Chapter1Template />
        </TabsContent>
      </Tabs>
    </div>
  )
}
