import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.describe("WordPress ログイン/ログアウト", () => {
  test("WordPress管理画面へのログインとログアウト", async ({ page }) => {
    const adminId = process.env.ADMIN_ID || "testuser";
    const adminPassword = process.env.ADMIN_PASSWORD || "testpassword";

    await test.step("ログイン", async () => {
      // wp-adminにアクセス
      await page.goto("wp-admin");

      // ログイン画面へのリダイレクトを確認
      await expect(page).toHaveURL(/wp-login\.php/);

      // ログインID入力欄/パスワード入力欄/ログインボタンが表示されていることを確認
      await expect(
        page.getByRole("textbox", { name: "ユーザー名またはメールアドレス" })
      ).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "パスワード" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "ログイン" })
      ).toBeVisible();

      // ログインIDを入力
      await page
        .getByRole("textbox", { name: "ユーザー名またはメールアドレス" })
        .fill(adminId);

      // パスワードを入力
      await page
        .getByRole("textbox", { name: "パスワード" })
        .fill(adminPassword);

      // ログインボタンをクリック
      await page.getByRole("button", { name: "ログイン" }).click();

      // ダッシュボードへのリダイレクトを確認
      await expect(page).toHaveURL(/wp-admin/);

      // ページに「ダッシュボード」というテキスト表示があることを確認
      await expect(
        page.getByRole("heading", { name: "ダッシュボード", level: 1 })
      ).toBeVisible();
    });

    await test.step("投稿作成とメディア管理", async () => {
      // サイドバーメニューから投稿追加ページに移動
      await page.getByRole("link", { name: "投稿", exact: true }).click();
      await page
        .locator("#wpbody-content")
        .getByRole("link", { name: "投稿を追加" })
        .click();

      // 投稿作成画面の表示確認
      await expect(page).toHaveURL(/post-new\.php/);
      await expect(
        page.getByRole("heading", { name: "投稿を追加", level: 1 })
      ).toBeVisible();

      // タイトルとコンテンツを入力
      const postTitle = "E2Eテスト投稿タイトル";
      const postContent =
        "これはE2Eテスト用の投稿です。Playwrightを使用してWordPressの投稿機能をテストしています。この投稿には画像の追加やメディアライブラリの確認も含まれます。";

      await page
        .locator('iframe[name="editor-canvas"]')
        .contentFrame()
        .getByRole("textbox", { name: "タイトルを追加" })
        .fill(postTitle);
      await page
        .locator('iframe[name="editor-canvas"]')
        .contentFrame()
        .getByRole("button", { name: "デフォルトブロックを追加" })
        .click();
      await page
        .locator('iframe[name="editor-canvas"]')
        .contentFrame()
        .getByRole("document", {
          name: "空のブロックです。文章を入力するか、/ からブロックを選択しましょう",
        })
        .fill(postContent);

      // 公開ボタンをクリック
      await page.getByRole("button", { name: "公開", exact: true }).click();
      await page
        .getByLabel("エディターの投稿パネル")
        .getByRole("button", { name: "公開", exact: true })
        .click();

      // 投稿が正常に公開される（メッセージ確認）
      await expect(page.getByTestId("snackbar")).toContainText(
        "投稿を公開しました。"
      );

      // 実際の投稿内容を確認するため、投稿ページを表示
      await page
        .getByLabel("エディターの投稿パネル")
        .getByRole("link", { name: "投稿を表示" })
        .click();

      // 投稿したタイトルと内容が表示されているか確認
      await expect(
        page.getByRole("heading", { name: postTitle, level: 1 })
      ).toBeVisible();
      await expect(page.getByText(postContent)).toBeVisible();

      // URLが投稿ページのパターンに合致しているか確認
      await expect(page).toHaveURL(/\/e2e.*\//);

      // 管理画面のダッシュボードに戻る
      await page.goto("wp-admin");
      await expect(
        page.getByRole("heading", { name: "ダッシュボード", level: 1 })
      ).toBeVisible();

      // サイドバーメニューからメディア追加ページに移動
      await page
        .locator("#menu-media")
        .getByRole("link", { name: "メディア", exact: true })
        .click();

      // アップロード画面の表示確認
      await expect(page).toHaveURL(/upload\.php/);
      await expect(
        page.getByRole("heading", { name: "メディアライブラリ", level: 1 })
      ).toBeVisible();

      // 動的ファイル名を生成（タイムスタンプベース）
      const timestamp = Date.now();
      const originalFileName = "sky.png";
      const dynamicFileName = `test-sky-${timestamp}.png`;
      const originalFilePath = path.join("tests", originalFileName);
      const dynamicFilePath = path.join("tests", dynamicFileName);
      const fileNameWithoutExt = `test-sky-${timestamp}`;

      // 元ファイルを新しい名前でコピー
      fs.copyFileSync(originalFilePath, dynamicFilePath);

      // テスト用画像ファイルをアップロード
      await page
        .getByRole("button", { name: "メディアファイルを追加" })
        .click();
      await expect(
        page.getByRole("heading", {
          name: "ファイルをドロップしてアップロード",
          level: 2,
        })
      ).toBeVisible();

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(dynamicFilePath);

      // アップロード完了確認
      await expect(
        page.getByText(/\d+件 \(\d+件中\) のメディア項目を表示中/)
      ).toBeVisible();

      // アップローダーを閉じる
      await page
        .getByRole("button", { name: " アップローダーを閉じる" })
        .click();

      // 登録した画像がライブラリに表示されているか確認
      await expect(
        page.getByRole("checkbox", {
          name: fileNameWithoutExt,
        })
      ).toBeVisible();

      // 実際の画像をクリックして詳細表示
      await page
        .getByRole("checkbox", {
          name: fileNameWithoutExt,
        })
        .click();

      // 画像の詳細ページが表示され、画像プレビューが閲覧できるか確認
      await expect(
        page.getByRole("heading", { name: "添付ファイルの詳細", level: 1 })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "添付ファイルのプレビュー",
          level: 2,
        })
      ).toBeVisible();

      // 画像のメタ情報（ファイル名、サイズなど）が表示されているか確認
      await expect(
        page.getByText("ファイル名:", { exact: true })
      ).toBeVisible();
      await expect(page.getByText("ファイルタイプ: image/png")).toBeVisible();
      await expect(
        page.getByText("ファイルサイズ:", { exact: true })
      ).toBeVisible();
      await expect(page.getByText("サイズ:", { exact: true })).toBeVisible();

      // 画像のURLリンクをクリックして直接表示できるか確認
      await page.getByRole("link", { name: "ファイルをダウンロード" }).click();

      // 画像が直接ブラウザで表示されるか確認
      const expectedURLPattern = new RegExp(`${fileNameWithoutExt}.*\\.png$`);
      await expect(page).toHaveURL(expectedURLPattern);
      await expect(page.getByRole("img")).toBeVisible();

      // 管理画面に戻る
      await page.goto("wp-admin");

      // テスト用ファイルのクリーンアップ
      try {
        if (fs.existsSync(dynamicFilePath)) {
          fs.unlinkSync(dynamicFilePath);
        }
      } catch (error) {
        console.warn(`Failed to cleanup test file: ${dynamicFilePath}`, error);
      }
    });

    await test.step("ログアウト", async () => {
      // 右上のユーザーアイコンにマウスオーバー
      await page
        .getByRole("menuitem", { name: `こんにちは、${adminId} さん` })
        .hover();

      // ログアウトリンクをクリック
      await page.getByRole("menuitem", { name: "ログアウト" }).click();

      // ログイン画面へのリダイレクトを確認
      await expect(page).toHaveURL(/wp-login\.php/);

      // ログインID入力欄/パスワード入力欄/ログインボタンが表示されていることを確認
      await expect(
        page.getByRole("textbox", { name: "ユーザー名またはメールアドレス" })
      ).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "パスワード" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "ログイン" })
      ).toBeVisible();
    });
  });
});
