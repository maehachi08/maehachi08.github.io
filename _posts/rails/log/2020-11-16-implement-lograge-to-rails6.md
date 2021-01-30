---
title: RailsログをlogrageでJSONで出してみた
layout: post
categories:
  - rails
tags:
  - rails
  - lograge
---

Rails6で実装中のAPIサーバのリクエストログ(`log/development.log` 等に出るあれです) をJSONにして出したい。

## 経緯

fluentdが動作するサイドカーコンテナからログ転送する際、in_tailのmultiline formatでパースするのは現実的ではないため。(SQLクエリーのレスポンスタイムはSQLクエリーの情報としてパースしたい、なども)

## 設定

1. Gemfileに必要なライブラリを追加する
   - ログフォーマットにJSONを指定するために `logstash-event` が必要
   - SQLクエリー結果をいい感じにJSONにするために `lograge-sql` が必要

      ```ruby:Gemfile
      gem 'lograge'
      gem 'logstash-event'
      gem 'lograge-sql'
      ```

1. bundle install する

1. `app/controllers/application_controller.rb` にappend_info_to_payloadメソッドを追加
   - logrageのlog eventにdefault以外のレコードを追加したい場合など
   - 後述する `config/initializers/lograge.rb` で(defaultでは入らない)独自の情報をログに出したい場合、ここで payload hashに追加しておく

     ```ruby:app/controllers/application_controller.rb
     class ApplicationController < ActionController::API
       def append_info_to_payload(payload)
         super
         payload[:ip] = request.remote_ip
         payload[:host] = request.host
         payload[:referer] = request.referer
         payload[:user_agent] = request.user_agent
       end
     end
     ``` 

1. logrageの設定を行う

   ```ruby:config/initializers/lograge.rb
   require 'lograge/sql/extension'

   Rails.application.configure do
     config.lograge.enabled = true
     config.lograge.base_controller_class = 'ActionController::API'
     config.lograge.keep_original_rails_log = true
     config.lograge.logger = ActiveSupport::Logger.new "#{Rails.root}/log/json-#{Rails.env}.log"
     config.lograge.formatter = Lograge::Formatters::Json.new

     # enable Lograge::Sql
     # https://github.com/iMacTia/lograge-sql
     config.lograge_sql.keep_default_active_record_log = true

     # Lograge::Sql Customize
     #   - https://github.com/iMacTia/lograge-sql#customization
     #
     # Lograge::Sql デフォルト設定では sql_queries に全手のSQLやdurationがStringで纏まっていて見にくい
     # 以下のようにクエリー毎に分割して可読性を高めておく
     #   "sql_queries": [
     #     {
     #       "name": "Youtube Load",
     #       "duration": 83.85,
     #       "sql": "SELECT `youtubes`.* FROM `youtubes` WHERE `youtubes`.`id` = 'gCxVOXYmqJU' LIMIT 1"
     #     },
     #     ...
     config.lograge_sql.extract_event = Proc.new do |event|
       { name: event.payload[:name], duration: event.duration.to_f.round(2), sql: event.payload[:sql] }
     end
     config.lograge_sql.formatter = Proc.new do |sql_queries|
       sql_queries
     end

     # ログフォーマットをカスタマイズ
     # default(stable):
     #   {
     #     "method": "GET",
     #     "path": "/v1/unit_groups",
     #     "format": "html",
     #     "controller": "V1::UnitGroupsController",
     #     "action": "index",
     #     "status": 200,
     #     "duration": 107.19,
     #     "view": 65.68,
     #     "db": 0
     #   }
     #
     # default(error):
     #   {
     #     "method": "GET",
     #     "path": "/v1/youtubes/aaa",
     #     "format": "html",
     #     "controller": "V1::YoutubesController",
     #     "action": "entry",
     #     "status": 404,
     #     "error": "ActiveRecord::RecordNotFound: Couldn't find Youtube with 'id'=aaa",
     #     "duration": 67.74,
     #     "view": 0,
     #     "db": 62.43
     #   }
     #
     # default formatに対して以下ログ情報を追加する
     config.lograge.custom_options = lambda do |event|
       exceptions = %w(controller action format authenticity_token)
       data = {
         level: 'info',
         host: event.payload[:host],
         ip: event.payload[:ip],
         referer: event.payload[:referer],
         user_agent: event.payload[:user_agent],
         time: Time.now.iso8601,
         params: event.payload[:params].except(*exceptions)
       }
       if event.payload[:exception]
         data[:level] = 'fatal'
         data[:exception] = event.payload[:exception]
         data[:exception_backtrace] = event.payload[:exception_object].backtrace[0..9]
       end
       data
     end
   end
   ```

#### 補足

##### 1. lograge-sql

- https://github.com/iMacTia/lograge-sql
   - logrageにもIssueは起票されているが、現状では将来的に不要になるかもしれない
      - https://github.com/roidrage/lograge/issues/299
      - https://github.com/roidrage/lograge/issues/263

- railsのリクエストログ(default)のSQLクエリーログ

   ```text:
   Processing by V1::UnitGroupsController#index as HTML
     Youtube Load (65.2ms)  SELECT `youtubes`.* FROM `youtubes` ORDER BY published ASC LIMIT 1
     ↳ app/helpers/application_helper.rb:5:in `block in first_entry_datetime'
   ```

- lograge-sql を使ってlogaregeで出したSQLクエリーログ

   ```text:
   {
     "name": "Youtube Load",
     "duration": 66.16,
     "sql": "SELECT `youtubes`.* FROM `youtubes` ORDER BY published ASC LIMIT 1"
   },
   ```

