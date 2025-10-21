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
- **Blender-inspired transform workflow** (G + X/Y/Z constraints)
- **Real-time debug overlay** - for production values
- **Smooth camera transitions** - enhanced user experience
- **Configurable control schemes** - multiple usage scenarios

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

#### �️ Advanced Debug Interface

- **Responsive UI layout system** - all screen sizes
- **Multiple debug panels** - Camera, Bloom, Lighting, Collider
- **H-key toggle system** - quick debug mode
- **Real-time parameter updates** - live adjustments
- **Clean production builds** - zero debug residue

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
6. Copy values from debug UI after finding perfect composition
7. Update config file for production deployment

---

## 🛠️ Technical Stack

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

_Built with precision engineering for the modern web_

## 🇹🇷 Türkçe

### 📖 Proje Hakkında

WebMeshCore3D, modern web uygulamaları için geliştirilmiş endüstriyel seviye 3D sahne framework'üdür. Uzun süreli projeler ve üretime hazır dağıtımlar için optimize edilmiş, modüler mimariyle tasarlanmıştır.

### ✨ Sistem Özellikleri

#### 🎯 Modüler Collision System

- **JSON-tabanlı collider konfigürasyonu** - merkezi veri yönetimi
- **Real-time collision detection** - performans optimized
- **Interactive hover/click handlers** - user engagement
- **Dynamic animation mapping** - otomatik animasyon tetikleme
- **Production-ready scaling** - büyük projeler için uygun

#### 🎨 Enterprise Bloom & Post-Processing

- **PMNDRS postprocessing pipeline** - endüstri standardı
- **Selective emission control** - material bazlı bloom
- **Ultra-precise parameter control** (0.001 step precision)
- **AgX tone mapping** - doğal renk reproduksiyonu
- **Multi-pass anti-aliasing** (SMAA + FXAA support)

#### 📷 Professional Camera System

- **Dual projection support** - Perspective & Orthographic
- **Blender-inspired transform workflow** (G + X/Y/Z constraints)
- **Real-time debug overlay** - production değerleri için
- **Smooth camera transitions** - kullanıcı deneyimi için
- **Configurable control schemes** - farklı kullanım senaryoları

#### ⚡ Performance-First Architecture

- **Adaptive quality presets** - cihaz bazlı optimizasyon
- **Modular component loading** - lazy loading support
- **Memory-efficient rendering** - büyük sahneler için
- **SSR-compatible configuration** - server-side rendering
- **Production/development split** - temiz deployment

#### 🎛️ Centralized Configuration System

- **Single config file** - tüm sistem ayarları
- **Environment-based settings** - dev/prod ayrımı
- **Hot-reload support** - geliştirme hızı
- **Type-safe parameters** - hata önleme
- **Backward compatibility** - mevcut projeler için

#### 🖥️ Advanced Debug Interface

- **Responsive UI layout system** - tüm ekran boyutları
- **Multiple debug panels** - Camera, Bloom, Lighting, Collider
- **H-key toggle system** - hızlı debug mod
- **Real-time parameter updates** - canlı ayarlama
- **Clean production builds** - sıfır debug kalıntısı

### 🚀 Teknik Kurulum

```bash
# Repository klonlama
git clone https://github.com/burakdarende/WebMeshCore3D.git
cd WebMeshCore3D

# Dependency installation (legacy peer deps gerekli)
npm install --legacy-peer-deps

# Development server başlatma
npm run dev
```

### 📂 3D Asset Integration

1. GLB/GLTF modellerinizi `/public/models/` dizinine yerleştirin
2. Scene dosyasında model referansını güncelleyin:

```jsx
// src/components/Scene_simple.jsx
const gltf = useLoader(GLTFLoader, "/models/your-model.glb");
```

3. Collider konfigürasyonunu güncelleyin:

```json
// src/data/collider.json
{
  "interactiveObjects": [
    {
      "name": "YourObjectName",
      "boundingBox": {
        /* koordinatlar */
      }
    }
  ]
}
```

### ⚙️ Sistem Konfigürasyonu

#### Production Deployment:

⚠️ **ÖNEMLİ: Production'a geçmeden önce mutlaka yapılması gerekenler!**

```jsx
// src/config/app-config.js

// 1️⃣ Debug modunu kapat
export const DEVELOPER_CONFIG = {
  ENABLE_DEBUG_MODE: false, // Tüm debug UI'ı kapat - MUTLAKA false yapın!
};

// 2️⃣ Build konfigürasyonunu production'a çevir
export const BUILD_CONFIG = {
  version: "1.0.0",
  buildDate: new Date().toISOString(),
  environment: "production", // MUTLAKA "production" yapın!
  features: {
    debug: false, // Debug'ı kapat
    analytics: true, // Analytics'i aç
    errorReporting: true, // Hata raporlamayı aç
  },
};

// 3️⃣ Performans ayarları
export const VISUAL_CONFIG = {
  qualityPreset: "high", // low/medium/high/ultra
  bloom: {
    threshold: 0.1, // Bloom başlangıç değeri
    strength: 0.1, // Bloom yoğunluğu
    radius: 0.22, // Bloom yayılım
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
  position: [5, 3.76, 4.86], // Kamera konumu
  target: [0.46, 0.77, -0.27], // Odak noktası
  perspective: true, // Perspektif/Ortografik
  fov: {
    perspective: { default: 50 }, // Görüş açısı
    orthographic: { default: 1.7 }, // Ortografik zoom
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

1. **Debug modunda** tüm araçlar aktif olarak çalışır
2. **WASD/EQ** ile kamera navigasyonu yapın
3. **G + X/Y/Z** ile focus point ayarlayın
4. **C** ile kamera türü değiştirin
5. **H** ile debug panellerini gizleyin/gösterin
6. Mükemmel kompozisyonu bulduktan sonra debug UI'dan değerleri kopyalayın
7. Config dosyasını production için güncelleyin

---
