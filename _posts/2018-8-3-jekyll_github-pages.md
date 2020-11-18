---
layout: posts
title:  "jekyll + GitHub Pages"
date:   2018-08-3 21:00:01 -0600
categories:
  - jekyll
  - GitHub Pages
---

[jekyll](https://jekyllrb.com/)とは、**MarkdownからHTMLを生成する静的サイトジェネレータ** です。
Markdownファイルにあれこれ書いてコマンドでHTMLに変換できます。

[GitHub Pages](https://pages.github.com/)とは、 **GitHubレポジトリに置いたHTMLを公開することができるホスティングサービス** です。

これらを組み合わせることで普段書き慣れたMarkdownを使い、面倒なサーバ管理などもせず、ブログなどのサイトを公開することが可能です。

備忘メモとして、勉強したことを書き留めて置こうと思います。

---

## GitHub Pages

[pages.github.com](https://pages.github.com/)

[![](/images/github_pages_top.jpg)](https://pages.github.com/)

**[GitHub Pages](https://pages.github.com/)**とは、`username.github.io` というレポジトリに静的コンテンツを置くことでWebサイトとして公開できるものです。
WebサイトのデフォルトURLはレポジトリ名と同じ`http://username.github.io`となります。
ちなみに、`username`は自分のGitHubアカウント名に置き換えてください。

**GitHub Pages**としてWebページを作成することでコンテンツをGit管理にできるほか、GitHubレポジトリに置けることでバックアップとしての意味合いも果たします。


この[サイト](https://maehachi08.github.io/) は静的ファイルジェネレータの[mojombo/jekyll](https://github.com/jekyll/jekyll)を使って生成したHTMLを **GitHub Pages** で公開しています。

---

## jekyll

### 1. インストール

`jekyll` は[Gemsライブラリ](https://rubygems.org/gems/jekyll) として登録されているので `gem install` で入ります。

  ```sh
$ gem install jekyll
$ jekyll --version
jekyll 3.8.3
```

### 2. サイトの作成

`jekyll` でサイトを構築するには `jekyll new` コマンドで作成します。

  ```
$ bundle exec jekyll new jekyll-sites --force
$ cd jekyll-sites/
```

### 3. ディレクトリ構成
   * `jekyll new` コマンド実行直後のディレクトリ構成は以下のとおりである
   * 詳細は[Directory structure](https://jekyllrb.com/docs/structure/) を参照ください

```
jekyll-sites/
    ├ 404.html
    ├ Gemfile
    ├ Gemfile.lock
    │
    │ # jekyll の設定ファイル
    │ # refs https://jekyllrb.com/docs/configuration/
    ├ _config.yml
    │
    │ # /about/ にアクセスした際に表示されるページ
    ├ about.md
    │
    │ # buildした際の _site/index.html のソース
    ├ index.md
    │
    │ # 投稿記事(動的コンテンツ)の置き場
    └_posts
        │
        │ # welcomeページ
        └2017-10-08-welcome-to-jekyll.markdown

```

### 4. ローカルで公開してみる

Markdownで書いた記事などをローカルのブラウザで簡単に確認できる様に `jekyll serve` コマンドで組み込みのWebサーバを起動することができます。
serveサブコマンドのオプションはたくさんあるので `--help` オプションで確認して欲しいですが、私がよく使うのは以下のパターンです。
  ```
$ jekyll server
$ jekyll server --skip-initial-build
$ jekyll server --detach
$ jekyll server --drafts
  ```

  * `jekyll server`
     * フォアグラウンドで起動し、デフォルトでは `127.0.0.1:4000` で起動します
     * buildが実行され、 `_sites` ディレクトリ以下に公開用HTMLが生成される
  * `--skip-initial-build` オプションで 公開用HTMLを生成しない(buildをskip)
    * https://github.com/jekyll/jekyll/blob/master/lib/jekyll/commands/build.rb#L32-L34
  * `--detach` オプションでバッグラウンドで起動します
  * `--drafts` オプションで `_drafts` ディレクトリ以下を公開用HTMLが生成される

#### buildで生成される `_sites` ディレクトリ以下の構成

  ```
jekyll-sites/
    │
    │ # 投稿記事(動的コンテンツ)の置き場
    └_site/
        │
        ├ 404.html
        │
        ├ feed.xml
        │
        ├ index.html
        │
        │
        ├ about
        │    └ index.html
        │
        │
        ├ assets
        │    ├ minima-social-icons.svg
        │    └ main.css
        │
        └jekyll
             └ _site/jekyll/update/YYY/mm/dd/welcome-to-jekyll.html

  ```

### 5. ブラウザでアクセスしてみる

`jekyll server` コマンドを実行したローカル環境のブラウザで `http://127.0.0.1:4000/` にアクセスすると以下のようなページが表示されれば、組み込みサーバが起動していることになります。

  ![](/images/jekyll_first_top.png)

