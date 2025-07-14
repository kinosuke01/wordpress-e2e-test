import { test, expect } from "@playwright/test";

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

      // ページがWordPress管理画面に移動したことを確認
      await page.waitForLoadState("networkidle");
    });

    await test.step("ログアウト", async () => {
      // 直接ログアウトURLにアクセス
      await page.goto("wp-admin/");
      await page.goto("wp-login.php?action=logout");

      // ログアウト確認が表示された場合の対応
      const logoutButton = page.getByRole("link", { name: "ログアウト" });
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
      }

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

test.describe("WordPress 投稿管理", () => {
  test("投稿の登録ができること", async ({ page }) => {
    const adminId = process.env.ADMIN_ID || "testuser";
    const adminPassword = process.env.ADMIN_PASSWORD || "testpassword";

    await test.step("ログイン", async () => {
      // wp-adminにアクセス
      await page.goto("wp-admin");

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
      await page.waitForLoadState("networkidle");
    });

    await test.step("新規投稿作成", async () => {
      // Act: 投稿追加ページに移動
      await page.goto("wp-admin/post-new.php");

      // Assert: 投稿作成画面の表示確認
      await expect(page).toHaveURL(/post-new\.php/);
      await page.waitForLoadState("networkidle");

      // Act: タイトルとコンテンツを入力
      const testTitle = "E2Eテスト投稿タイトル";
      const testContent = "これはE2Eテスト投稿の内容です。";

      await page
        .frameLocator("iframe")
        .getByRole("textbox", { name: "タイトルを追加" })
        .fill(testTitle);
      await page
        .frameLocator("iframe")
        .getByRole("button", { name: "デフォルトブロックを追加" })
        .click();
      await page.frameLocator("iframe").getByRole("textbox").fill(testContent);

      // Act: 公開ボタンをクリック
      await page.getByRole("button", { name: "公開" }).first().click();

      // Assert: 投稿が正常に公開される（メッセージ確認）
      await expect(
        page.locator(".components-snackbar__content, .notice, .updated").first()
      ).toBeVisible();

      // Assert: 実際の投稿内容を確認するため、投稿ページを表示
      await page.getByRole("link", { name: "投稿を表示" }).click();

      // Assert: 投稿したタイトルと内容が表示されているか確認
      await expect(
        page.getByRole("heading", { name: testTitle })
      ).toBeVisible();
      await expect(page.getByText(testContent)).toBeVisible();

      // Assert: URLが投稿ページのパターンに合致しているか確認
      await expect(page.url()).toContain("e2e");
    });
  });
});

test.describe("WordPress メディア管理", () => {
  test("画像の登録ができること", async ({ page }) => {
    const adminId = process.env.ADMIN_ID || "testuser";
    const adminPassword = process.env.ADMIN_PASSWORD || "testpassword";

    await test.step("ログイン", async () => {
      // wp-adminにアクセス
      await page.goto("wp-admin");

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
      await page.waitForLoadState("networkidle");
    });

    await test.step("画像アップロード", async () => {
      // Act: メディア追加ページに移動
      await page.goto("wp-admin/media-new.php");

      // Assert: アップロード画面の表示確認
      await expect(page).toHaveURL(/media-new\.php/);
      await page.waitForLoadState("networkidle");

      // Act: テスト用画像ファイルをアップロード
      const testImageName = "test-image.jpg";
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(`tests/fixtures/${testImageName}`);

      // Assert: アップロード完了確認（ページの変化を待つ）
      await page.waitForTimeout(3000);

      // Act: メディアライブラリに移動
      await page.goto("wp-admin/upload.php");

      // Assert: 登録した画像がライブラリに表示されているか確認
      await expect(page.getByText(testImageName)).toBeVisible();

      // Act: 実際の画像をクリックして詳細表示
      await page.getByText(testImageName).click();

      // Assert: 画像の詳細ページが表示され、画像プレビューが閲覧できるか確認
      await expect(
        page.getByRole("heading", { name: "メディアを編集" })
      ).toBeVisible();
      await expect(page.locator('img[src*="test-image"]')).toBeVisible();

      // Assert: 画像のメタ情報が表示されているか確認
      await expect(page.getByText(testImageName)).toBeVisible();
    });
  });
});
