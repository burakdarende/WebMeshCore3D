# 🌟 BDR Room - Professional 3D Scene System

_A complete, free alternative to Spline with advanced camera controls and professional lighting_

## 🇹🇷 Türkçe

### 📖 Proje Hakkında

BDR Room, **ücretsiz bir Spline alternatifi** olarak geliştirilmiş profesyonel 3D sahne sistemidir. Three.js ve React Three Fiber teknolojileri kullanılarak oluşturulmuş, tam özellikli bir 3D editör deneyimi sunar.

### ✨ Özellikler

#### 🎥 Gelişmiş Kamera Sistemi

- **Perspective ↔ Orthographic** kamera geçişi (C tuşu)
- **Blender-tarzı transform kontrolleri** (G + X/Y/Z tuşları)
- **Real-time kamera debug UI**
- **Hassas kamera pozisyonlama**

#### 💡 Profesyonel Işıklandırma

- **Don McCurdy bloom sistemi** - selective emission enhancement
- **AgX tone mapping** ile doğal renk gradasyonları
- **Üçlü ışık düzeni**: Key Light, Fill Light, Rim Light
- **Contact shadows** ile gerçekçi gölgelendirme
- **Environment mapping** desteği

#### 🎮 Etkileşimli Kontroller

- **WASD + EQ**: Kamera pozisyonu kontrolü
- **Shift + WASD + EQ**: Focus target kontrolü
- **G tuşu**: Grab mode (Blender-style)
- **X/Y/Z tuşları**: Eksen kilitleme
- **H tuşu**: Debug UI gizle/göster
- **ESC**: İşlem iptal

#### 🔧 Geliştirici Araçları

- **Konfigürasyon sistemi** - kolay özelleştirme
- **Console log kontrolü** - production için temiz deploy
- **Performance optimizasyonları**
- **WebGL fallback** desteği

### 🚀 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/burakdarende/bdr_room.git
cd bdr_room

# Bağımlılıkları yükleyin
npm install --legacy-peer-deps

# Geliştirme sunucusunu başlatın
npm run dev
```

### 📂 3D Model Ekleme

1. 3D modelinizi (GLB/GLTF formatında) `/public/models/` klasörüne koyun
2. `src/components/Scene_simple.jsx` dosyasında model yolunu güncelleyin:

```jsx
const gltf = useLoader(GLTFLoader, "/models/your-model.glb");
```

### ⚙️ Konfigürasyon

#### Production Deploy İçin:

```jsx
const DEVELOPER_CONFIG = {
  ENABLE_DEBUG_MODE: false, // Debug UI'ı gizle
  ENABLE_CONSOLE_LOGS: false, // Console loglarını kapat
  ENABLE_FOCUS_CONTROL: false, // G+X/Y/Z kontrollerini kapat
  ENABLE_CAMERA_DEBUG_UI: false, // Kamera debug UI'ını kapat
};
```

#### Kamera Ayarları:

```jsx
const CAMERA_CONFIG = {
  position: [4.98, 3.76, 4.86], // Kamera pozisyonu
  target: [0.46, 0.77, -0.27], // Focus hedefi
  fov: 50, // Görüş açısı
  perspective: true, // Kamera tipi
};
```

### 🎯 Kullanım

1. **Development modunda** tüm debug araçları aktif
2. **WASD** ile kamerayı hareket ettirin
3. **G + X/Y/Z** ile focus point'i ayarlayın
4. **C** tuşu ile kamera türünü değiştirin
5. Mükemmel açıyı bulduktan sonra debug UI'dan değerleri kopyalayın
6. Production deploy için config'i güncelleyin

---

## 🇬🇧 English

### 📖 About

BDR Room is a professional 3D scene system developed as a **free alternative to Spline**. Built with Three.js and React Three Fiber, it provides a complete 3D editor experience with advanced features.

### ✨ Features

#### 🎥 Advanced Camera System

- **Perspective ↔ Orthographic** camera switching (C key)
- **Blender-style transform controls** (G + X/Y/Z keys)
- **Real-time camera debug UI**
- **Precise camera positioning**

#### 💡 Professional Lighting

- **Don McCurdy bloom system** - selective emission enhancement
- **AgX tone mapping** for natural color gradations
- **Triple lighting setup**: Key Light, Fill Light, Rim Light
- **Contact shadows** for realistic shadows
- **Environment mapping** support

#### 🎮 Interactive Controls

- **WASD + EQ**: Camera position control
- **Shift + WASD + EQ**: Focus target control
- **G key**: Grab mode (Blender-style)
- **X/Y/Z keys**: Axis locking
- **H key**: Hide/show debug UI
- **ESC**: Cancel operations

#### 🔧 Developer Tools

- **Configuration system** - easy customization
- **Console log control** - clean production deploy
- **Performance optimizations**
- **WebGL fallback** support

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/burakdarende/bdr_room.git
cd bdr_room

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### 📂 Adding 3D Models

1. Place your 3D model (GLB/GLTF format) in `/public/models/` folder
2. Update the model path in `src/components/Scene_simple.jsx`:

```jsx
const gltf = useLoader(GLTFLoader, "/models/your-model.glb");
```

### ⚙️ Configuration

#### For Production Deploy:

```jsx
const DEVELOPER_CONFIG = {
  ENABLE_DEBUG_MODE: false, // Hide debug UI
  ENABLE_CONSOLE_LOGS: false, // Disable console logs
  ENABLE_FOCUS_CONTROL: false, // Disable G+X/Y/Z controls
  ENABLE_CAMERA_DEBUG_UI: false, // Hide camera debug UI
};
```

#### Camera Settings:

```jsx
const CAMERA_CONFIG = {
  position: [4.98, 3.76, 4.86], // Camera position
  target: [0.46, 0.77, -0.27], // Focus target
  fov: 50, // Field of view
  perspective: true, // Camera type
};
```

### 🎯 Usage

1. **Development mode** has all debug tools active
2. Use **WASD** to move camera
3. Use **G + X/Y/Z** to adjust focus point
4. Use **C** key to switch camera type
5. Copy values from debug UI when you find the perfect angle
6. Update config for production deploy

---

## 🛠️ Tech Stack

- **Next.js 14.2.5** - React framework
- **Three.js 0.157.0** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components
- **Don McCurdy's bloom system** - Professional post-processing

## 📸 Screenshots

_Add your screenshots here showing the 3D scene, debug UI, and different camera angles_

## 🔗 Live Demo

_Add your deployed demo link here_

## 👨‍💻 Author

**Burak Darende**

- Website: [burakdarende.com](https://burakdarende.com)
- GitHub: [@burakdarende](https://github.com/burakdarende)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

### 💎 Why BDR Room?

- **100% Free** - No subscriptions, no limits
- **Professional Quality** - Enterprise-grade lighting and post-processing
- **Developer Friendly** - Clean code, easy to customize
- **Production Ready** - Optimized for deployment
- **Spline Alternative** - All features you need without the cost

_Built with ❤️ by Burak Darende_
