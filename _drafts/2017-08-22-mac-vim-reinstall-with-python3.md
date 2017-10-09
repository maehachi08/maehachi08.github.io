
Python開発環境を vim で構築するのであれば、最新の python3 と vim を Homebrewでインストールしましょう。
vimは内部で利用可能なプログラミング言語、そのバージョンなどが決まっています。これはvimインストール時に決まります。

```
brew install python3
brew install vim --with-python3 --with-lua
brew install tmux
brew install reattach-to-user-namespace
```

`vim --version` で **+python3** があれば

```sh
$ vim --version | grep python
+cryptv          +linebreak       -python          +viminfo
+cscope          +lispindent      +python3         +vreplace
Linking: clang   -L. -fstack-protector -L/usr/local/lib -L/usr/local/opt/libyaml/lib -L/usr/local/opt/openssl/lib -L/usr/local/opt/readline/lib  -L/usr/local/lib -o vim        -lncurses -liconv -framework Cocoa  -L/usr/local/lib -llua -mmacosx-version-min=10.12 -fstack-protector-strong -L/usr/local/lib  -L/usr/local/Cellar/perl/5.26.0/lib/perl5/5.26.0/darwin-thread-multi-2level/CORE -lperl -lm -lutil -lc  -L/usr/local/opt/python3/Frameworks/Python.framework/Versions/3.6/lib/python3.6/config-3.6m-darwin -lpython3.6m -framework CoreFoundation  -lruby.2.4.1 -lobjc
```

