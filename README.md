# TriSpark

A modern web development stack built with Vite and SASS, featuring a clean architecture and optimized build process.

## 🚀 Features

- **Modern Build System**: Powered by Vite for lightning-fast development and optimized production builds
- **Advanced SASS Architecture**: Modular SASS structure with modern features
- **Responsive Design**: Mobile-first approach with comprehensive breakpoints
- **Performance Optimized**: Optimized assets and build process
- **Modern Development Experience**: Hot Module Replacement (HMR) and fast refresh

## 📦 Tech Stack

- **Build Tool**: Vite v5.4.18
- **CSS Preprocessor**: SASS v1.71.1
- **Core Dependencies**:
  - core-js v3.41.0
  - Modern SASS modules system (@use/@forward)

## 🛠️ Project Structure

```
TriSpark/
├── assets/              # Static assets
│   ├── fonts/          # Font files
│   ├── images/         # Image assets
│   ├── icons/          # Icon assets
│   └── logos/          # Logo assets
├── js/                 # JavaScript source files
│   └── main.js        # Main JavaScript entry point
├── scss/              # SASS source files
│   ├── base/          # Base styles
│   ├── components/    # Component styles
│   ├── imports/       # Shared imports and mixins
│   └── style.scss     # Main SASS entry point
├── public/            # Public static files
├── index.html         # Main HTML entry point
└── vite.config.js     # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd TriSpark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The development server will start at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 SASS Architecture

The project uses a modern SASS architecture with the following features:

- **Module System**: Uses `@use` and `@forward` for better encapsulation
- **Variables**: Centralized in `_variables.scss`
- **Mixins**: Organized in `imports/mixins/`
- **Components**: Modular component styles in `components/`
- **Base Styles**: Foundational styles in `base/`

### SASS Features

- CSS Custom Properties (variables)
- Modern SASS modules
- Responsive mixins
- Typography system
- Form styling
- Navigation components

## 🔧 Configuration

### Vite Configuration

The project uses a custom Vite configuration (`vite.config.js`) with:

- Custom asset handling
- SASS preprocessing
- Path aliases
- Development server settings
- Build optimization

### SASS Configuration

- Modern SASS module system
- Custom properties for theming
- Responsive breakpoints
- Typography scale
- Component-based architecture

## 📱 Responsive Design

The project includes comprehensive responsive design features:

- Mobile-first approach
- Custom breakpoints
- Responsive typography
- Flexible layouts
- Adaptive components

## 🎯 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 support through core-js polyfills

## 📝 Notes

- The project uses modern SASS features which may show deprecation warnings in development
- These warnings don't affect functionality and will be addressed in future SASS updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Vite team for the amazing build tool
- SASS team for the powerful preprocessor
- All contributors who have helped shape this project 