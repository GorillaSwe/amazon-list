## 概要

Amazonのほしい物リストをスクレイピングし、その情報を通知するLINE Botを作成しました。  
特に **_Kindle_** 向けに最適化されています。

Amazon EventBridgeによる定期実行、もしくはメッセージに対する応答として、Kindle版と紙の本の価格やポイントを通知するLINE Botです。

詳細な構築手順は、Qiitaの記事に記載しています。  
興味のある方は是非チェックしてみてください。  
https://qiita.com/GorillaSwe/items/fc207dd6abc1cd0589ef

![kindle-wishlist-to-line](https://github.com/GorillaSwe/kindle-wishlist-to-line/assets/52732673/6b12835f-a920-44a1-aaa0-c52ae0c75177)

## プロジェクトの目的と動機

Kindleの値下げを見逃さないために開発しました。

Kindleの価格はセール時に大きく下がることがありますが、AmazonのスマホアプリではKindleの価格を確認できず、値下げを逃すことがしばしばありました。  
その課題を解決するために、このLINE Botを作りました。

# 技術スタック

技術スタックは以下のようになっています。

![technology-stack](https://github.com/GorillaSwe/kindle-wishlist-to-line/assets/52732673/26839f5a-8cc0-416f-98eb-3088a6b7eca2)

- **Node.js**: このプロジェクトはNode.jsで実装されています。
- **Puppeteer**: Amazonのほしい物リストから情報をスクレイピングするために使用します。
- **LINE Messaging API**: 通知をLINEに送信するために使用します。
- **ServerlessFramework**: AWSへのデプロイと管理を容易にするために使用しています。
- **AWS Lambda**: バックエンドの処理を実行するために使用します。
- **API Gateway**: LINEのWebhookを処理するために使用します。
- **Amazon EventBridge**: 定期的な通知をスケジュールするために使用します。

## 構築手順

このプロジェクトでは、ほしい物リストのURLを環境変数で設定して利用します。  
そのため、各ユーザーが自身のほしい物リストに合わせて設定を行う必要があります。

### 1. リポジトリのクローン

    $ git clone https://github.com/GorillaSwe/kindle-wishlist-to-line.git

### 2. ServerlessFramework が使う IAMユーザーの作成 と AWS CLI の設定

- IAMユーザーを作成し、必要な権限を割り当てます。
- AWS CLIをインストールし、IAMユーザーの認証情報で設定します。

### 3. Line Bot の準備

- LINE Messaging APIチャネルを作成します。
- `CHANNEL_ACCESS_TOKEN`、`CHANNEL_SECRET`、および`USER_ID`を取得します。

### 4. パッケージのインストール

    $ npm install

### 5. `.env` ファイルの準備

- プロジェクトルート直下に.envファイルを作成します。
- LINE Messaging APIの認証情報とAmazonのほしい物リストのURLを.envファイルに記入します。
- Amazonのほしい物リストが**公開**に設定されていることを確認します。

```dosini
# .env
AMAZON_WISHLIST_URL="Your Amazon Wishlist URL"
CHANNEL_ACCESS_TOKEN="Your LINE Access Token"
CHANNEL_SECRET="Your LINE Channel Secret"
USER_ID="Your LINE User ID"
```

### 6. AWS へのデプロイ

- 以下コマンドでAWSへのデプロイが実行され、API GatewayのエンドポイントURLが表示されます。

```dosini
$ npm run deploy
 （中略）
 Deploying kindle-wishlist-to-line to stage dev (ap-northeast-1)
 ✔ Service deployed to stack kindle-wishlist-to-line-dev (49s)

 endpoint: POST - https://XXXXXXXXX.execute-api.ap-northeast-1.amazonaws.com/dev/webhook
  functions:
   lineWebhookHandler: kindle-wishlist-to-line-dev-lineWebhookHandler (71 MB)
   scheduledHandler: kindle-wishlist-to-line-dev-scheduledHandler (71 MB)
```

### 7. Webhook URL の設定

LINE Developersで、取得したAPI GatewayのエンドポイントURLを**Webhook URL**に設定します。

### 8. 結果

Amazon EventBridgeによる定期実行、もしくはメッセージに対する応答時に以下のように出力されます。
![kindle-wishlist-to-line](https://github.com/GorillaSwe/kindle-wishlist-to-line/assets/52732673/6b12835f-a920-44a1-aaa0-c52ae0c75177)

### 定期実行のタイミング変更

`serverless.yml`でAmazon EventBridgeの定期実行を定義しています。  
現状は日本時間の朝7時に設定していますが、変更したい場合は`rate: cron(0 22 * * ? *)`を修正して下さい。  
Amazon EventBridgeでは、Cronで設定するイベント時刻はタイムゾーンがUTC（協定世界時）となっているため、日本標準時（JST）との時差を考慮して下さい。

```yml
functions:
  scheduledHandler:
    handler: src/handlers/scheduledHandler.handleScheduledEvent
    events:
      - schedule:
          rate: cron(0 22 * * ? *)
          enabled: true
```

## 注意点

Amazonへのスクレイピングを行う際は、アクセス頻度や速度に注意して下さい。  
サーバーに過度な負荷をかけてしまうと、偽計業務妨害罪に問われる可能性があるので、使用する際は十分にご注意ください。
