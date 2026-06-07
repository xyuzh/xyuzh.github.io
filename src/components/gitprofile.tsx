import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import { HelmetProvider } from 'react-helmet-async';
import '../assets/index.css';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import {
  SanitizedCertification,
  SanitizedConfig,
} from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
import HeadTagEditor from './head-tag-editor';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { FALLBACK_IMAGE } from '../constants';
import { Profile } from '../interfaces/profile';
import BlogCard from './blog-card';
import PublicationCard from './publication-card';
import { AiFillGithub, AiFillStar } from 'react-icons/ai';
import { FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { RiMailFill } from 'react-icons/ri';
import { SiGooglescholar } from 'react-icons/si';

const GITHUB_REPO_LINK_REGEX =
  /\]\((https:\/\/github\.com\/([\w.-]+\/[\w.-]+?))\/?\)/g;

const formatStarCount = (count: number): string =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
    : `${count}`;

interface BioTextToken {
  type: 'text';
  value: string;
}

interface BioLinkToken {
  type: 'link';
  label: string;
  href: string;
}

type BioToken = BioTextToken | BioLinkToken;

const tokenizeBioLinks = (text: string): BioToken[] => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const tokens: BioToken[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'link', label: match[1], href: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return tokens;
};

const renderBioLink = (
  token: BioLinkToken,
  key: number,
  certifications: SanitizedCertification[],
  repoStars: Record<string, number>,
): React.ReactNode => {
  const award = certifications.find((c) => c.logoUrl && c.link === token.href);
  const stars = repoStars[token.href];
  return award ? (
    <a
      key={key}
      href={token.href}
      target="_blank"
      rel="noreferrer"
      className="academic-bio-award-link"
      title={award.name}
    >
      <img
        src={award.logoUrl}
        alt={award.name}
        className="academic-bio-award-logo"
      />
      {token.label}
    </a>
  ) : stars !== undefined ? (
    <a
      key={key}
      href={token.href}
      target="_blank"
      rel="noreferrer"
      className="academic-bio-repo-link"
      title={`${stars.toLocaleString()} stars on GitHub`}
    >
      <AiFillGithub className="academic-bio-repo-icon" />
      {token.label}
      <span className="academic-bio-repo-stars">
        <AiFillStar className="academic-bio-repo-star" />
        {formatStarCount(stars)}
      </span>
    </a>
  ) : (
    <a
      key={key}
      href={token.href}
      target="_blank"
      rel="noreferrer"
      className="academic-bio-link"
    >
      {token.label}
    </a>
  );
};

const parseBioLinks = (
  text: string,
  certifications: SanitizedCertification[] = [],
  repoStars: Record<string, number> = {},
): React.ReactNode[] => {
  const tokens = tokenizeBioLinks(text);

  const isAwardToken = (token?: BioToken): boolean =>
    !!token &&
    token.type === 'link' &&
    certifications.some((c) => c.logoUrl && c.link === token.href);

  // Short joining words ("and", "&", ...) between two award chips, so a
  // run of awards can be grouped onto one horizontally aligned row.
  const isConnectorToken = (token?: BioToken): boolean =>
    !!token &&
    token.type === 'text' &&
    token.value.trim().length > 0 &&
    token.value.trim().length <= 5 &&
    !/[.!?,;:]/.test(token.value);

  const nodes: React.ReactNode[] = [];
  let key = 0;

  // Pulls sentence punctuation off the front of the text token following
  // position i, so it can be glued onto a chip and never stranded at the
  // start of a wrapped line.
  const extractLeadingPunct = (i: number): string => {
    const next = tokens[i + 1];
    if (!next || next.type !== 'text') return '';
    const punct = next.value.match(/^[.,;:!?]+/);
    if (!punct) return '';
    tokens[i + 1] = { type: 'text', value: next.value.slice(punct[0].length) };
    return punct[0];
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'text') {
      nodes.push(token.value);
      continue;
    }
    if (isAwardToken(token)) {
      // Collect a run of award chips joined by short connectors, and render
      // them as one non-breaking row so the logos stay horizontally aligned.
      const group: React.ReactNode[] = [
        renderBioLink(token, key++, certifications, repoStars),
      ];
      while (isConnectorToken(tokens[i + 1]) && isAwardToken(tokens[i + 2])) {
        group.push(
          <span key={key++} className="academic-bio-award-conn">
            {(tokens[i + 1] as BioTextToken).value.trim()}
          </span>,
          renderBioLink(
            tokens[i + 2] as BioLinkToken,
            key++,
            certifications,
            repoStars,
          ),
        );
        i += 2;
      }
      // Fold trailing punctuation into the last chip's flex item so it can
      // neither wrap alone nor detach from the chip.
      const punct = extractLeadingPunct(i);
      if (punct) {
        group[group.length - 1] = (
          <span key={key++} className="academic-bio-nowrap">
            {group[group.length - 1]}
            {punct}
          </span>
        );
      }
      nodes.push(
        group.length > 1 ? (
          <span key={key++} className="academic-bio-award-group">
            {group}
          </span>
        ) : (
          group[0]
        ),
      );
      continue;
    }
    let linkNode = renderBioLink(token, key++, certifications, repoStars);
    if (repoStars[token.href] !== undefined) {
      const punct = extractLeadingPunct(i);
      if (punct) {
        linkNode = (
          <span key={key++} className="academic-bio-nowrap">
            {linkNode}
            {punct}
          </span>
        );
      }
    }
    nodes.push(linkNode);
  }
  return nodes;
};

const GitProfile = ({ config }: { config: Config }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );
  const [theme, setTheme] = useState<string>(DEFAULT_THEMES[0]);
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repoStars, setRepoStars] = useState<Record<string, number>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
      );
      const data = response.data;
      setProfile({
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
      });
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [sanitizedConfig.github?.username]);

  const loadRepoStars = useCallback(async () => {
    if (!sanitizedConfig.bio) return;
    const repos: Record<string, string> = {};
    let match;
    while (
      (match = GITHUB_REPO_LINK_REGEX.exec(sanitizedConfig.bio)) !== null
    ) {
      repos[match[1]] = match[2];
    }
    const stars: Record<string, number> = {};
    await Promise.all(
      Object.keys(repos).map(async (link) => {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${repos[link]}`,
          );
          if (typeof response.data?.stargazers_count === 'number') {
            stars[link] = response.data.stargazers_count;
          }
        } catch {
          // Ignore failures (e.g. rate limit) — link falls back to plain text.
        }
      }),
    );
    setRepoStars(stars);
  }, [sanitizedConfig.bio]);

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setTheme(getInitialTheme(sanitizedConfig.themeConfig));
      setupHotjar(sanitizedConfig.hotjar);
      loadData();
      loadRepoStars();
    }
  }, [sanitizedConfig, loadData, loadRepoStars]);

  useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleError = (error: AxiosError | Error): void => {
    console.error('Error:', error);
    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );
        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };

  return (
    <HelmetProvider>
      <div className="academic-root fade-in">
        {error ? (
          <ErrorPage
            status={error.status}
            title={error.title}
            subTitle={error.subTitle}
          />
        ) : (
          <>
            <HeadTagEditor
              googleAnalyticsId={sanitizedConfig.googleAnalytics?.id}
              appliedTheme="light"
            />
            <div className="academic-container">
              {/* ── Header: photo + name + contact ── */}
              <header className="academic-header">
                <div className="academic-photo-wrap">
                  {loading || !profile ? (
                    <div className="academic-photo-skeleton" />
                  ) : (
                    <img
                      src={profile.avatar || FALLBACK_IMAGE}
                      alt={profile.name}
                      className="academic-photo"
                    />
                  )}
                </div>

                <div className="academic-header-info">
                  {loading || !profile ? (
                    <div className="academic-name-skeleton" />
                  ) : (
                    <h1 className="academic-name">{profile.name}</h1>
                  )}

                  {sanitizedConfig.social?.email && (
                    <p className="academic-email">
                      <RiMailFill
                        style={{
                          display: 'inline',
                          marginRight: 4,
                          verticalAlign: 'middle',
                        }}
                      />
                      <a href={`mailto:${sanitizedConfig.social.email}`}>
                        {sanitizedConfig.social.email}
                      </a>
                    </p>
                  )}

                  <div className="academic-social-links">
                    <a
                      href={`https://github.com/${sanitizedConfig.github?.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="academic-social-link"
                    >
                      <AiFillGithub size={16} /> GitHub
                    </a>
                    {sanitizedConfig.social?.googleScholar && (
                      <a
                        href={
                          sanitizedConfig.social.googleScholar.startsWith(
                            'http',
                          )
                            ? sanitizedConfig.social.googleScholar
                            : `https://scholar.google.com/citations?user=${sanitizedConfig.social.googleScholar}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="academic-social-link"
                      >
                        <SiGooglescholar size={15} /> Scholar
                      </a>
                    )}
                    {sanitizedConfig.social?.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${sanitizedConfig.social.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="academic-social-link"
                      >
                        <FaLinkedin size={15} /> LinkedIn
                      </a>
                    )}
                    {sanitizedConfig.social?.twitter && (
                      <a
                        href={`https://twitter.com/${sanitizedConfig.social.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="academic-social-link"
                      >
                        <FaXTwitter size={15} /> Twitter
                      </a>
                    )}
                  </div>
                </div>
              </header>

              {/* ── Bio ── */}
              {sanitizedConfig.bio && (
                <section className="academic-section">
                  {sanitizedConfig.bio.split('\n\n').map((para, i) => (
                    <p key={i} className="academic-bio">
                      {parseBioLinks(
                        para,
                        sanitizedConfig.certifications,
                        repoStars,
                      )}
                    </p>
                  ))}
                </section>
              )}

              {/* ── Publications ── */}
              {(sanitizedConfig.publications?.length ?? 0) > 0 && (
                <PublicationCard
                  loading={loading}
                  publications={sanitizedConfig.publications}
                  highlightAuthor={profile?.name}
                />
              )}

              {/* ── Invited Talks ── */}
              {(sanitizedConfig.talks?.length ?? 0) > 0 && (
                <section className="academic-section">
                  <h2 className="academic-section-title">Invited Talks</h2>
                  <ul className="academic-talk-list">
                    {sanitizedConfig.talks.map((talk, i) => (
                      <li key={i} className="academic-talk-item">
                        {[talk.title, talk.venue, talk.location, talk.year]
                          .filter(Boolean)
                          .join(', ')}
                        {talk.link && (
                          <>
                            {' '}
                            <a
                              href={talk.link}
                              target="_blank"
                              rel="noreferrer"
                              className="academic-bio-link"
                            >
                              [video]
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── Service ── */}
              {(sanitizedConfig.service?.length ?? 0) > 0 && (
                <section className="academic-section">
                  <h2 className="academic-section-title">Service</h2>
                  <ul className="academic-service-list">
                    {sanitizedConfig.service.map((item, i) => (
                      <li key={i} className="academic-service-item">
                        {parseBioLinks(
                          item,
                          sanitizedConfig.certifications,
                          repoStars,
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── Blog ── */}
              <BlogCard loading={loading} />

              {sanitizedConfig.footer && (
                <div
                  className="academic-footer"
                  dangerouslySetInnerHTML={{ __html: sanitizedConfig.footer }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </HelmetProvider>
  );
};

export default GitProfile;
