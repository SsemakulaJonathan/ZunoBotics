# ZunoBotics

**Empowering African innovation through robotics and automation**

ZunoBotics is a Next.js-based platform that supports African students and innovators in developing open-source robotics projects. Our mission is to provide resources, mentorship, and funding to build a thriving ecosystem of technological innovation across Africa.

## 🚀 Features

- **Project Showcase**: Display and filter student robotics projects from universities across Africa
- **Proposal Submission System**: Complete application process with template downloads and form submissions
- **Multi-tier Donation Platform**: Support through Stripe and PayPal integration
- **Impact Tracking**: Real-time statistics and fundraising progress
- **Partnership Management**: Connect with universities and corporate sponsors
- **Responsive Design**: Mobile-first approach with dark/light theme support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe and PayPal integration
- **Authentication**: NextAuth.js ready
- **Animation**: Framer Motion and Lottie React
- **Deployment**: Vercel-optimized

## 📁 Project Structure

```
zunobotics/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   │   ├── contact/       # Contact form handler
│   │   ├── donations/     # Donation processing
│   │   ├── proposals/     # Proposal submissions
│   │   └── webhooks/      # Payment webhooks
│   ├── about/             # About page
│   ├── donate/            # Donation pages
│   ├── projects/          # Projects showcase
│   └── ...                # Additional pages
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui component library
│   ├── impact.tsx        # Impact metrics display
│   ├── projects.tsx      # Project showcase and submission
│   ├── mission.tsx       # Mission and team sections
│   └── ...               # Additional components
├── lib/                  # Utility functions and configurations
│   ├── db.ts            # Database connection
│   ├── env.ts           # Environment variables
│   ├── stripe.ts        # Stripe configuration
│   └── utils.ts         # Utility functions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── styles/              # Global styles
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Stripe account (for payments)
- PayPal account (for alternative payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zunobotics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zunobotics"
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema to database
- `npx prisma generate` - Generate Prisma client

## 🏗️ Key Components

### Project Showcase (`components/projects.tsx`)
- Filterable project gallery
- Project proposal submission system
- Template download functionality
- File upload with validation

### Impact Metrics (`components/impact.tsx`)
- Responsive slider for mobile
- Grid layout for desktop
- Real-time statistics display

### Donation System (`components/fundraising.tsx`)
- Multi-tier donation options
- Stripe and PayPal integration
- Corporate partnership opportunities

### Mission & Team (`components/mission.tsx`)
- Company mission and values
- Team member profiles
- Timeline/milestone display

## 🗄️ Database Schema

### Core Models
- **Donation**: Payment tracking and donor information
- **Project**: Student project details and metadata
- **Partner**: University and corporate partner information

### Example Usage
```javascript
// Fetch projects
const projects = await db.project.findMany({
  where: { university: "Makerere University" }
});

// Create donation
const donation = await db.donation.create({
  data: {
    amount: 50,
    name: "John Doe",
    email: "john@example.com"
  }
});
```

## 🎨 Styling & Theming

The project uses a comprehensive design system built on Tailwind CSS:

- **CSS Variables**: HSL-based color system for theme switching
- **Custom Components**: Extended shadcn/ui component library
- **Responsive Design**: Mobile-first with breakpoint utilities
- **Dark/Light Mode**: System preference detection with manual toggle

## 📧 Contact Information

- **General**: info@zunobotics.com
- **Phone**: +256788123717
- **Partnerships**: jonathan@uhururobotics.com
- **Location**: Kampala, Uganda

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint configuration
- Maintain component documentation
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Universities**: Partner institutions across Uganda and East Africa
- **Contributors**: Student developers and mentors
- **Supporters**: Donors and corporate sponsors
- **Open Source**: Built with amazing open-source technologies

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
Ensure all required environment variables are configured in your deployment platform:
- Database connection string
- Stripe API keys
- PayPal configuration
- Email service credentials (if implemented)

---

**Built with ❤️ for African innovation**

For more information, visit our website or contact us directly.