# AlgoVerse Log Track

AlgoVerse Log Track is a decentralized application (dApp) designed to securely log, verify, and track volunteer contributions using the Algorand blockchain. The project aims to provide transparent, tamper-proof records of community service, making it easy for volunteers and organizations to showcase impact and build trust.

## 🚀 Technology Stack

- **Frontend:**  
  - React (TypeScript)  
  - Vite (build tool)  
  - Tailwind CSS (utility-first styling)  
  - shadcn/ui (modern UI components)  
  - Lucide React (icon library)  
  - React Query (data fetching/caching)  
  - React Hook Form & Zod (form validation)  
  - Radix UI (accessibility primitives)

- **Backend:**  
  - Node.js & Express.js  
  - MongoDB (Mongoose ODM)  
  - JWT authentication  
  - RESTful API endpoints  
  - Input validation, error handling, and security best practices

- **Blockchain Integration:**  
  - Algorand smart contracts (TealScript)  
  - AlgoSDK (JavaScript SDK for Algorand)  
  - PureStake API (TestNet access)  
  - TypeScript contract clients  
  - Lute Wallet & Pera Wallet support (TestNet and demo mode)

## ✨ Features

- **Wallet Integration:**  
  - Connect with Lute Wallet or Pera Wallet for secure authentication  
  - Demo mode for hackathon presentations and development  
  - Persistent wallet sessions

- **Contribution Management:**  
  - Log volunteer activities with details (time, location, organization, description)  
  - Multi-step verification workflow for authenticity  
  - Immutable blockchain recording for each contribution  
  - Reputation scoring and badge system

- **Dashboards:**  
  - Volunteer dashboard: Track personal contributions, stats, and badges  
  - Organizer dashboard: Manage organization profile, verify contributions, view analytics

- **Smart Contracts:**  
  - Organizer Registry: Manages organization registration and authorization  
  - Contribution Logger: Records and verifies volunteer contributions  
  - Bulk logging and contract statistics endpoints

- **Security:**  
  - JWT-based authentication  
  - Rate limiting and CORS protection  
  - Input validation and error handling  
  - Secure wallet management (never expose mnemonics or private keys)

- **Modern UI/UX:**  
  - Responsive, mobile-first design  
  - Dark/light mode support  
  - Smooth animations and transitions

## 📝 Getting Started

1. **Install dependencies:**  
   ```sh
   npm install
   ```

2. **Start development server:**  
   ```sh
   npm run dev
   ```

3. **Connect your wallet:**  
   - Use Lute Wallet or Pera Wallet for full blockchain functionality  
   - Demo mode available for testing without a real wallet

4. **Log and verify contributions:**  
   - Use the dashboard to record activities and view blockchain verification

## 🔑 Lute Wallet Integration

Lute Wallet is used for secure authentication and transaction signing on Algorand TestNet.  
- Connect your wallet to log and verify contributions  
- Demo mode simulates wallet connection for presentations  
- Never share your mnemonic or private keys

## 📦 Project Structure

- `src/` – Frontend source code (components, pages, contexts, hooks, lib)
- `backend/` – Backend API, models, middleware, routes, config
- `algorand-contracts/` – Smart contracts, deployment scripts, TypeScript clients

## 📚 Documentation

- Frontend: [FRONTEND_README.md](FRONTEND_README.md)
- Backend: [backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md)
- Smart Contracts: [algorand-contracts/README.md](algorand-contracts/README.md)
- Deployment Info: [DEPLOYMENT_INFO.md](DEPLOYMENT_INFO.md)

---

AlgoVerse Log Track empowers volunteers and organizations to build verifiable, permanent records of community impact—secure, transparent, and ready for the future.
