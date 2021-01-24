module Jekyll
  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      dir = site.config['category_dir'] || 'categories'

      # _site/categories/index.html
      site.pages << CategoryTopPage.new(site, site.source, File.join(dir))

      # _site/categories/${category}/index.html
      site.categories.each_key do |category|
        site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
      end
    end
  end

  # A Page subclass used in the `CategoryPageGenerator`
  class CategoryTopPage < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_plugins', 'categories'), 'index.html')
    end
  end

  # A Page subclass used in the `CategoryPageGenerator`
  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_plugins', 'categories'), 'categories.html')
      self.data['category'] = category
      self.data['posts'] = site.site_payload['site']['categories'][category]

      category_title_prefix = site.config['category_title_prefix'] || 'Category: '
      self.data['title'] = "#{category_title_prefix}#{category}"
    end
  end
end
