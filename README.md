# 🛡️ Tourist Safety Platform

**A Web3-powered tourist safety ecosystem combining real-time location tracking, emergency alerts, and immutable incident reporting on the blockchain.**

[![Built for Hackathon](https://img.shields.io/badge/Built%20for-Hackathon-orange.svg)](/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche-red.svg)](https://www.avax.network/)
[![Web App](https://img.shields.io/badge/Web%20App-React%20%2B%20TypeScript-blue.svg)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green.svg)](https://nodejs.org/)

## 🌟 Overview

The Tourist Safety Platform is a comprehensive solution that addresses tourist safety concerns through a decentralized, privacy-focused approach. By combining blockchain technology with real-time location sharing and emergency response systems, we create a transparent yet secure environment for tourists and authorities.

### 🎯 Key Problems Solved

- **Tourist Vulnerability**: Tourists are often unfamiliar with local dangers and lack quick access to help
- **Emergency Response Delays**: Traditional systems can be slow and lack transparency
- **Data Privacy vs Safety**: Balancing personal privacy with the need for authorities to access information during emergencies
- **Incident Documentation**: Creating tamper-proof records of incidents and emergency responses

## 🚀 Features

### 🌐 Tourist Web App (For Tourists & Citizens)
- **Blockchain-based Registration**: Secure identity creation with encrypted personal data
- **Real-time Location Sharing**: GPS tracking with privacy controls
- **One-Touch SOS**: Emergency alerts with automatic blockchain logging
- **Disaster Reporting**: Upload photos and descriptions of dangerous situations
- **Danger Zone Warnings**: Get notified when entering marked unsafe areas
- **Encrypted Profile**: Personal details accessible only to authorized authorities
- **Responsive Design**: Works seamlessly on mobile browsers and desktops

### 💻 Admin Portal (For Authorities)
- **Live Safety Dashboard**: Real-time map showing active tourist locations (ID-only for privacy)
- **SOS Management**: View and respond to emergency alerts
- **Danger Zone Control**: Mark and manage dangerous areas on the map
- **Disaster Reports**: Review user-submitted safety reports with photos
- **e-FIR System**: File immutable First Information Reports (FIRs) on blockchain
- **Selective Data Access**: Decrypt user information only when legally authorized

### 🔗 Blockchain Integration
- **Identity Management**: Blockchain-based user IDs mapped to encrypted data
- **Immutable SOS Logging**: All emergency alerts permanently recorded
- **Transparent e-FIR**: Tamper-proof incident reports for legal purposes
- **Privacy by Design**: Personal data encrypted, authorities hold decryption keys

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Tourist Web    │    │  Admin Portal   │    │   Blockchain    │
│  App (React)    │    │   (React.js)    │    │   (Avalanche)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │      Backend API       │
                    │   (Node.js + MongoDB)  │
                    │    + WebSocket Server  │
                    └─────────────────────────┘
```

### Tech Stack

**Frontend**
- **Tourist Web App**: React.js + TypeScript + Vite + Tailwind CSS + Material-UI
- **Admin Portal**: React.js + Vite + Tailwind CSS + ShadCN UI
- **Maps Integration**: React Leaflet + Google Maps API
- **Animations**: Framer Motion

**Backend**
- **API Server**: Node.js + Express.js
- **Database**: MongoDB (user data, reports, SOS events)
- **Real-time**: WebSocket (Socket.io) for live location updates
- **Security**: JWT authentication + Node Forge encryption + Notistack notifications

**Blockchain**
- **Network**: Avalanche Fuji Testnet (fast, low fees)
- **Smart Contracts**: Solidity
- **Integration**: Ethers.js

## 📂 Project Structure

```
tourist-safety-project/
├── user-webapp/                # React tourist web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Auth, Dashboard, Profile, SOS pages
│   │   ├── services/         # API, blockchain, location services
│   │   ├── utils/            # Encryption, validation helpers
│   │   └── hooks/            # Custom React hooks
├── admin-portal/              # React admin dashboard
│   ├── src/
│   │   ├── components/       # MapView, AlertCard, UserCard
│   │   ├── pages/           # Dashboard, SOS, Reports, e-FIR
│   │   └── services/        # API services for admin functions
├── backend/                   # Node.js server
│   ├── src/
│   │   ├── models/          # User, SOS, Report, FIR schemas
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   └── utils/           # Blockchain integration, encryption
├── blockchain/                # Solidity smart contracts
│   ├── contracts/           # Identity, SosAlert, EFIR contracts
│   └── scripts/             # Deployment scripts
└── docs/                     # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- TypeScript
- Hardhat
- Metamask or Web3 wallet

### 1. Clone Repository
```bash
git clone https://github.com/your-username/tourist-safety-project.git
cd tourist-safety-project
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### 3. Blockchain Setup
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network fuji
```

### 4. Admin Portal Setup
```bash
cd admin-portal
npm install
npm run dev
```

### 5. Tourist Web App Setup
```bash
cd user-webapp
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/tourist-safety
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-32-byte-encryption-key
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS_IDENTITY=0x...
CONTRACT_ADDRESS_SOS=0x...
CONTRACT_ADDRESS_EFIR=0x...
```

**Admin Portal (.env)**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_BLOCKCHAIN_RPC=https://api.avax-test.network/ext/bc/C/rpc
```

**Tourist Web App (.env)**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_BLOCKCHAIN_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🎮 Usage

### For Tourists (Web App)

1. **Register**: Create a blockchain-based identity with encrypted personal details
2. **Share Location**: Enable location sharing to appear on the safety dashboard
3. **Report Dangers**: Upload photos and descriptions of unsafe situations
4. **Emergency SOS**: One-touch emergency alert with automatic blockchain logging
5. **Stay Informed**: Receive warnings when entering marked danger zones
6. **Cross-Device Access**: Access from any device with a modern web browser

### For Authorities (Admin Portal)

1. **Monitor Safety**: View live map with active tourist locations (privacy-protected)
2. **Respond to SOS**: Receive real-time emergency alerts and coordinate response
3. **Mark Danger Zones**: Add/remove dangerous areas based on reports and incidents
4. **Review Reports**: Analyze user-submitted safety reports and photos
5. **File e-FIR**: Create immutable incident reports with selective data access

## 🔒 Security & Privacy

### Privacy-First Design
- **Encrypted Storage**: All personal data encrypted before storage
- **Selective Disclosure**: Authorities only see blockchain IDs by default
- **Emergency Access**: Police can decrypt data only with proper authorization
- **Blockchain Transparency**: All SOS events and e-FIRs immutably logged

### Security Measures
- **JWT Authentication**: Secure API access
- **Node Forge Encryption**: Military-grade data protection
- **Smart Contract Auditing**: Automated testing for blockchain components
- **HTTPS/WSS**: Encrypted communication channels

## 🌐 Blockchain Details

### Smart Contracts

**Identity.sol**
- Maps blockchain wallet addresses to encrypted user data hashes
- Enables privacy-preserving identification

**SosAlert.sol**
- Immutably logs all SOS events with timestamps
- Provides transparency for emergency response auditing

**EFIR.sol**
- Stores First Information Reports (FIRs) on blockchain
- Creates tamper-proof legal documentation

### Why Avalanche?
- **Fast Transactions**: Sub-second finality
- **Low Fees**: Minimal gas costs for frequent updates
- **EVM Compatible**: Easy integration with existing tools
- **Eco-Friendly**: Proof-of-Stake consensus

## 🚀 Deployment

### Production Deployment

1. **Backend**: Deploy to AWS/Google Cloud with MongoDB Atlas
2. **Admin Portal**: Build and deploy to Vercel/Netlify
3. **Tourist Web App**: Build and deploy to Vercel/Netlify
4. **Blockchain**: Deploy contracts to Avalanche Mainnet



## 🤝 Contributing

This project was built for a hackathon, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: Web app and admin portal development
- **Backend Developer**: API design and WebSocket implementation  
- **Blockchain Developer**: Smart contract development and integration
- **UI/UX Designer**: User experience and interface design

## 🏆 Hackathon Value Proposition

### Innovation
- **First-of-its-kind** blockchain-based tourist safety platform
- **Privacy-preserving** emergency response system
- **Immutable incident documentation** for legal purposes

### Real-World Impact
- **Immediate Safety**: Real-time emergency response for tourists
- **Data Transparency**: Blockchain-verified incident reporting
- **Scalable Solution**: Adaptable to smart cities and citizen safety

### Technical Excellence
- **Modern Web Stack**: React + TypeScript + Vite for optimal performance
- **Full-stack Web3 integration** with practical use case
- **Privacy by design** architecture
- **Production-ready** codebase with comprehensive testing
- **Progressive Web App** capabilities for mobile-like experience

## 📞 Support

For questions, issues, or collaboration opportunities:

- **Email**: team@touristsafety.platform
- **Discord**: [Join our server](https://discord.gg/tourist-safety)
- **Documentation**: [Full API docs](./docs/api-spec.md)

---

**Built with ❤️ for safer travel experiences worldwide**