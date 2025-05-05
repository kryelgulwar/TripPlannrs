export default function TableOfContents() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="border p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Table of Contents</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Chapter 1 Introduction</h2>
            <div className="ml-4 space-y-2">
              <div className="flex justify-between">
                <span>1.1 Introduction</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span>1.2 Purpose</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span>1.3 Objectives</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span>1.4 Interface</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span>1.5 Design and Implementation Constraints</span>
                <span>2</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Chapter 2 [Chapter Title]</h2>
            <div className="ml-4 space-y-2">
              <div className="flex justify-between">
                <span>2.1 [Section Title]</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span>2.2 [Section Title]</span>
                <span>4</span>
              </div>
              {/* Additional sections would go here */}
            </div>
          </div>

          {/* Additional chapters would go here */}
        </div>
      </div>
    </div>
  )
}
