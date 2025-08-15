# Simple Encryption Website

A secure, client-side encryption and decryption tool built with Next.js and Web Crypto API.

## Features

- **AES-256 Encryption**: Uses industry-standard AES-256-GCM encryption
- **Client-Side Security**: All encryption/decryption happens locally in your browser
- **Password Protection**: User-defined passwords with show/hide functionality
- **Base64 Output**: Encrypted messages are encoded in Base64 for easy sharing
- **Copy to Clipboard**: One-click copying of encrypted/decrypted text
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Toast notifications for user actions

## How It Works

1. **Encryption**: Enter your message and create a password → Get encrypted text
2. **Decryption**: Enter the encrypted text and the same password → Get original message

The system uses:
- **AES-256-GCM** encryption algorithm
- **PBKDF2** key derivation with 100,000 iterations
- **Random salt and IV** generation for each encryption
- **Client-side processing** - no data is sent to servers

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd simple-encryption-website
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage

### Encrypting a Message

1. Enter your text in the "Message to Encrypt" field
2. Create a secure password in the "Password" field
3. Click "Encrypt Message"
4. Copy the encrypted result to share or store

### Decrypting a Message

1. Paste the encrypted text in the "Encrypted Message" field
2. Enter the exact same password used for encryption
3. Click "Decrypt Message"
4. Your original message will be displayed

## Security Notes

- **Remember your password**: Passwords cannot be recovered if lost
- **Use strong passwords**: Longer, complex passwords provide better security
- **Local processing**: All encryption happens in your browser - no data is transmitted
- **No password storage**: Passwords are never stored or logged anywhere

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Web Crypto API** - Browser-native cryptographic functions
- **Sonner** - Toast notifications

## Browser Compatibility

This application requires a modern browser with Web Crypto API support:
- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud Platform

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
