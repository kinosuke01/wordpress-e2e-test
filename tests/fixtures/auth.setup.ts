import { test as setup } from "@wordpress/e2e-test-utils-playwright";

const authFile = "tests/.auth/user.json";

setup("authenticate", async ({ page, admin }) => {
  // WordPress の管理画面にログイン
  await admin.visitAdminPage("/");

  // 認証状態を保存
  await page.context().storageState({ path: authFile });
});
