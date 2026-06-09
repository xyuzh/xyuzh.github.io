import { skeleton } from '../../utils';

const blogFiles = import.meta.glob('../../../blogs/*.{md,html}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  description: string;
  body: string;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx !== -1)
      meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body: match[2] };
}

const posts: BlogPost[] = Object.entries(blogFiles)
  .map(([path, raw]) => {
    const slug =
      path
        .split('/')
        .pop()
        ?.replace(/\.(md|html)$/, '') ?? '';
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      readTime: meta.readTime ?? '',
      description: meta.description ?? '',
      body,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const BlogCard = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <section className="academic-section">
        <h2 className="academic-section-title">Blog</h2>
        <div className="academic-blog-list">
          {[0, 1].map((i) => (
            <div key={i}>
              {skeleton({
                widthCls: 'w-2/3',
                heightCls: 'h-4',
                className: 'mb-1',
              })}
              {skeleton({ widthCls: 'w-24', heightCls: 'h-3' })}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="academic-section">
      <h2 className="academic-section-title">Blog</h2>
      {!posts.length ? (
        <p className="academic-no-content">No posts yet.</p>
      ) : (
        <ul className="academic-blog-list">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="academic-blog-item"
              style={{ display: 'block' }}
            >
              <a href={`#/blog/${post.slug}`} className="academic-blog-title">
                {post.title}
              </a>
              {(post.date || post.readTime) && (
                <p className="academic-blog-date">
                  {[post.date, post.readTime].filter(Boolean).join(' · ')}
                </p>
              )}
              {post.description && (
                <p className="academic-blog-desc">{post.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogCard;
