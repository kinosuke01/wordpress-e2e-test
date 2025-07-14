# WordPress E2Eテスト拡張プラン（最終版）

## 概要
`admin.spec.ts`に以下の2つの新しいテストケースを追加します：
1. **投稿の登録機能のテスト**
2. **画像アップロード機能のテスト**

## 実装予定のテストケース

### 1. 投稿の登録テスト (`"WordPress 投稿管理"`)

```typescript
await test.step("新規投稿作成", async () => {
  // Act: サイドバーメニューから投稿追加ページに移動
  await page.getByRole("link", { name: "投稿を追加" }).click();
  
  // Assert: 投稿作成画面の表示確認
  await expect(page).toHaveURL(/post-new\.php/);
  await expect(page.getByRole("heading", { name: "投稿を追加" })).toBeVisible();
  
  // Act: タイトルとコンテンツを入力
  const testTitle = "E2Eテスト投稿タイトル";
  const testContent = "これはE2Eテスト投稿の内容です。";
  
  await page.frameLocator("iframe").getByRole("textbox", { name: "タイトルを追加" }).fill(testTitle);
  await page.frameLocator("iframe").getByRole("button", { name: "デフォルトブロックを追加" }).click();
  await page.frameLocator("iframe").getByRole("textbox").fill(testContent);
  
  // Act: 公開ボタンをクリック
  await page.getByRole("button", { name: "公開" }).click();
  
  // Assert: 投稿が正常に公開される（メッセージ確認）
  await expect(page.getByText("投稿が公開されました")).toBeVisible();
  
  // Assert: 実際の投稿内容を確認するため、投稿ページを表示
  await page.getByRole("link", { name: "投稿を表示" }).click();
  
  // Assert: 投稿したタイトルと内容が表示されているか確認
  await expect(page.getByRole("heading", { name: testTitle })).toBeVisible();
  await expect(page.getByText(testContent)).toBeVisible();
  
  // Assert: URLが投稿ページのパターンに合致しているか確認
  await expect(page).toHaveURL(new RegExp("e2e.*test.*post"));
});
```

### 2. 画像アップロードテスト (`"WordPress メディア管理"`)

```typescript
await test.step("画像アップロード", async () => {
  // Act: 管理画面のダッシュボードに戻る
  await page.goto("wp-admin");
  
  // Act: サイドバーメニューからメディア追加ページに移動
  await page.getByRole("link", { name: "メディアファイルを追加" }).click();
  
  // Assert: アップロード画面の表示確認
  await expect(page).toHaveURL(/media-new\.php/);
  await expect(page.getByRole("heading", { name: "メディアのアップロード" })).toBeVisible();
  await expect(page.getByText("ファイルをドロップしてアップロード")).toBeVisible();
  
  // Act: テスト用画像ファイルをアップロード
  const testImageName = "test-image.jpg";
  const fileInput = page.getByRole("button", { name: "ファイルを選択" });
  await fileInput.setInputFiles(`tests/fixtures/${testImageName}`);
  
  // Assert: アップロード完了確認
  await expect(page.getByText("アップロード完了")).toBeVisible({ timeout: 10000 });
  
  // Act: サイドバーメニューからメディアライブラリに移動
  await page.getByRole("link", { name: "ライブラリ" }).click();
  
  // Assert: 登録した画像がライブラリに表示されているか確認
  await expect(page.getByText(testImageName)).toBeVisible();
  
  // Act: 実際の画像をクリックして詳細表示
  await page.getByText(testImageName).click();
  
  // Assert: 画像の詳細ページが表示され、画像プレビューが閲覧できるか確認
  await expect(page.getByRole("heading", { name: "メディアを編集" })).toBeVisible();
  await expect(page.locator('img[src*="test-image"]')).toBeVisible();
  
  // Assert: 画像のメタ情報（ファイル名、サイズなど）が表示されているか確認
  await expect(page.getByText(`ファイル名: ${testImageName}`)).toBeVisible();
  
  // Act: 画像のURLリンクをクリックして直接表示できるか確認
  const imageUrl = await page.getByText("ファイルのURL:").locator("+ input").inputValue();
  await page.goto(imageUrl);
  
  // Assert: 画像が直接ブラウザで表示されるか確認
  await expect(page.locator('img')).toBeVisible();
});
```

## ファイル構成
- **テストファイル**: `tests/admin.spec.ts` (既存ファイルに追加)
- **テスト用画像**: `tests/fixtures/test-image.jpg` (新規作成 - 小さなJPEG画像)

## 主な改善点
1. **ナビゲーション方法の変更**: 
   - 直接URLアクセスからサイドバーメニューのクリックによる遷移に変更
   - 「投稿を追加」リンクをクリック
   - 「メディアファイルを追加」リンクをクリック
   - 「ライブラリ」リンクをクリック

2. **ユーザー体験の重視**: 実際のユーザーがWordPress管理画面を操作する流れを再現

## 環境設定要件
- **BASE_URL**: 環境変数でWordPressサイトURL設定
- **認証情報**: 既存のADMIN_ID/ADMIN_PASSWORD環境変数を使用
- **テスト用画像**: 100MB以下の小さなJPEGファイルを作成