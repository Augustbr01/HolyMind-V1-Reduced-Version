# HolyMind

> 📖 An intelligent biblical learning platform powered by AI

A web application that helps users understand Bible passages through multiple perspectives and study methods. HolyMind leverages AI to provide comprehensive explanations, historical context, and devotional insights suitable for all levels of biblical knowledge.

---

## ✨ Features

- **📖 General Explanation** - Understand Bible passages in simple, accessible language
- **💼 Practical Interpretation** - Discover how biblical teachings apply to everyday life  
- **🏛️ Theological Analysis** - Deep theological insights and scholarly perspective
- **📜 Historical Context** - Explore the historical background and cultural setting of passages
- **📚 Study Guide** - Structured learning with key points and reflection questions
- **✨ Devotional** - Spiritual reflection and personal meditation on passages

---

## 🛠️ Tech Stack

- **Backend:** FastAPI 0.104.1, Python 3.9+
- **Frontend:** HTML, CSS, JavaScript
- **AI:** OpenAI API (GPT-4o Mini)
- **Server:** Uvicorn with standard features
- **Environment:** python-dotenv for secure configuration

---

## 📋 Requirements

- **Python 3.9+**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/))
- **pip** (Python package manager)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/EnzoHashinokutiXavier/HolyMind-V1-Reduced-Version.git
cd HolyMind
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

  On Windows (Command Prompt):
   ```sh
   setx OPENAI_API_KEY "your-openai-key"
   ```
   Note: After running this command, close your terminal and open a new one before starting the backend, so the environment variable is recognized.
   
   On Linux/Mac:
   ```sh
   export OPENAI_API_KEY="your-openai-key"
   ```

> ⚠️ **Important Notes:**
> - Get your API key from: https://platform.openai.com/

### 4. Start the Application

```bash
uvicorn backend.main:app --reload
```

The application will be available at: **http://localhost:8000**

---

## 📚 API Endpoints

All endpoints accept a JSON POST request with the Bible passage reference or text.

| Endpoint | Description | Best For |
|----------|-------------|----------|
| `/general-explanation` | Simple, accessible explanation | Beginners & quick understanding |
| `/practical-explanation` | Real-world application of teachings | Applying lessons to daily life |
| `/interpretations-explanation` | Theological analysis | Advanced theological study |
| `/historical-explanation` | Historical & cultural context | Understanding passage origins |
| `/study-guide-explanation` | Structured study material | Organized learning & reflection |
| `/devotional-explanation` | Spiritual meditation & reflection | Personal spiritual growth |
| `/` (GET) | Serve the web interface | Browser access |

---

## 📖 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](.github/CODE_OF_CONDUCT.md)** - Community guidelines
- **[Security Policy](.github/SECURITY.md)** - Reporting security vulnerabilities
- **[License](LICENSE)** - PolyForm Noncommercial License with HolyMind Brand Protection

---

## 🤝 Contributors

## [Enzo Hashinokuti](https://github.com/EnzoHashinokutiXavier)

<img src="https://avatars.githubusercontent.com/u/197978282?v=4" width="100" height="100" />

### Creator of the project's first prototype.
Backend Python developer.

## [Augusto Corrêa](https://github.com/Augustbr01)

<img src="https://avatars.githubusercontent.com/u/64938228?v=4" width="100" height="100" />

### Co-creator of the project's first prototype.
Frontend JavaScript and HTML developer.

## [Geovana](https://github.com/Geovana-Manu)

<img src="https://avatars.githubusercontent.com/u/120032533?v=4" width="100" height="100" />

### Stylized the first version of the project. 
Frontend CSS designer.

## [Luiz Eduardo](https://github.com/LuizEduardoMarchi)

<img src="https://avatars.githubusercontent.com/u/228020706?v=4" width="100" height="100" />

### Contributor to the visual planning of the project's future
JavaScript developer.


