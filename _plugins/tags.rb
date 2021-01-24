module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      dir = site.config['tags_dir'] || 'tags'

      # _site/tags/index.html
      site.pages << TagTopPage.new(site, site.source, File.join(dir))

      # _site/tags/${tag}/index.html
      site.tags.each_key do |tag|
        site.pages << TagPage.new(site, site.source, File.join(dir, tag), tag)
      end
    end
  end

  # A Page subclass used in the `TagPageGenerator`
  class TagTopPage < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_plugins', 'tags'), 'index.html')
    end
  end

  # A Page subclass used in the `TagPageGenerator`
  class TagPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_plugins', 'tags'), 'tags.html')
      self.data['tag'] = tag
      self.data['posts'] = site.site_payload['site']['tags'][tag]

      tag_title_prefix = site.config['tag_title_prefix'] || 'Tag: '
      self.data['title'] = "#{tag_title_prefix}#{tag}"
    end
  end
end
