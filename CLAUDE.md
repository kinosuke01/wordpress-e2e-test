# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、Playwright を使用した WordPress サイトの包括的な E2E テストスイートです。フロントエンド機能と管理画面機能の両方をテストします。

## 開発コマンド

### テスト実行
```bash
# 全テスト実行
npx playwright test

# 特定のテストファイル実行
npx playwright test tests/frontend.spec.ts
npx playwright test tests/admin.spec.ts

# UIモードでテスト実行
npx playwright test --ui

# デバッグモードでテスト実行
npx playwright test --debug

# テストレポート表示
npx playwright show-report
```

### コード品質管理
```bash
# ESLintによるコードチェック
npm run lint

# ESLintエラーの自動修正
npm run lint:fix

# Prettierによるコードフォーマット
npm run format

# フォーマット確認
npm run format:check
```

## アーキテクチャ

### テスト構造
- `tests/frontend.spec.ts` - WordPressフロントエンドのユーザージャーニーテスト
- `tests/admin.spec.ts` - WordPress管理画面の投稿作成・メディア管理テスト
- `tests/sky.png` - テスト用メディアファイル

### WordPress特有のテストパターン

**ブロックエディター（Gutenberg）での操作:**
- `iframe[name="editor-canvas"]` 内での要素操作が必要
- ブロック追加は「ブロックを追加」ボタンから該当ブロック名を選択

**管理画面ログイン:**
- 環境変数 `ADMIN_ID` と `ADMIN_PASSWORD` を使用
- `/wp-admin/` エンドポイントでログインフォームにアクセス

**メディアアップロード:**
- タイムスタンプベースの動的ファイル名を生成してテストファイルの競合を回避
- アップロード後のクリーンアップを含む

### 設定管理

**環境変数:**
- `BASE_URL` - テスト対象WordPressサイトURL（デフォルト: http://localhost:3000）
- `SCREENSHOT_MODE` - スクリーンショット制御（"off" | "on" | "only-on-failure"）
- `ADMIN_ID` - WordPress管理者ID
- `ADMIN_PASSWORD` - WordPress管理者パスワード

**Playwright設定:**
- 3ブラウザサポート（Chromium, Firefox, WebKit）
- 日本語WordPress環境に最適化
- `test.step()` を使用した段階的テスト実行

## テストパターン

### フロントエンドテスト
1. ホームページ表示確認
2. 投稿詳細ページ遷移
3. 検索機能（結果あり・なし両方）
4. カテゴリページ表示
5. 完全なユーザージャーニーフロー

### 管理画面テスト
1. ログイン → 投稿作成 → メディアアップロード → ログアウトの完全フロー
2. ブロックエディターでのコンテンツ作成
3. 画像ファイルのアップロードと詳細確認

## コード品質

- TypeScript厳密モード
- ESLint + Prettier統合
- Playwright推奨ルール適用
- 日本語コメントによるコード説明