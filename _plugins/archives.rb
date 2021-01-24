require "time"

module Jekyll
  class ArchivesPageGenerator < Generator
    safe true

    def generate(site)
      dir = site.config['archives_dir'] || 'archives'

      # _site/archives/index.html
      site.pages << ArchivesPage.new(site, site.source, dir)
    end
  end

  # A Page subclass used in the `TagPageGenerator`
  class ArchivesPage < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'archives.html')

      posts_year_month = {}
      site.posts.docs.each do |post|
        tags = [ post['tags'].join(', ') ]
        post_data = {
          :url             => post['url'],
          :title           => post['title'],
          :date            => post['date'],
          :tags            => tags,
          :thumbnail       => defined?(post['thumbnail']) ? post['thumbnail'] : '',
          :content         => post['content'],
          :content_excerpt => post['excerpt']
        }

        post_date = ::Time.parse(post['date'].to_s)
        year = post_date.year.to_s
        month = post_date.month.to_s

        unless posts_year_month.has_key?(year)
          posts_year_month[year] = {}
        end

        unless posts_year_month[year].include?(month)
          posts_year_month[year][month] = []
        end

        posts_year_month[year][month] << post_data
      end

      self.data['posts_year_month'] = posts_year_month
    end
  end
end
