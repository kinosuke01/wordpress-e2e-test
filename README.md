# WordPress E2E テストスイート

このプロジェクトは、Playwright を使用した WordPress サイトの包括的な End-to-End テストスイートです。フロントエンド機能と管理画面機能の両方を自動テストでカバーします。

## 機能

- **フロントエンドテスト**: ホームページ、投稿ページ、検索機能、カテゴリページのテスト
- **管理画面テスト**: ログイン、投稿作成（ブロックエディター）、メディアアップロード、ログアウト
- **多言語対応**: 日本語 WordPress 環境に最適化
- **複数ブラウザサポート**: Chromium、Firefox、WebKit での並列テスト実行

## セットアップ

### 前提条件

- Node.js (推奨バージョン: 18以上)
- WordPress サイト（ローカル開発環境またはテストサーバー）
- WordPress 管理者アカウント

### インストール

```bash
# 依存関係のインストール
npm install

# Playwright ブラウザのインストール
npx playwright install
```

### 環境変数設定

プロジェクトルートに `.env` ファイルを作成し、以下の設定を行ってください：

```env
# WordPress サイトのベースURL
BASE_URL=http://localhost:3000

# スクリーンショット設定 (off | on | only-on-failure)
SCREENSHOT_MODE=only-on-failure

# WordPress 管理者認証情報
ADMIN_ID=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## テスト実行

### 基本的なテスト実行

```bash
# 全テスト実行
npx playwright test

# 特定のテストファイルのみ実行
npx playwright test tests/frontend.spec.ts
npx playwright test tests/admin.spec.ts

# UIモードでインタラクティブにテスト実行
npx playwright test --ui

# デバッグモードでテスト実行
npx playwright test --debug
```

### テストレポート

```bash
# テストレポートの表示
npx playwright show-report
```

## テスト内容

### フロントエンドテスト (`tests/frontend.spec.ts`)

1. **ホームページ表示**: 「Hello world!」投稿の表示確認
2. **投稿詳細ページ**: Hello world! 投稿への遷移とコンテンツ確認
3. **サンプルページ**: 固定ページの表示とコンテンツ確認
4. **検索機能**: 
   - 「hello」での検索（結果あり）
   - 「bye」での検索（結果なし）
5. **カテゴリページ**: 未分類カテゴリの表示確認
6. **ユーザージャーニー**: 複数ページを跨いだナビゲーションテスト

### 管理画面テスト (`tests/admin.spec.ts`)

1. **ログイン**: WordPress 管理画面へのアクセスと認証
2. **投稿作成**: ブロックエディター（Gutenberg）を使用した新規投稿作成
3. **メディア管理**: 
   - 画像ファイルのアップロード
   - メディアライブラリでの確認
   - 画像ファイルの詳細情報確認
4. **ログアウト**: セッション終了の確認

## 開発

### コード品質管理

```bash
# ESLint によるコードチェック
npm run lint

# ESLint エラーの自動修正
npm run lint:fix

# Prettier によるコードフォーマット
npm run format

# フォーマット確認
npm run format:check
```

### テスト追加時の注意点

- **ブロックエディター**: `iframe[name="editor-canvas"]` 内での要素操作が必要
- **動的リソース**: ファイル名にタイムスタンプを含めて競合を回避
- **段階的テスト**: `test.step()` を使用してテスト手順を明確化
- **日本語対応**: UI要素やメッセージの日本語表記に対応

## 技術スタック

- **テストフレームワーク**: Playwright
- **言語**: TypeScript
- **コード品質**: ESLint + Prettier
- **対象**: WordPress (日本語環境)

## ライセンス

MIT License
