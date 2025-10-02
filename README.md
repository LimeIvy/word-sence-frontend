# Next.js テンプレートプロジェクト

このプロジェクトは、Next.js15を使用したフルスタックWeb開発のためのテンプレートプロジェクトです。TypeScript、TailwindCSS、Jest、ESLint、Prettierが事前に設定されており、feature-basedアーキテクチャでスケーラブルな開発を開始できます。

## 技術スタック

- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全なJavaScript
- **TailwindCSS** - ユーティリティファーストのCSSフレームワーク
- **Shadcn/ui** - UIコンポーネント
- **Jest** - テストフレームワーク
- **React Testing Library** - Reactコンポーネントテスト
- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマッター

## 事前設定済みの機能

### 開発環境設定
- VSCode設定（`.vscode/settings.json`）
  - 保存時の自動フォーマット
  - ESLint自動修正
  - インポートの自動整理
  - ファイルタイプ別のフォーマッター設定

### テスト環境設定
- **Jest設定**（`jest.config.ts`）
  - Next.js統合
  - TypeScript対応
  - React Testing Library統合
  - 絶対パス（`@/`）サポート
  - カバレッジレポート

- **テスト構造**
  - Feature-basedアーキテクチャ
  - 機能別テスト分離（`features/*/__test__/`）
  - ユニットテスト・スナップショットテスト対応

### コード品質管理
- **ESLint設定**（`eslint.config.mjs`）
  - Next.js推奨設定
  - TypeScript対応
  - React/React Hooks対応
  - Prettier連携
  - 命名規則の強制

- **Prettier設定**（`.prettierrc`）
  - 一貫したコードフォーマット
  - 100文字の行長制限
  - セミコロン必須
  - ダブルクォート使用

### GitHub設定
- **プルリクエストテンプレート**（`.github/pull_request_template.md`）
  - 変更内容の記録
  - チェックリスト
  - レビュアー指定

## 使用方法

### 開発サーバーの起動

```bash
npm run dev
```

### コード品質チェック

```bash
# ESLintチェック
npm run lint

# ESLint自動修正
npm run lint:fix

# Prettierフォーマットチェック
npm run format

# Prettier自動フォーマット
npm run format:fix

# 両方の修正を実行
npm run fix
```

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモードでテスト実行
npm run test:watch

# 特定の機能のテストのみ実行
npm test -- features/home
```

## プロジェクト構造

このプロジェクトは**feature-basedアーキテクチャ**を採用しています：

```
src/
├── app/                    # Next.js App Router
├── components/             # 共有UIコンポーネント
├── lib/                    # ユーティリティ関数
features/                   # 機能別モジュール
└── home/                   # ホーム機能
    ├── components/         # 機能固有のコンポーネント
    ├── hooks/              # カスタムフック
    └── __test__/           # テストファイル
        ├── home.test.tsx
        └── home.snapshot.test.tsx
```
