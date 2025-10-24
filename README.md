# � WebMeshCore3D - Advanced 3D Scene Framework

Professional-grade 3D visualization system built for real-world applications. Engineered as a comprehensive alternative to commercial solutions with full developer control.

## 🇬🇧 English

### 📖 Overview

WebMeshCore3D is an enterprise-grade 3D scene framework designed for production environments. Built with a modular architecture optimized for scalable web applications and industrial deployment scenarios.

### ✨ Core Architecture

#### � Modular Collision System

- **JSON-driven collider configuration** - centralized data management
- **Real-time collision detection** - performance optimized
- **Interactive hover/click handlers** - enhanced user engagement
- **Dynamic animation mapping** - automatic animation triggering
- **Production-ready scaling** - suitable for large projects

#### 🎨 Enterprise Bloom & Post-Processing

- **PMNDRS postprocessing pipeline** - industry standard
- **Selective emission control** - material-based bloom
- **Ultra-precise parameter control** (0.001 step precision)
- **AgX tone mapping** - natural color reproduction
- **Multi-pass anti-aliasing** (SMAA + FXAA support)

#### 📷 Professional Camera System

- **Dual projection support** - Perspective & Orthographic
- **Advanced camera controls** - Auto rotate, Camera lock, Mouse tracking
- **Blender-inspired transform workflow** (G + X/Y/Z constraints)
- **Real-time debug overlay** - for production values
- **Smooth camera transitions** - enhanced user experience
- **Configurable control schemes** - multiple usage scenarios
- **Centralized configuration** - all camera settings in app-config.js

##### 🔄 Auto Rotate Features

- **Variable speed control** - configurable rotation speed (0.1-5.0)
- **Direction selection** - left/right rotation with radio buttons
- **Smart conflict prevention** - mutually exclusive with other camera modes

##### 🔒 Camera Lock System

- **Complete camera control lock** - prevents all camera movements
- **Visual indicators** - clear UI feedback for lock state
- **OrbitControls integration** - seamlessly disables zoom/pan/rotate

##### 🎯 Mouse Tracking System

- **Real-time mouse following** - camera responds to mouse position
- **Intensity control** - adjustable tracking sensitivity (0.1-2.0)
- **Position shifting** - 3/4 keys for camera repositioning
- **Delta-based movement** - smooth, non-continuous rotation
- **Smart controls disable** - prevents conflict with manual camera control

#### ⚡ Performance-First Architecture

- **Adaptive quality presets** - device-based optimization
- **Modular component loading** - lazy loading support
- **Memory-efficient rendering** - for large scenes
- **SSR-compatible configuration** - server-side rendering
- **Production/development split** - clean deployment

#### 🎛️ Centralized Configuration System

- **Single config file** - all system settings
- **Environment-based settings** - dev/prod separation
- **Hot-reload support** - development speed
- **Type-safe parameters** - error prevention
- **Backward compatibility** - for existing projects

#### 🛠️ Advanced Debug Interface

- **Responsive UI layout system** - all screen sizes
- **Multiple debug panels** - Camera, Bloom, Lighting, Collider
- **H-key toggle system** - quick debug mode
- **Real-time parameter updates** - live adjustments
- **Clean production builds** - zero debug residue
- **Minimize/Maximize panels** - optimized workspace management
- **Glass morphism styling** - modern UI aesthetics

##### 📷 Camera Debug Panel Features:

- **Auto Rotate Controls**: Speed slider (0.1-5.0) and direction radio buttons
- **Camera Lock Toggle**: Complete camera movement prevention
- **Mouse Tracking System**: Real-time mouse-responsive rotation with intensity control
- **Position Indicators**: Real-time camera position and target coordinates
- **FOV/Zoom Controls**: Live field of view and zoom adjustments
- **Camera Type Switcher**: Perspective/Orthographic toggle

### 🚀 Technical Installation

```bash
# Repository cloning
git clone https://github.com/burakdarende/WebMeshCore3D.git
cd WebMeshCore3D

# Dependency installation (legacy peer deps required)
npm install --legacy-peer-deps

# Development server startup
npm run dev
```

### 📂 3D Asset Integration

1. Place GLB/GLTF models in `/public/models/` directory
2. Update model reference in scene file:

```jsx
// src/components/Scene_simple.jsx
const gltf = useLoader(GLTFLoader, "/models/your-model.glb");
```

3. Update collider configuration:

```json
// src/data/collider.json
{
  "interactiveObjects": [
    {
      "name": "YourObjectName",
      "boundingBox": {
        /* coordinates */
      }
    }
  ]
}
```

### ⚙️ System Configuration

#### Production Deployment:

⚠️ **CRITICAL: Essential steps before production deployment!**

```jsx
// src/config/app-config.js

// 1️⃣ Disable debug mode
export const DEVELOPER_CONFIG = {
  ENABLE_DEBUG_MODE: false, // Disable all debug UI - MUST be false!
};

// 2️⃣ Set build configuration to production
export const BUILD_CONFIG = {
  version: "1.0.0",
  buildDate: new Date().toISOString(),
  environment: "production", // MUST be "production"!
  features: {
    debug: false, // Disable debug features
    analytics: true, // Enable analytics
    errorReporting: true, // Enable error reporting
  },
};

// 3️⃣ Performance settings
export const VISUAL_CONFIG = {
  qualityPreset: "high", // low/medium/high/ultra
  bloom: {
    threshold: 0.1, // Bloom threshold
    strength: 0.1, // Bloom intensity
    radius: 0.22, // Bloom spread
  },
};
```

**Production Checklist:**

- [ ] `ENABLE_DEBUG_MODE: false` ✅
- [ ] `environment: "production"` ✅
- [ ] `debug: false` ✅
- [ ] `analytics: true` ✅
- [ ] `errorReporting: true` ✅

#### Camera Fine-tuning:

```jsx
export const CAMERA_CONFIG = {
  position: [5, 3.76, 4.86], // Camera position
  target: [0.46, 0.77, -0.27], // Focus target
  perspective: true, // Perspective/Orthographic
  fov: {
    perspective: { default: 50 }, // Field of view
    orthographic: { default: 1.7 }, // Orthographic zoom
  },

  // 🚀 Advanced Camera Features
  autoRotate: {
    enabled: false, // Enable auto rotate by default
    speed: {
      default: 2.0, // Default rotation speed
      min: 0.1,
      max: 5.0,
      step: 0.1, // Speed range settings
    },
    direction: {
      default: "right", // Default direction
      options: ["left", "right"], // Available directions
    },
  },

  cameraLock: {
    enabled: false, // Enable camera lock by default
    disableControls: true, // Disable OrbitControls when locked
    showIndicator: true, // Show lock indicator in UI
  },

  mouseTracking: {
    enabled: false, // Enable mouse tracking by default
    intensity: {
      default: 1.0, // Default intensity
      min: 0.1,
      max: 2.0,
      step: 0.1, // Intensity range
    },
    speed: {
      base: 0.1, // Base rotation speed multiplier
      multiplier: 1.0, // Additional speed multiplier
    },
    positionShift: {
      enabled: true, // Enable position shifting
      step: 0.5, // Distance to shift camera position
      keys: { left: "3", right: "4" }, // Keyboard keys
    },
    disableOrbitControls: true, // Disable zoom/pan/rotate when active
  },
};
```

#### Performance Optimization:

```jsx
export const PERFORMANCE_CONFIG = {
  fps: { target: 60, adaptive: true },
  device: {
    mobile: { reduceQuality: true },
    desktop: { enableAdvancedEffects: true },
  },
};
```

### 🎯 Development Workflow

1. **Debug mode** operates with all tools active
2. Use **WASD/EQ** for camera navigation
3. Use **G + X/Y/Z** for focus point adjustment
4. **C** key switches camera type
5. **H** key toggles debug panels visibility

#### 🎮 Advanced Camera Controls:

- **Auto Rotate**: Toggle continuous camera rotation with speed/direction control
- **Camera Lock**: Lock all camera movements for stable viewing
- **Mouse Tracking**: Enable mouse-responsive camera rotation
  - **3/4 keys**: Shift camera position left/right when mouse tracking is active
  - **Intensity slider**: Adjust mouse tracking sensitivity
- **Mutual Exclusion**: Camera features prevent conflicts automatically

6. Copy values from debug UI after finding perfect composition
7. Update config file for production deployment

---

## � System Requirements

### Minimum Requirements:

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **WebGL**: 2.0 support required
- **Memory**: 4GB RAM minimum for complex scenes
- **GPU**: Integrated graphics sufficient for basic scenes

### Recommended for Advanced Features:

- **GPU**: Dedicated graphics card for complex bloom effects
- **Memory**: 8GB+ RAM for large scenes with mouse tracking
- **CPU**: Multi-core processor for smooth auto-rotate animations
- **Network**: Stable connection for asset loading

### Browser Feature Support:

- **Mouse Tracking**: Requires modern pointer events API
- **Auto Rotate**: Uses requestAnimationFrame for smooth animation
- **Camera Lock**: Relies on modern event handling
- **Debug Panels**: Requires modern CSS grid and flexbox support

## �🛠️ Technical Stack

- **Next.js 14.2.5** - React production framework
- **Three.js 0.157.0** - WebGL 3D graphics engine
- **React Three Fiber 8.15.12** - React Three.js renderer
- **React Three Drei 9.88.13** - Essential Three.js helpers
- **PMNDRS Postprocessing** - Industry-standard effects pipeline
- **Modular Architecture** - Component-based system design

## 📁 Project Structure

```
src/
├── components/
│   ├── systems/           # Core systems (Camera, Bloom, Lighting, Collider)
│   ├── ui/               # Debug interface components
│   └── Scene_simple.jsx  # Main scene orchestrator
├── config/
│   └── app-config.js     # Centralized configuration
├── data/
│   └── collider.json     # Collision detection data
└── utils/
    └── helpers.js        # Utility functions
```

## 🎯 Architecture Design Principles

- **Separation of Concerns** - Each system handles specific functionality
- **Configuration-Driven** - Behavior controlled through config files
- **Performance-Oriented** - Optimized for production deployment
- **Developer Experience** - Comprehensive debug tools and documentation
- **Modular Components** - Easy to extend and customize
- **Production-Ready** - Zero debug code in production builds

## � Performance Characteristics

- **Frame Rate**: 60 FPS target with adaptive quality
- **Memory Usage**: Optimized object pooling and cleanup
- **Bundle Size**: Tree-shaking optimized dependencies
- **Load Time**: Lazy loading for non-critical components
- **Scalability**: Handles complex scenes with multiple objects

## 🔧 Development & Production

### Development Features:

- Hot reload configuration changes
- Real-time parameter adjustment
- Comprehensive debug panels
- Console logging for debugging
- Performance monitoring

### Production Optimizations:

- Zero debug code in final build
- Aggressive tree-shaking
- Optimized asset loading
- Memory leak prevention
- SEO-friendly SSR support

**🚨 DEPLOYMENT WARNING:** Always verify production configuration before deployment:

```bash
# Before deployment, check these critical settings:
# 1. ENABLE_DEBUG_MODE: false
# 2. BUILD_CONFIG.environment: "production"
# 3. BUILD_CONFIG.features.debug: false
```

## 📸 Screenshots

_Professional 3D scenes created with WebMeshCore3D framework_

## 🔗 Demo & Documentation

- **Live Demo**: [demo.burakdarende.com/webmeshcore3d](https://demo.burakdarende.com/webmeshcore3d)
- **Documentation**: [docs.burakdarende.com/webmeshcore3d](https://docs.burakdarende.com/webmeshcore3d)
- **Examples**: [examples.burakdarende.com/webmeshcore3d](https://examples.burakdarende.com/webmeshcore3d)

## 👨‍💻 Author

**Burak Darende** - Senior Frontend Architect  
🌐 [burakdarende.com](https://burakdarende.com) | 💻 [@burakdarende](https://github.com/burakdarende)

Specialized in 3D web applications, WebGL optimization, and enterprise-grade frontend architecture.

## 📄 License & Usage

Open source under [MIT License](LICENSE). Free for commercial and personal use.

## 🤝 Contributing

We welcome contributions from the developer community:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines:

- Follow existing code style and architecture
- Include comprehensive tests for new features
- Update documentation for API changes
- Ensure production build remains clean

## ⭐ Support the Project

If this framework helps your projects, consider:

- ⭐ Starring the repository
- 🐛 Reporting issues and bugs
- 💡 Suggesting new features
- 📢 Sharing with your network
- 💰 [Sponsoring development](https://github.com/sponsors/burakdarende)

---

### 🏆 Why Choose WebMeshCore3D?

- **Zero Dependencies on Commercial Services** - Complete ownership
- **Enterprise-Grade Architecture** - Scales with your business
- **Professional Quality Output** - Industry-standard rendering
- **Developer-Centric Design** - Built by developers, for developers
- **Production-Tested** - Used in real-world applications
- **Comprehensive Documentation** - Everything you need to get started
- **Active Maintenance** - Regular updates and improvements
- **Advanced Camera System** - Professional-grade camera controls with auto-rotate, lock, and mouse tracking
- **Centralized Configuration** - Single config file controls entire system
- **Modern UI Components** - Glass morphism debug panels with minimize/maximize
- **Mutual Exclusion Logic** - Smart feature conflict prevention
- **Real-time Parameter Control** - Live adjustments without code changes

_Built with precision engineering for the modern web_
