# E2E Test Utils

WordPress 向けの End-To-End（E2E）Playwright テストユーティリティ。

*Gutenberg の最小バージョン `9.2.0` または WordPress の最小バージョン `5.6.0` で正しく動作します。*

<div class="callout callout-alert">
このパッケージは現在も積極的に開発中です。ドキュメントは最新でない可能性があり、<code>v0.x</code> のバージョンでは、詳細な移行ガイドなしに破壊的変更が導入されることがあります。早期導入者は、予期せぬ不具合を防ぐために <a href="https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json">lock ファイル</a> を使用することが推奨されます。
</div>

## インストール方法

モジュールをインストールします：

```bash
npm install @wordpress/e2e-test-utils-playwright --save-dev
```

**注意**: このパッケージは、長期サポート（LTS）中の Node.js バージョンが必要です（[LTS のバージョン一覧](https://nodejs.org/en/about/previous-releases) を確認してください）。古いバージョンとは互換性がありません。

## API

### `test`

Playwright の [test](https://playwright.dev/docs/api/class-test) モジュールを拡張したもので、`admin`、`editor`、`pageUtils`、`requestUtils` のフィクスチャが利用できます。

### `expect`

Playwright/Jest の [expect](https://jestjs.io/docs/expect) 関数です。

### Admin

WordPress 管理画面の UI を操作するための E2E テストユーティリティ。

```js
const admin = new Admin( { page, pageUtils } );
await admin.visitAdminPage( 'options-general.php' );
```

### Editor

WordPress ブロックエディタ用の E2E テストユーティリティ。

これらのユーティリティを使用するには、各テストファイル内でインスタンス化します：

```js
test.use( {
	editor: async ( { page }, use ) => {
		await use( new Editor( { page } ) );
	},
} );
```

テストやユーティリティの中で、`canvas` プロパティを使って iframe 内の要素を選択できます：

```js
await editor.canvas.locator( 'role=document[name="Paragraph block"i]' );
```

### PageUtils

ウェブページとやり取りするための汎用的な Playwright ユーティリティ。

```js
const pageUtils = new PageUtils( { page } );
await pageUtils.pressKeys( 'primary+a' );
```

### RequestUtils

WordPress REST API とやり取りするための Playwright ユーティリティ。

リクエストユーティリティのインスタンスを作成：

```js
const requestUtils = await RequestUtils.setup( {
	user: {
		username: 'admin',
		password: 'password',
	},
} );
```

## このパッケージへの貢献について

このパッケージは、Gutenberg プロジェクトの一部として提供されている個別のパッケージです。このプロジェクトはモノレポ（一つのリポジトリに複数のパッケージをまとめた構成）として運営されており、それぞれのパッケージは特定の目的を持った独立したソフトウェアコンポーネントです。これらのパッケージは [npm](https://www.npmjs.com/) に公開され、[WordPress](https://make.wordpress.org/core/) やその他のソフトウェアプロジェクトで利用されています。

このパッケージまたは Gutenberg 全体への貢献方法について詳しく知りたい方は、プロジェクトのメインの [貢献ガイド](https://github.com/WordPress/gutenberg/tree/HEAD/CONTRIBUTING.md) をご覧ください。

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>

---

ref: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/
