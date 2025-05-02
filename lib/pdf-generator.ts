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

  // Define colors - using the blue to purple gradient colors
  const primaryColor = [59, 130, 246] // Blue-500
  const secondaryColor = [139, 92, 246] // Purple-500
  const textColor = [51, 51, 51] // Dark gray for text
  const lightGray = [249, 250, 251] // Very light gray for subtle backgrounds

  // Helper functions
  const addHeader = (y: number) => {
    // Add logo and title
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")

    // Create gradient effect for the title by using multiple colors
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text("TRIP", 20, y)

    const tripWidth = doc.getTextWidth("TRIP")
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text("PLANNRS", 20 + tripWidth, y)

    // Add divider line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, y + 5, 190, y + 5)

    return y + 15
  }

  const addSection = (title: string, y: number) => {
    // Add section title
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(title, 20, y)

    // Add subtle line under section title
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setLineWidth(0.3)
    doc.line(20, y + 3, 190, y + 3)

    return y + 10
  }

  const addField = (label: string, value: string, x: number, y: number, addLink?: { url: string; text: string }) => {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(`${label}:`, x, y)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    if (addLink) {
      // Regular text before the link
      const valueWithoutLink = value.replace(addLink.text, "")
      doc.text(valueWithoutLink, x + 35, y)

      // Add the link
      const linkX = x + 35 + doc.getTextWidth(valueWithoutLink)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text(addLink.text, linkX, y)
      doc.link(linkX, y - 5, doc.getTextWidth(addLink.text), 5, { url: addLink.url })

      // Reset text color
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
    } else {
      doc.text(value, x + 35, y)
    }

    return y + 6
  }

  // Start PDF generation
  let y = 20
  y = addHeader(y)

  // Travel Overview Section
  y = addSection("TRAVEL OVERVIEW", y)

  // Add overview content
  y += 5
  y = addField("Destination", itinerary.destination, 20, y)

  const formatDateRange = (start: Date, end: Date) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  }

  y = addField("Travel Dates", formatDateRange(itinerary.startDate, itinerary.endDate), 20, y)
  y = addField("Number of People", `${itinerary.travelersCount} Travelers`, 20, y)
  y = addField("Group Info", itinerary.travelGroupType, 20, y)

  y += 5

  // Travel Mode Section
  y = addSection("TRAVEL MODE", y)
  y += 5

  // Arrival details
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("ARRIVAL:", 20, y)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  y += 6

  y = addField("Mode", itinerary.travelDetails.arrival.mode, 25, y)
  y = addField("Airline", itinerary.travelDetails.arrival.airline, 25, y)
  y = addField("Departure Time", itinerary.travelDetails.arrival.departureTime, 25, y)
  y = addField("Arrival Time", itinerary.travelDetails.arrival.arrivalTime, 25, y)
  y = addField("Price", itinerary.travelDetails.arrival.price, 25, y)

  // Add Google Maps link for airport
  const airportMapLink = "Google Maps Link"
  y = addField("Airport", `${itinerary.travelDetails.arrival.airport} [${airportMapLink}]`, 25, y, {
    url: itinerary.travelDetails.arrival.mapLink || "https://maps.google.com",
    text: `[${airportMapLink}]`,
  })

  y += 5

  // Departure details
  doc.setFont("helvetica", "bold")
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("DEPARTURE:", 20, y)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  y += 6

  y = addField("Mode", itinerary.travelDetails.departure.mode, 25, y)
  y = addField("Airline", itinerary.travelDetails.departure.airline, 25, y)
  y = addField("Departure Time", itinerary.travelDetails.departure.departureTime, 25, y)
  y = addField("Arrival Time", itinerary.travelDetails.departure.arrivalTime, 25, y)
  y = addField("Price", itinerary.travelDetails.departure.price, 25, y)

  // Add Google Maps link for airport
  y = addField("Airport", `${itinerary.travelDetails.departure.airport} [${airportMapLink}]`, 25, y, {
    url: itinerary.travelDetails.departure.mapLink || "https://maps.google.com",
    text: `[${airportMapLink}]`,
  })

  y += 10

  // Accommodation Options Section
  y = addSection("ACCOMMODATION OPTIONS", y)
  y += 5

  itinerary.accommodations.forEach((accommodation: any, index: number) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage()
      y = 20
      y = addHeader(y)
      y = addSection("ACCOMMODATION OPTIONS (CONTINUED)", y)
      y += 5
    }

    // Add accommodation title
    doc.setFont("helvetica", "bold")
    doc.setTextColor(
      index % 2 === 0 ? primaryColor[0] : secondaryColor[0],
      index % 2 === 0 ? primaryColor[1] : secondaryColor[1],
      index % 2 === 0 ? primaryColor[2] : secondaryColor[2],
    )
    doc.text(`OPTION ${index + 1}: ${accommodation.name}`, 20, y)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    y += 6
    y = addField("Type", accommodation.type, 25, y)
    y = addField("Address", accommodation.address, 25, y)
    y = addField("Price Range", accommodation.priceRange, 25, y)

    // Add Google Maps link
    y = addField("Maps", "[Google Maps Link]", 25, y, {
      url: accommodation.mapLink || "https://maps.google.com",
      text: "[Google Maps Link]",
    })

    y += 5
  })

  // Day-wise Plan Section
  y = addSection("DAY-WISE PLAN", y)
  y += 5

  itinerary.days.forEach((day: any) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage()
      y = 20
      y = addHeader(y)
      y = addSection("DAY-WISE PLAN (CONTINUED)", y)
      y += 5
    }

    // Add day header
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(`DAY ${day.dayNumber}: ${day.title}`, 20, y)

    // Add date
    const dateText = new Date(day.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    doc.setFontSize(10)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(dateText, 190, y, { align: "right" })
    doc.setFontSize(12)

    y += 6

    day.activities.forEach((activity: any, actIndex: number) => {
      // Check if we need a new page
      if (y > 250) {
        doc.addPage()
        y = 20
        y = addHeader(y)
        y = addSection(`DAY ${day.dayNumber} (CONTINUED)`, y)
        y += 5
      }

      // Activity type
      doc.setFont("helvetica", "bold")
      doc.setTextColor(
        actIndex % 2 === 0 ? primaryColor[0] : secondaryColor[0],
        actIndex % 2 === 0 ? primaryColor[1] : secondaryColor[1],
        actIndex % 2 === 0 ? primaryColor[2] : secondaryColor[2],
      )
      doc.text(`${activity.type}:`, 20, y)

      // Activity details
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.text(activity.title, 60, y)

      y += 5
      doc.text(`Time: ${activity.time}`, 25, y)

      y += 5
      // Add Google Maps link
      doc.text("Location:", 25, y)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text(activity.location, 60, y)
      doc.link(60, y - 3, doc.getTextWidth(activity.location), 5, {
        url: activity.mapLink || "https://maps.google.com",
      })
      doc.setTextColor(textColor[0], textColor[1], textColor[2])

      y += 8
    })

    // Add accommodation for the night
    doc.setFont("helvetica", "bold")
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text("Accommodation for the Night:", 20, y)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(day.accommodation.name, 120, y)
    doc.link(120, y - 3, doc.getTextWidth(day.accommodation.name), 5, {
      url: day.accommodation.mapLink || "https://maps.google.com",
    })
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    y += 10
  })

  // Notes Section
  y = addSection("NOTES", y)
  y += 5

  itinerary.tips.forEach((tip: any, index: number) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage()
      y = 20
      y = addHeader(y)
      y = addSection("NOTES (CONTINUED)", y)
      y += 5
    }

    doc.setFont("helvetica", "bold")
    doc.setTextColor(
      index % 2 === 0 ? primaryColor[0] : secondaryColor[0],
      index % 2 === 0 ? primaryColor[1] : secondaryColor[1],
      index % 2 === 0 ? primaryColor[2] : secondaryColor[2],
    )
    doc.text(`${tip.title}:`, 20, y)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    y += 5
    tip.content.forEach((item: string) => {
      // Check if we need a new page
      if (y > 280) {
        doc.addPage()
        y = 20
        y = addHeader(y)
        y = addSection("NOTES (CONTINUED)", y)
        y += 5
      }

      doc.text(`• ${item}`, 25, y)
      y += 5
    })

    y += 5
  })

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Add footer text with link
    doc.setFontSize(10)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])

    const footerText = "Generated by TripPlannrs • www.tripplannrs.com"
    doc.text(footerText, 105, 285, { align: "center" })

    // Add link to website
    const linkWidth = doc.getTextWidth("www.tripplannrs.com")
    const linkStart = 105 + doc.getTextWidth(footerText) / 2 - linkWidth
    doc.link(linkStart, 282, linkWidth, 5, { url: "https://www.tripplannrs.com" })

    // Add page number
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(`Page ${i} of ${pageCount}`, 185, 285, { align: "right" })
  }

  // Return the PDF as a blob
  return doc.output("blob")
}
