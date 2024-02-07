# Kindle Wishlist to Line

## 概要

このプロジェクトは、Amazonのほしい物リストをLINE Botに自動的に送信するプロセスを自動化します。  
Puppeteerを使用してスクレイピングし、LINE Messaging APIを通知に使用します。

このプロジェクトは、主に **_Kindle_** のほしい物リストに最適化されています。  
そのため、Kindle以外のアイテムを含むほしい物リストを使用すると、期待通りに機能しない可能性があります。

## 準備

### 1. リポジトリのクローン

    $ git clone https://github.com/GorillaSwe/kindle-wishlist-to-line.git

### 2. AWS IAM と AWS CLI の設定

- IAMユーザーを作成し、AWS LambdaとAPI Gatewayに必要な権限を割り当てます。
- AWS CLIをインストールし、IAMユーザーの認証情報で設定します。

### 3. パッケージのインストール

    $ npm install

### 4. Line Bot の準備

- LINE Messaging APIチャネルを作成します。
- Webhookを有効にします。
- `CHANNEL_ACCESS_TOKEN`、`CHANNEL_SECRET`、および`USER_ID`を取得します。

### 5. `.env` ファイルの準備

- LINE Messaging APIの認証情報とAmazonのほしい物リストのURLを.envファイルに記入します。
- Amazonのほしい物リストが **_公開_** に設定されていることを確認します。

```dosini
# .env
CHANNEL_ACCESS_TOKEN=[Your Line Access Token]
CHANNEL_SECRET=[Your Line Channel Secret]
USER_ID=[Your Line User ID]
AMAZON_WISHLIST_URL=[Your Amazon Wishlist URL]
```

### 6. AWS へのデプロイ

    $ npm run deploy

- Lambda関数がデプロイされ、API GatewayのエンドポイントURLが表示されます。

### 7. Webhook URL の設定

- LINE Developersダッシュボードで、エンドポイントURLをLINEボットのWebhook URLに設定します。

## 通知トリガー

このアプリケーションは、2つのシナリオでLINEに通知を送ります。

### 1. スケジュール通知

定義されたスケジュールに基づいて自動的に通知が送られます。  
AWS EventBridgeを使用して設定されたスケジュールに従い、ほしい物リストを定期的にLINEに通知します。

### 2. メッセージに対する返信

LINEボットへのメッセージ送信をトリガーとして、最新のほしい物リストを返信します。
