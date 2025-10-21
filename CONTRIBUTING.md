# Contributing to BDR Room

Thank you for your interest in contributing to BDR Room! We welcome contributions from everyone.

## How to Contribute

### 🐛 Bug Reports

1. Check if the bug has already been reported in [Issues](https://github.com/burakdarende/bdr_room/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and system information
   - Screenshots if applicable

### 💡 Feature Requests

1. Check existing issues and discussions
2. Open a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### 📝 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/bdr_room.git
cd bdr_room

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:3000
```

### 🎯 Development Guidelines

#### Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow React hooks best practices
- Maintain consistent formatting

#### Testing Your Changes

1. Test all camera controls (WASD, G+X/Y/Z, C key)
2. Verify debug UI functionality
3. Test perspective ↔ orthographic switching
4. Check performance (no infinite loops)
5. Test in both dev and production modes

#### File Structure

- `/src/components/` - React components
- `/public/models/` - 3D models (GLB/GLTF)
- Configuration in `CAMERA_CONFIG` and `VISUAL_CONFIG`

### 📋 Pull Request Guidelines

#### PR Title Format

- `feat: add new camera control`
- `fix: resolve bloom performance issue`
- `docs: update README installation steps`
- `refactor: optimize material analysis`

#### PR Description Should Include

- What changes were made and why
- How to test the changes
- Screenshots/GIFs for visual changes
- Breaking changes (if any)

#### Before Submitting

- [ ] Code builds without errors
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] Documentation updated if needed

### 🌟 Areas We Welcome Contributions

#### High Priority

- Performance optimizations
- New camera control modes
- Additional lighting presets
- Mobile device support
- Accessibility improvements

#### Medium Priority

- New post-processing effects
- Material enhancement algorithms
- VR/AR support preparation
- Animation system integration

#### Documentation

- Tutorial videos
- Code examples
- Translation to other languages
- Better inline documentation

### ❓ Questions?

- Open a [Discussion](https://github.com/burakdarende/bdr_room/discussions)
- Check existing [Issues](https://github.com/burakdarende/bdr_room/issues)
- Contact: [@burakdarende](https://github.com/burakdarende)

### 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

---

**Thank you for helping make BDR Room better!** 🚀
