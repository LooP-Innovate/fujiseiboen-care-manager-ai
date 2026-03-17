<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wzsnJ-a23YCfSvypE_257OiEYrhv42XL

## AI Provider Configuration

このアプリケーションは、Vertex AI (Gemini) と OpenAI のマルチプロバイダーに対応しています。

### 1. 共通の設定 (.env)
`.env.example` を参考に、提供された環境変数を設定してください。

- `AI_PROVIDER`: 使用するプロバイダー (`vertex` または `openai`)
- `AUTO_FALLBACK`: プライマリが失敗した際に、自動でセカンダリに切り替えるか (`true`/`false`)
- `SECONDARY_PROVIDER`: 切り替え先のプロバイダー

### 2. OpenAI 設定
- `OPENAI_API_KEY`: [OpenAI Dashboard](https://platform.openai.com/api-keys) から取得
- `OPENAI_MODEL`: 使用するモデル (例: `gpt-4o`)

### 3. Vertex AI (Gemini) 設定
以下のいずれかの方式で認証可能です。

#### A. APIキー方式 (推奨: ローカル開発)
- `GEMINI_API_KEY`: [Google AI Studio](https://aistudio.google.com/app/apikey) から取得
- `VERTEX_MODEL`: `gemini-1.5-pro` など

#### B. ADC / サービスアカウント方式 (推奨: 本番運用)
Google Cloud 上で実行する場合や、`gcloud auth application-default login` を実行済みの環境で使用します。
- `GOOGLE_CLOUD_PROJECT`: プロジェクトID
- `GOOGLE_CLOUD_LOCATION`: リージョン (例: `us-central1`)
- `VERTEX_MODEL`: モデル名

### 4. 認証手順のまとめ

| 環境 | 推奨方式 | 必要事項 |
| :--- | :--- | :--- |
| **ローカル開発** | APIキー | `.env.local` に `GEMINI_API_KEY` または `OPENAI_API_KEY` を設定 |
| **本番 (GCP/Render等)** | サービスアカウント (ADC) | 環境変数 `GOOGLE_APPLICATION_CREDENTIALS` または実行環境の権限を利用 |

## セットアップ手順

1. 依存関係のインストール:
   ```bash
   npm install
   ```
2. 環境変数の設定:
   `cp .env.example .env.local` を行い、内容を編集してください。
3. アプリケーションの起動:
   ```bash
   npm run dev
   ```
