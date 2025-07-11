import { test, expect } from "@wordpress/e2e-test-utils-playwright";

test.describe("WordPress 投稿作成", () => {
  test.beforeEach(async ({ admin }) => {
    // 各テストの前に管理画面にアクセス
    await admin.visitAdminPage("/");
  });

  test("新規投稿の作成と公開", async ({ admin, editor, page }) => {
    // 新規投稿を作成
    await admin.createNewPost();

    // タイトルを入力
    await editor.canvas
      .locator('[data-type="core/post-title"]')
      .fill("テスト投稿タイトル");

    // 段落ブロックに内容を入力
    await editor.canvas
      .locator('[data-type="core/paragraph"]')
      .fill("これはテスト投稿の本文です。");

    // 投稿を公開
    await editor.publishPost();

    // 公開完了メッセージを確認
    await expect(page.locator(".components-snackbar")).toContainText(
      "公開しました"
    );
  });

  test("画像ブロックを含む投稿の作成", async ({ admin, editor, page }) => {
    await admin.createNewPost();

    // タイトルを設定
    await editor.canvas
      .locator('[data-type="core/post-title"]')
      .fill("画像付き投稿");

    // 段落ブロックを追加
    await editor.insertBlock({ name: "core/paragraph" });
    await page.keyboard.type("画像の前のテキスト");

    // 画像ブロックを追加
    await editor.insertBlock({ name: "core/image" });

    // メディアライブラリから選択（実際の画像がある場合）
    // この部分は環境に応じて調整が必要

    // 別の段落を追加
    await editor.insertBlock({ name: "core/paragraph" });
    await page.keyboard.type("画像の後のテキスト");

    // 下書き保存
    await editor.saveDraft();

    // 保存完了を確認
    await expect(page.locator(".components-snackbar")).toContainText(
      "下書きを保存しました"
    );
  });

  test("カスタムブロックの使用", async ({ admin, editor, page }) => {
    await admin.createNewPost();

    await editor.canvas
      .locator('[data-type="core/post-title"]')
      .fill("カスタムブロックテスト");

    // 見出しブロックを追加
    await editor.insertBlock({ name: "core/heading" });
    await page.keyboard.type("見出しテキスト");

    // リストブロックを追加
    await editor.insertBlock({ name: "core/list" });
    await page.keyboard.type("リスト項目1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("リスト項目2");
    await page.keyboard.press("Enter");
    await page.keyboard.type("リスト項目3");

    // 引用ブロックを追加
    await editor.insertBlock({ name: "core/quote" });
    await page.keyboard.type("これは引用文です。");

    // プレビュー
    await editor.openPreviewPage();

    // プレビューページでコンテンツを確認
    await expect(page.locator("h1")).toContainText("カスタムブロックテスト");
  });

  test("投稿のカテゴリーとタグ設定", async ({ admin, editor, page }) => {
    await admin.createNewPost();

    // タイトルと本文を入力
    await editor.canvas
      .locator('[data-type="core/post-title"]')
      .fill("カテゴリー付き投稿");
    await editor.canvas
      .locator('[data-type="core/paragraph"]')
      .fill("カテゴリーとタグのテスト");

    // サイドバーを開く（必要に応じて）
    await editor.openDocumentSettingsSidebar();

    // カテゴリーパネルを開く
    const categoriesPanel = page
      .locator(".components-panel__body")
      .filter({ hasText: "カテゴリー" });
    await categoriesPanel.click();

    // タグを追加
    const tagsPanel = page
      .locator(".components-panel__body")
      .filter({ hasText: "タグ" });
    await tagsPanel.click();
    await page.locator('input[placeholder="追加"]').fill("テストタグ");
    await page.keyboard.press("Enter");

    // 投稿を公開
    await editor.publishPost();

    // 公開成功を確認
    await expect(page.locator(".components-snackbar")).toContainText(
      "公開しました"
    );
  });
});
