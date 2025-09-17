# AlgoVerse Log Track - Frontend

A modern React-based frontend application for tracking and verifying volunteer contributions on the Algorand blockchain.

![AlgoVerse Logo](https://img.shields.io/badge/Powered%20by-Algorand-00D4AA?style=for-the-badge&logo=algorand)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite)

## 🚀 Overview

AlgoVerse Log Track is a decentralized application (dApp) that enables volunteers and organizations to log, verify, and track volunteer contributions using the Algorand blockchain. The frontend provides an intuitive interface for managing volunteer activities, building reputation scores, and ensuring transparent verification processes.

## ✨ Features

### 🔐 Wallet Integration
- **Pera Wallet Support**: Seamless connection to Algorand wallets
- **QR Code Connection**: Mobile wallet connectivity via QR codes
- **Persistent Sessions**: Automatic reconnection on page reload
- **Demo Mode**: Development testing without real wallet connection

### 📊 Dashboard Systems
- **Volunteer Dashboard**: Personal contribution tracking and statistics
- **Organizer Dashboard**: Organization management and volunteer verification
- **Real-time Updates**: Live status updates for contributions and verifications

### 📝 Contribution Management
- **Log Contributions**: Easy-to-use forms for recording volunteer activities
- **Verification System**: Multi-step verification process for authenticity
- **Blockchain Integration**: Immutable recording on Algorand blockchain
- **Reputation Scoring**: Automated scoring based on verified contributions

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Beautiful, accessible component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capabilities
- **Interactive Elements**: Smooth animations and transitions

## 🛠️ Technology Stack

### Core Framework
- **React 18.3.1**: Modern React with hooks and concurrent features
- **TypeScript 5.8.3**: Type-safe development
- **Vite 5.4.19**: Fast build tool and development server

### UI/UX Libraries
- **shadcn/ui**: High-quality React components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Radix UI**: Unstyled, accessible components

### State Management & Data
- **React Query (TanStack)**: Powerful data fetching and caching
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

### Blockchain Integration
- **AlgoSDK 3.4.0**: Official Algorand JavaScript SDK
- **Pera Wallet Connect**: Algorand wallet integration
- **QR Code Generation**: Mobile wallet connection support

### Additional Features
- **React Router DOM**: Client-side routing
- **Recharts**: Beautiful chart components for analytics
- **Date-fns**: Modern date utility library
- **Sonner**: Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── LogContribution.tsx
│   ├── Navigation.tsx   # Navigation bar
│   ├── VerifyContribution.tsx
│   └── WalletMenu.tsx   # Wallet connection UI
├── contexts/           # React context providers
│   └── WalletContext.tsx # Wallet state management
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx  # Mobile detection
│   └── use-toast.ts    # Toast notifications
├── lib/                # Utility libraries
│   ├── testnet-utils.ts # Algorand testnet utilities
│   └── utils.ts        # General utility functions
├── pages/              # Route components
│   ├── Landing.tsx     # Home page
│   ├── LogContribution.tsx
│   ├── VolunteerDashboard.tsx
│   ├── OrganizerDashboard.tsx
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with ES6+ support
- (Optional) Algorand wallet for full functionality

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Development build (with source maps)
npm run build:dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000

# Algorand Configuration
VITE_ALGORAND_NETWORK=testnet
VITE_ALGOD_URL=https://testnet-algorand.api.purestake.io/ps2
VITE_INDEXER_URL=https://testnet-algorand.api.purestake.io/idx2

# Contract App IDs (update after deployment)
VITE_ORGANIZER_REGISTRY_APP_ID=your_organizer_app_id
VITE_CONTRIBUTION_LOGGER_APP_ID=your_contribution_app_id
```

### Vite Configuration

The project uses custom path aliases for clean imports:

```typescript
// Instead of: import Component from '../../../components/ui/component'
// Use: import Component from '@/components/ui/component'
```

## 📱 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Home page with project overview |
| `/log-contribution` | LogContribution | Form to log new contributions |
| `/volunteer-dashboard` | VolunteerDashboard | Volunteer's personal dashboard |
| `/organizer-dashboard` | OrganizerDashboard | Organization management dashboard |
| `*` | NotFound | 404 error page |

## 🎨 UI Components

### Custom Components

- **Dashboard**: Main layout for dashboards with navigation
- **LogContribution**: Form for recording volunteer activities
- **Navigation**: App navigation bar with wallet integration
- **VerifyContribution**: Component for contribution verification
- **WalletMenu**: Wallet connection and management interface

### shadcn/ui Components

The project includes a comprehensive set of UI components:

- Form elements (Button, Input, Select, Checkbox, etc.)
- Layout components (Card, Sheet, Dialog, etc.)
- Data display (Table, Badge, Avatar, etc.)
- Feedback components (Toast, Alert, Progress, etc.)

## 🔐 Wallet Integration

### Supported Wallets

- **Pera Wallet**: Official Algorand mobile wallet
- **Demo Mode**: For development and testing

### Connection Flow

1. User clicks "Connect Wallet"
2. QR code displays for mobile wallet scanning
3. Wallet confirms connection
4. User address stored in local storage
5. Persistent connection across sessions

### Usage Example

```tsx
import { useWallet } from '@/contexts/WalletContext';

function MyComponent() {
  const { address, connect, disconnect, connecting } = useWallet();
  
  return (
    <div>
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connect} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
```

## 📊 Data Management

### React Query Integration

The app uses React Query for efficient data fetching:

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['contributions'],
  queryFn: () => fetchContributions(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Form Handling

Forms use React Hook Form with Zod validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  hours: z.number().min(1, 'Hours must be positive'),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## 🎯 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Implement proper error boundaries
- Use semantic HTML elements

### Component Structure

```tsx
// Component template
interface ComponentProps {
  // Define prop types
}

export const Component: React.FC<ComponentProps> = ({ 
  // destructure props 
}) => {
  // Hooks at the top
  // Event handlers
  // Render logic
  
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  );
};
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Implement consistent spacing and typography

## 🧪 Testing & Development

### Running Tests

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Development Testing

- Use browser developer tools
- Test wallet integration with Algorand testnet
- Verify responsive design across devices
- Test form validation and error states

## 📦 Deployment

### Build Process

1. **Create production build**
   ```bash
   npm run build
   ```

2. **The `dist/` folder contains:**
   - Optimized HTML, CSS, and JavaScript
   - Static assets and images
   - Service worker (if configured)

### Deployment Options

- **Vercel**: Automatic deployment from Git
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Static hosting
- **Custom server**: Serve static files

### Environment Setup

Ensure environment variables are configured for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_BACKEND_URL=https://your-api-domain.com
```

## 🔍 Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format support
- **Caching**: React Query for API response caching
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Check browser console for errors
   - Verify Algorand network configuration
   - Ensure wallet app is updated

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

3. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify component imports
   - Test in different browsers

### Development Server Issues

```bash
# If port 8080 is in use
npm run dev -- --port 3001

# Clear cache and restart
rm -rf node_modules .vite
npm install
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**Team Name**: BROTHERHOOD  
**Developer**: Rohan Kumar

## 🔗 Links

- **Repository**: https://github.com/rohan911438/algoverse-log-track
- **Live Demo**: [Coming Soon]
- **Backend API**: [Backend Documentation](./backend/SETUP_GUIDE.md)
- **Algorand Documentation**: https://developer.algorand.org/

---

Built with ❤️ for the Algorand community using modern web technologies