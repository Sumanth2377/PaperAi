# PaperAI - Intelligent Research Assistant



PaperAI is an advanced AI-powered tool designed to streamline the literature review process for researchers. Stop wasting hours searching for whether your topic model has been used before. Simply enter your research topic and proposed model, and PaperAI will perform an exhaustive, verified landscape analysis.

## 🚀 Features

- **Topic & Model Scraping**: instantly finds if a specific model has been applied to a research topic.
- **Novelty Assessment**: AI-driven analysis to determine if your approach is unique.
- **Landscape Visualization**: clearly see which models dominate the field.
- **Strict Citation Verification**: **New!** Enhanced algorithms to minimize AI hallucinations and ensure real, verifiable paper links.
- **SOTA Recommendations**: suggests state-of-the-art alternatives if your proposed model is outdated.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons
- **AI Engine**: Google Gemini 2.0 Flash (Optimized for reasoning & fact-checking)
- **Tooling**: Vite

## 🏃 Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sumanth2377/PaperAi.git
   cd PaperAi
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API Key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the App**
   ```bash
   npm run dev
   ```

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

MIT License.
