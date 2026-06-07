import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';

const blogFiles = import.meta.glob('../../../blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx !== -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body: match[2] };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const entry = Object.entries(blogFiles).find(([path]) =>
    path.split('/').pop()?.replace('.md', '') === slug,
  );

  if (!entry) {
    return (
      <div className="academic-container">
        <Link to="/" className="academic-blog-back">← Home</Link>
        <p style={{ color: '#6b7280', marginTop: '2rem' }}>Post not found.</p>
      </div>
    );
  }

  const { meta, body } = parseFrontmatter(entry[1]);

  return (
    <div className="academic-root">
      <div className="academic-container">
        <Link to="/" className="academic-blog-back">← Home</Link>
        <article className="academic-blog-post">
          <h1 className="academic-blog-post-title">{meta.title ?? slug}</h1>
          {meta.date && <p className="academic-blog-post-date">{meta.date}</p>}
          <div
            className="academic-blog-post-body"
            dangerouslySetInnerHTML={{ __html: marked(body) as string }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
