import jsPDF from "jspdf"

export function generatePDF(itinerary: any) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set default font
  doc.setFont("helvetica")

  // Define colors - using professional dark colors
  const primaryColor = [41, 41, 41] // Dark gray
  const secondaryColor = [80, 80, 80] // Medium gray
  const accentColor = [0, 102, 204] // Blue accent
  const textColor = [31, 41, 55] // Gray-800

  // Page dimensions
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // Helper function to format prices (replace rupee symbol with Rs.)
  const formatPrice = (price: string) => {
    if (!price) return "Not specified"
    // Replace ₹ or ¹ with Rs. and ensure there's a space after it
    return price.replace(/[₹¹]/g, "Rs. ")
  }

  // Helper functions
  const addHeader = (y: number) => {
    // Add colored header
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
    doc.rect(0, 0, pageWidth, 25, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("TRIPPLANNRS", margin, 15)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Your personalized travel experience", margin, 22)

    // Add destination and dates on the right
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")

    const destinationText = itinerary.destination || "Travel Itinerary"
    doc.text(destinationText, pageWidth - margin - doc.getTextWidth(destinationText), 15)

    // Format date range
    let dateText = ""
    try {
      const startDate = new Date(itinerary.startDate)
      const endDate = new Date(itinerary.endDate)

      // Ensure dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        dateText = `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
      } else {
        dateText = "Date range not available"
      }
    } catch (e) {
      dateText = "Date range not available"
    }

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), 22)

    return 30 // Return new Y position
  }

  const addSection = (title: string, y: number) => {
    // Add section background
    doc.setFillColor(245, 247, 250) // Very light blue-gray
    doc.rect(margin, y - 5, contentWidth, 10, "F")

    // Add section title
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.text(title, margin + 3, y)

    return y + 8
  }

  const addTwoColumnField = (label1: string, value1: string, label2: string, value2: string, x: number, y: number) => {
    const colWidth = contentWidth / 2 - 5

    // First column
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label1}:`, x, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(value1, x + 25, y)

    // Second column
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label2}:`, x + colWidth, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(value2, x + colWidth + 25, y)

    return y + 6
  }

  const addTwoColumnFieldWithLink = (
    label1: string,
    value1: string,
    link1: string | null,
    label2: string,
    value2: string,
    link2: string | null,
    x: number,
    y: number,
  ) => {
    const colWidth = contentWidth / 2 - 5

    // First column
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label1}:`, x, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Add link if available
    if (link1) {
      doc.setTextColor(0, 0, 255) // Blue color for links
      doc.textWithLink(value1, x + 25, y, { url: link1 })
    } else {
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.text(value1, x + 25, y)
    }

    // Second column
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label2}:`, x + colWidth, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)

    // Add link if available
    if (link2) {
      doc.setTextColor(0, 0, 255) // Blue color for links
      doc.textWithLink(value2, x + colWidth + 25, y, { url: link2 })
    } else {
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.text(value2, x + colWidth + 25, y)
    }

    return y + 6
  }

  const addField = (label: string, value: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label}:`, x, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(value, x + 25, y)

    return y + 5
  }

  const addFieldWithLink = (label: string, value: string, link: string | null, x: number, y: number) => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`${label}:`, x, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)

    if (link) {
      doc.setTextColor(0, 0, 255) // Blue color for links
      doc.textWithLink(value, x + 25, y, { url: link })
    } else {
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.text(value, x + 25, y)
    }

    return y + 5
  }

  // Start PDF generation
  let y = 0
  y = addHeader(y)

  // Travel Overview Section
  y = addSection("TRAVEL OVERVIEW", y)

  // Add overview content in a compact 2-column layout
  y += 5
  const formatDateRange = (start: Date | string, end: Date | string) => {
    try {
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Ensure dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Date range not available"
      }

      return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    } catch (error) {
      return "Date range not available"
    }
  }

  y = addTwoColumnField(
    "Starting Point",
    itinerary.startingPoint || "Not specified",
    "Destination",
    itinerary.destination || "Not specified",
    margin,
    y,
  )

  y = addTwoColumnField(
    "Travel Dates",
    formatDateRange(itinerary.startDate, itinerary.endDate),
    "Group",
    `${itinerary.travelersCount || 1} ${itinerary.travelGroupType || "Travelers"}`,
    margin,
    y,
  )

  // Travel Mode Section
  if (itinerary.travelDetails) {
    y = addSection("TRAVEL DETAILS", y + 4)
    y += 5

    // Arrival details - compact format
    if (itinerary.travelDetails.arrival) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      doc.text("ARRIVAL:", margin, y)
      y += 4

      const arrival = itinerary.travelDetails.arrival

      // First row
      y = addTwoColumnField(
        "Mode",
        arrival.mode || "Not specified",
        "Airline/Company",
        arrival.airline || "Not specified",
        margin + 5,
        y,
      )

      // Second row
      y = addTwoColumnField(
        "Departure",
        arrival.departureTime || "Not specified",
        "Arrival",
        arrival.arrivalTime || "Not specified",
        margin + 5,
        y,
      )

      // Third row
      y = addTwoColumnField("From", arrival.from || "Not specified", "To", arrival.to || "Not specified", margin + 5, y)

      // Fourth row with price and airport
      y = addTwoColumnFieldWithLink(
        "Price",
        formatPrice(arrival.price || "Not specified"),
        null,
        "Airport/Station",
        arrival.airport || "Not specified",
        arrival.mapLink || null,
        margin + 5,
        y,
      )
    }

    // Departure details - compact format
    if (itinerary.travelDetails.departure) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      doc.text("DEPARTURE:", margin, y + 2)
      y += 6

      const departure = itinerary.travelDetails.departure

      // First row
      y = addTwoColumnField(
        "Mode",
        departure.mode || "Not specified",
        "Airline/Company",
        departure.airline || "Not specified",
        margin + 5,
        y,
      )

      // Second row
      y = addTwoColumnField(
        "Departure",
        departure.departureTime || "Not specified",
        "Arrival",
        departure.arrivalTime || "Not specified",
        margin + 5,
        y,
      )

      // Third row
      y = addTwoColumnField(
        "From",
        departure.from || "Not specified",
        "To",
        departure.to || "Not specified",
        margin + 5,
        y,
      )

      // Fourth row with price and airport
      y = addTwoColumnFieldWithLink(
        "Price",
        formatPrice(departure.price || "Not specified"),
        null,
        "Airport/Station",
        departure.airport || "Not specified",
        departure.mapLink || null,
        margin + 5,
        y,
      )
    }
  }

  // Accommodation Options Section - more compact
  if (Array.isArray(itinerary.accommodations) && itinerary.accommodations.length > 0) {
    y = addSection("ACCOMMODATION OPTIONS", y + 4)
    y += 5

    itinerary.accommodations.forEach((accommodation: any, index: number) => {
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage()
        y = addHeader(0)
        y = addSection("ACCOMMODATION OPTIONS (CONTINUED)", y)
        y += 5
      }

      // Add accommodation title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      doc.text(`OPTION ${index + 1}: ${accommodation.name || "Accommodation"}`, margin, y)
      y += 4

      // Two-column layout for accommodation details
      y = addTwoColumnField(
        "Type",
        accommodation.type || "Not specified",
        "Price Range",
        formatPrice(accommodation.priceRange || "Not specified"),
        margin + 5,
        y,
      )

      // Address with map link
      y = addFieldWithLink(
        "Address",
        accommodation.address || "Not specified",
        accommodation.mapLink || null,
        margin + 5,
        y,
      )
      y += 3
    })
  }

  // Day-wise Plan Section - more compact and organized
  if (Array.isArray(itinerary.days) && itinerary.days.length > 0) {
    y = addSection("DAY-WISE PLAN", y + 4)
    y += 5

    itinerary.days.forEach((day: any) => {
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage()
        y = addHeader(0)
        y = addSection("DAY-WISE PLAN (CONTINUED)", y)
        y += 5
      }

      // Add day header with a background
      doc.setFillColor(230, 236, 245) // Very light blue
      doc.rect(margin, y - 3, contentWidth, 6, "F")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text(`DAY ${day.dayNumber}: ${day.title || "Itinerary"}`, margin + 2, y)

      // Add date
      try {
        const dayDate = new Date(day.date)
        // Ensure date is valid
        if (!isNaN(dayDate.getTime())) {
          const dateText = dayDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
          doc.setFontSize(8)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text(dateText, pageWidth - margin - 2 - doc.getTextWidth(dateText), y)
        }
      } catch (error) {
        // If date parsing fails, just continue
      }

      y += 5

      if (Array.isArray(day.activities)) {
        day.activities.forEach((activity: any) => {
          // Check if we need a new page
          if (y > pageHeight - 30) {
            doc.addPage()
            y = addHeader(0)
            y = addSection(`DAY ${day.dayNumber} (CONTINUED)`, y)
            y += 5
          }

          // Activity type
          doc.setFont("helvetica", "bold")
          doc.setFontSize(9)
          doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
          doc.text(`${activity.type || "Activity"}:`, margin, y)

          // Activity title
          doc.setFont("helvetica", "bold")
          doc.setFontSize(9)
          doc.setTextColor(textColor[0], textColor[1], textColor[2])
          doc.text(activity.title || "Activity details", margin + 30, y)

          y += 4

          // Activity details in two columns
          y = addTwoColumnFieldWithLink(
            "Time",
            activity.time || "Not specified",
            null,
            "Location",
            activity.location || "Not specified",
            activity.mapLink || null,
            margin + 5,
            y,
          )
        })
      }

      // Add accommodation for the night in a compact format
      if (day.accommodation) {
        y = addFieldWithLink(
          "Accommodation",
          day.accommodation.name || "Not specified",
          day.accommodation.mapLink || null,
          margin,
          y,
        )
      }

      y += 3 // Space between days
    })
  }

  // Notes Section - more compact with icons
  if (Array.isArray(itinerary.tips) && itinerary.tips.length > 0) {
    y = addSection("TRAVEL TIPS & NOTES", y + 4)
    y += 5

    itinerary.tips.forEach((tip: any) => {
      // Check if we need a new page
      if (y > pageHeight - 30) {
        doc.addPage()
        y = addHeader(0)
        y = addSection("TRAVEL TIPS & NOTES (CONTINUED)", y)
        y += 5
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      doc.text(`${tip.title || "Travel Tip"}:`, margin, y)
      y += 4

      if (Array.isArray(tip.content)) {
        tip.content.forEach((item: string) => {
          // Check if we need a new page
          if (y > pageHeight - 20) {
            doc.addPage()
            y = addHeader(0)
            y = addSection("TRAVEL TIPS & NOTES (CONTINUED)", y)
            y += 5
          }

          doc.setFont("helvetica", "normal")
          doc.setFontSize(8)
          doc.setTextColor(textColor[0], textColor[1], textColor[2])

          // Split long text into multiple lines
          const maxWidth = contentWidth - 10
          const lines = doc.splitTextToSize(item, maxWidth)

          doc.text("-", margin + 2, y)
          doc.text(lines, margin + 6, y)

          y += lines.length * 4
        })
      }

      y += 2 // Space between tips
    })
  }

  // Add a note about map links
  if (doc.getNumberOfPages() > 0) {
    doc.setPage(doc.getNumberOfPages())

    // Check if we need a new page
    if (y > pageHeight - 30) {
      doc.addPage()
      y = addHeader(0)
    } else {
      y += 10
    }

    doc.setFont("helvetica", "italic")
    doc.setFontSize(8)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text("Note: Blue text indicates clickable map links that will open in Google Maps.", margin, y)
  }

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Add footer background
    doc.setFillColor(245, 247, 250) // Very light blue-gray
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F")

    // Add footer text
    doc.setFontSize(8)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])

    const footerText = "Generated by TripPlannrs • www.tripplannrs.com"
    doc.text(footerText, pageWidth / 2, pageHeight - 5, { align: "center" })

    // Add page number
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 5, { align: "right" })
  }

  // Return the PDF as a blob
  return doc.output("blob")
}
