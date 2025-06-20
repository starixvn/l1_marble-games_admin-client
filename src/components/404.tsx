export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center space-y-8 p-6">
        {/* 404 SVG Illustration */}
        <div className="mx-auto w-64 h-64">
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <circle cx="200" cy="150" r="120" fill="currentColor" className="text-muted/20" />

            {/* 404 Text */}
            <text
              x="200"
              y="180"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
              fill="currentColor"
              className="text-primary"
            >
              404
            </text>

            {/* Floating elements */}
            <circle cx="120" cy="80" r="8" fill="currentColor" className="text-primary/60">
              <animate attributeName="cy" values="80;70;80" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle cx="280" cy="100" r="6" fill="currentColor" className="text-primary/40">
              <animate attributeName="cy" values="100;90;100" dur="2.5s" repeatCount="indefinite" />
            </circle>

            <circle cx="320" cy="200" r="4" fill="currentColor" className="text-primary/50">
              <animate attributeName="cy" values="200;190;200" dur="3s" repeatCount="indefinite" />
            </circle>

            <circle cx="80" cy="220" r="5" fill="currentColor" className="text-primary/30">
              <animate attributeName="cy" values="220;210;220" dur="2.2s" repeatCount="indefinite" />
            </circle>

            {/* Search icon with magnifying glass */}
            <g transform="translate(160, 200)">
              <circle
                cx="15"
                cy="15"
                r="12"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-muted-foreground"
              />
              <line
                x1="25"
                y1="25"
                x2="35"
                y2="35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-muted-foreground"
              />
            </g>

            {/* Question marks */}
            <text x="140" y="120" fontSize="20" fill="currentColor" className="text-muted-foreground">
              ?
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </text>

            <text x="260" y="130" fontSize="16" fill="currentColor" className="text-muted-foreground">
              ?
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </text>
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
      </div>
    </div>
  )
}
