import { test, expect } from "@wordpress/e2e-test-utils-playwright";
import { LoginPage } from "../pages/LoginPage";

test.describe("WordPress ログイン", () => {
  let loginPage: LoginPage;

  test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page);
  });

  test("正常なログイン", async ({ page, admin }) => {
    // @wordpress/e2e-test-utils-playwright の admin を使用したログイン
    await admin.visitAdminPage("/");

    // ダッシュボードが表示されることを確認
    await expect(page).toHaveTitle(/ダッシュボード/);
    await expect(page).toHaveURL(/wp-admin/);
  });

  test("Page Object Model を使用したログイン", async ({ page }) => {
    // Page Object Model を使用
    await loginPage.goto();

    // ログインフォームが表示されることを確認
    await expect(page.locator("#loginform")).toBeVisible();

    // 環境変数からユーザー情報を取得（または設定ファイルから）
    const username = process.env.WP_USERNAME ?? "admin";
    const password = process.env.WP_PASSWORD ?? "password";

    // ログイン実行
    await loginPage.login(username, password);

    // ログイン成功を確認
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test("無効な認証情報でのログイン失敗", async () => {
    await loginPage.goto();

    // 無効な認証情報でログイン試行
    await loginPage.login("invalid_user", "wrong_password");

    // エラーメッセージが表示されることを確認
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain("ユーザー名");
  });

  test("管理画面の主要セクションへのアクセス", async ({ admin, page }) => {
    // 投稿一覧へアクセス
    await admin.visitAdminPage("edit.php");
    await expect(page).toHaveTitle(/投稿/);

    // メディアライブラリへアクセス
    await admin.visitAdminPage("upload.php");
    await expect(page).toHaveTitle(/メディア/);

    // プラグイン一覧へアクセス
    await admin.visitAdminPage("plugins.php");
    await expect(page).toHaveTitle(/プラグイン/);
  });
});
