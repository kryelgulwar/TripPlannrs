"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer } from "lucide-react"

export default function Chapter1Template() {
  const [showPageNumbers, setShowPageNumbers] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chapter 1: Introduction</h1>
          <Button
            variant="outline"
            onClick={() => setShowPageNumbers(!showPageNumbers)}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            {showPageNumbers ? "Hide Page Numbers" : "Show Page Numbers"}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Section 1.1 */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">1.1 Introduction</h2>
              {showPageNumbers && <span className="text-sm text-muted-foreground">Page 1</span>}
            </div>
            <div className="prose max-w-none">
              <p>
                This document provides a comprehensive overview of the [Project/System Name]. It outlines the
                fundamental aspects of the system, including its purpose, objectives, interface design, and
                implementation constraints. This chapter serves as a foundation for understanding the overall scope and
                direction of the project.
              </p>
            </div>
          </section>

          {/* Section 1.2 */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">1.2 Purpose</h2>
              {showPageNumbers && <span className="text-sm text-muted-foreground">Page 1</span>}
            </div>
            <div className="prose max-w-none">
              <p>
                The purpose of this [Project/System] is to address [specific problem or need] by providing [solution
                overview]. This system aims to [primary goal], enabling users to [key functionality]. The document
                serves as a reference for stakeholders, developers, and end-users to understand the system's
                capabilities and limitations.
              </p>
            </div>
          </section>

          {/* Section 1.3 */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">1.3 Objectives</h2>
              {showPageNumbers && <span className="text-sm text-muted-foreground">Page 1</span>}
            </div>
            <div className="prose max-w-none">
              <p>The primary objectives of this system are to:</p>
              <ul>
                <li>Provide [specific functionality or capability]</li>
                <li>Improve [aspect of user experience or efficiency]</li>
                <li>Reduce [pain point or inefficiency]</li>
                <li>Enable [new capability or feature]</li>
                <li>Support [specific user group or use case]</li>
              </ul>
              <p>
                These objectives align with the overall strategic goals of [organization/project] and address the key
                requirements identified during the initial analysis phase.
              </p>
            </div>
          </section>

          {/* Section 1.4 */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">1.4 Interface</h2>
              {showPageNumbers && <span className="text-sm text-muted-foreground">Page 1</span>}
            </div>
            <div className="prose max-w-none">
              <p>
                The system interface is designed to be [intuitive/efficient/accessible], providing users with [key
                interface features]. The interface includes:
              </p>
              <ul>
                <li>User Interface: [Description of UI components and design principles]</li>
                <li>System Interfaces: [Description of how the system interacts with other systems]</li>
                <li>Hardware Interfaces: [Description of any hardware requirements or interactions]</li>
                <li>Software Interfaces: [Description of software dependencies or integrations]</li>
                <li>Communication Interfaces: [Description of communication protocols or methods]</li>
              </ul>
            </div>
          </section>

          {/* Section 1.5 */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">1.5 Design and Implementation Constraints</h2>
              {showPageNumbers && <span className="text-sm text-muted-foreground">Page 2</span>}
            </div>
            <div className="prose max-w-none">
              <p>The development and implementation of this system are subject to the following constraints:</p>
              <ul>
                <li>Technical Constraints: [Specific technical limitations or requirements]</li>
                <li>Regulatory Compliance: [Relevant regulations or standards that must be followed]</li>
                <li>Resource Limitations: [Constraints related to budget, time, or personnel]</li>
                <li>Platform Requirements: [Specific platforms or environments the system must support]</li>
                <li>Security Requirements: [Security constraints or considerations]</li>
                <li>Performance Requirements: [Performance thresholds or expectations]</li>
              </ul>
              <p>
                These constraints have been considered throughout the design process to ensure the system remains
                feasible, compliant, and aligned with organizational capabilities.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
          <p>Document Version: 1.0 | Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </Card>
    </div>
  )
}
