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

      // ページに「ダッシュボード」というテキスト表示があることを確認
      await expect(
        page.getByRole("heading", { name: "ダッシュボード", level: 1 })
      ).toBeVisible();
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
