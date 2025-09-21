# Career Path Finder

Career Path Finder is a simple web application that helps users discover career paths based on their skills. Powered by Next.js, React, and Google Gemini AI, it provides personalized career recommendations, skill development suggestions, and visualizes career progression using interactive flowcharts.

## Features

- **AI-Powered Recommendations:** Enter your skills and get career roles, skills to learn, career paths, and industry insights using Gemini AI.
- **Interactive Visualization:** View your career path as a flowchart for better understanding and planning.
- **Modern UI:** Built with React, Tailwind CSS, and Radix UI for a clean and responsive interface.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
	```bash
	git clone https://github.com/harryfrzz/career-path-finder.git
	cd career-path-finder
	```
2. Install dependencies:
	```bash
	npm install
	# or
	yarn install
	```
3. Set up your Gemini API key in a `.env.local` file:
	```env
	GEMINI_API_KEY=your_api_key_here
	```

### Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Enter your skills separated by commas (e.g., `JavaScript, Python, Design`).
2. Click the send button to get AI-powered career recommendations.
3. Explore the flowchart visualization and review suggested roles, skills, and career paths.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Google Gemini AI
- React Flow