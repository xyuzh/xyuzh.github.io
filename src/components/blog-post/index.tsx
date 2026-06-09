import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

// Canonical public origin, used to build stable citation URLs regardless of
// where the page is viewed (e.g. localhost preview).
const SITE_URL = 'https://xyuzh.github.io';

const blogFiles = import.meta.glob('../../../blogs/*.{md,html}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Self-contained interactive widgets that markdown posts embed via `::widget <name>`.
const widgetFiles = import.meta.glob('../../../blogs/widgets/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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

function findWidget(name: string): string | null {
  const entry = Object.entries(widgetFiles).find(
    ([path]) =>
      path
        .split('/')
        .pop()
        ?.replace(/\.html$/, '') === name,
  );
  return entry ? entry[1] : null;
}

// A self-contained HTML doc rendered in a sandboxed iframe. `allow-scripts`
// runs the demo; the unique sandbox origin keeps its CSS from leaking into the
// site. Each instance sizes itself from height messages posted by *its own*
// iframe (matched via e.source), so several widgets can coexist on one page.
const HtmlEmbed = ({
  html,
  title,
  minHeight = 420,
}: {
  html: string;
  title: string;
  minHeight?: number;
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        ref.current &&
        e.source === ref.current.contentWindow &&
        e.data &&
        e.data.type === 'blog-iframe-height' &&
        typeof e.data.height === 'number'
      ) {
        setHeight(Math.max(minHeight, Math.ceil(e.data.height)));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [minHeight]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      sandbox="allow-scripts allow-popups"
      style={{
        display: 'block',
        width: '100%',
        border: 'none',
        height: `${height}px`,
        overflow: 'hidden',
        margin: '1.6rem 0',
        // Match the dark page so there is no white flash before srcDoc paints
        // and no light canvas behind a sandboxed, color-scheme-aware iframe.
        background: '#0f1216',
        colorScheme: 'dark',
      }}
    />
  );
};

// Splits a markdown body on standalone `::widget <name>` lines, rendering prose
// chunks through `marked` and each directive as an embedded interactive widget.
function renderMarkdownBody(body: string): JSX.Element[] {
  const lines = body.split(/\r?\n/);
  const nodes: JSX.Element[] = [];
  let buffer: string[] = [];
  let key = 0;

  const flushProse = () => {
    const md = buffer.join('\n').trim();
    buffer = [];
    if (md) {
      nodes.push(
        <div
          key={`md-${key++}`}
          className="academic-blog-post-body"
          dangerouslySetInnerHTML={{ __html: marked(md) as string }}
        />,
      );
    }
  };

  for (const line of lines) {
    const match = line.match(/^::widget\s+([\w-]+)\s*$/);
    if (match) {
      flushProse();
      const name = match[1];
      const widgetHtml = findWidget(name);
      if (widgetHtml != null) {
        nodes.push(
          <HtmlEmbed key={`w-${key++}`} html={widgetHtml} title={name} />,
        );
      } else {
        nodes.push(
          <p key={`w-${key++}`} style={{ color: '#a23a2c' }}>
            [missing widget: {name}]
          </p>,
        );
      }
    } else {
      buffer.push(line);
    }
  }
  flushProse();
  return nodes;
}

const CITE_STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'your',
  'my',
  'is',
  'are',
  'of',
  'to',
  'and',
  'in',
  'on',
  'for',
  'with',
  'that',
]);

// "Zhang2026language" — last name + year + first meaningful title word.
function bibKey(author: string, year: string, title: string): string {
  const last =
    author
      .trim()
      .split(/\s+/)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') ?? 'anon';
  const word =
    title
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ''))
      .find((w) => w.length >= 3 && !CITE_STOPWORDS.has(w)) ?? 'post';
  return `${last}${year}${word}`;
}

// "Xinyu Zhang" -> "Zhang, Xinyu" for the BibTeX author field.
function bibAuthor(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length < 2) return author.trim();
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}`;
}

// A "Cite this post" block: a readable citation plus copyable BibTeX. The URL is
// read from the live location, so it is always the canonical post address.
const Citation = ({
  title,
  author,
  date,
  slug,
}: {
  title: string;
  author: string;
  date?: string;
  slug: string;
}) => {
  const [copied, setCopied] = useState(false);
  const year = (date ?? '').slice(0, 4);
  const url = `${SITE_URL}/#/blog/${slug}`;

  const bibtex = `@misc{${bibKey(author, year, title)},
  author       = {${bibAuthor(author)}},
  title        = {${title}},
  year         = {${year || 'n.d.'}},
  howpublished = {\\url{${url}}},
  note         = {Blog post}
}`;

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bibtex).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        },
        () => undefined,
      );
    }
  };

  return (
    <section className="academic-cite">
      <h2 className="academic-cite-title">Cite this post</h2>
      <div className="academic-cite-box">
        <button
          type="button"
          className="academic-cite-copy"
          onClick={copy}
          aria-label="Copy BibTeX citation"
        >
          {copied ? '✓ Copied' : 'Copy BibTeX'}
        </button>
        <pre>
          <code>{bibtex}</code>
        </pre>
      </div>
    </section>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const entry = Object.entries(blogFiles).find(
    ([path]) =>
      path
        .split('/')
        .pop()
        ?.replace(/\.(md|html)$/, '') === slug,
  );

  if (!entry) {
    return (
      <div className="academic-container">
        <Link to="/" className="academic-blog-back">
          ← Home
        </Link>
        <p style={{ color: '#6b7280', marginTop: '2rem' }}>Post not found.</p>
      </div>
    );
  }

  const isHtml = entry[0].endsWith('.html');
  const { meta, body } = parseFrontmatter(entry[1]);

  // A full standalone HTML post owns its styling and renders as one iframe.
  if (isHtml) {
    return (
      <div className="academic-root">
        <div className="academic-container">
          <Link to="/" className="academic-blog-back">
            ← Home
          </Link>
        </div>
        <HtmlEmbed
          html={body}
          title={meta.title ?? slug ?? 'Post'}
          minHeight={900}
        />
      </div>
    );
  }

  // Markdown post: prose via `marked`, with `::widget` directives embedded as
  // interactive widgets inline.
  return (
    <div className="academic-root">
      <div className="academic-container">
        <Link to="/" className="academic-blog-back">
          ← Home
        </Link>
        <article className="academic-blog-post">
          <h1 className="academic-blog-post-title">{meta.title ?? slug}</h1>
          {(meta.date || meta.readTime) && (
            <p className="academic-blog-post-date">
              {[meta.date, meta.readTime].filter(Boolean).join(' · ')}
            </p>
          )}
          {renderMarkdownBody(body)}
          {meta.author && (
            <Citation
              title={meta.title ?? slug ?? ''}
              author={meta.author}
              date={meta.date}
              slug={slug ?? ''}
            />
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
