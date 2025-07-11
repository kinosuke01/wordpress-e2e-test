import { Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;

  // セレクター
  private readonly usernameInput = "#user_login";
  private readonly passwordInput = "#user_pass";
  private readonly rememberMeCheckbox = "#rememberme";
  private readonly submitButton = "#wp-submit";
  private readonly lostPasswordLink =
    'a:has-text("パスワードをお忘れですか ?")';
  private readonly backToBlogLink = "← ブログに戻る";
  private readonly errorMessage = "#login_error";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/wp-login.php");
  }

  async login(username: string, password: string, rememberMe = false) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);

    if (rememberMe) {
      await this.page.check(this.rememberMeCheckbox);
    }

    await this.page.click(this.submitButton);
  }

  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(this.errorMessage);
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  async isLoggedIn(): Promise<boolean> {
    // ログイン成功後は管理画面にリダイレクトされる
    await this.page.waitForLoadState("domcontentloaded");
    return this.page.url().includes("/wp-admin/");
  }

  async clickLostPassword() {
    await this.page.click(this.lostPasswordLink);
  }
}
