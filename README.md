## 概要

このプロジェクトは、Amazonのほしい物リストをスクレイピングし、それをLINE Botが送信する機能を提供します。

このプロジェクトは、主に **_Kindle_** のみのほしい物リストに最適化されています。  
そのため、 **_Kindle_** 以外のアイテムを含むほしい物リストを使用すると、期待通りに機能しない可能性があります。

## プロジェクトの目的と動機

このプロジェクトは、Kindleの価格をLINEを通じて通知を受け取ることを目的としています。  
Kindleの価格は頻繁に変動し、特にセール時には大きく下がることがあります。  
しかし、Kindleの価格はスマホのAmazonアプリからは直接確認できないため、このアプリケーションを作成しました。  
このアプリケーションにより、ユーザーは日々の価格変動を自動で追跡し、お得な情報を逃さずに済みます。

## 通知プレビュー

実際にLINEで受け取るほしい物リストの通知例は以下の通りです。

<img src="https://github.com/GorillaSwe/kindle-wishlist-to-line/assets/52732673/038ef14e-8409-452e-8024-e61d16cf150c" width="340px">

## 通知トリガー

### 定期的な通知

AWS EventBridgeを利用し、設定したスケジュールに従って、ほしい物リストの情報を定期的に送ります。

### メッセージ応答

LINEボットにメッセージが送られた際、それに応じて最新のほしい物リスト情報を返信します。

## 技術的要件

- **Node.js**: このプロジェクトはNode.jsで実装されています。
- **Puppeteer**: Amazonのほしい物リストから情報をスクレイピングするために使用します。
- **LINE Messaging API**: 通知をLINEに送信するために使用します。
- **AWS Lambda**: バックエンドの処理を実行するために使用します。
- **API Gateway**: LINEのWebhookを処理するために使用します。
- **AWS EventBridge**: 定期的な通知をスケジュールするために使用します。
- **Serverless Framework**: AWSへのデプロイと管理を容易にするために使用しています。

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
