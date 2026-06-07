import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const PublicationCard = ({
  publications,
  loading,
}: {
  publications: SanitizedPublication[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <section className="academic-section">
        <h2 className="academic-section-title">Publications</h2>
        <div className="academic-pub-list">
          {[0, 1].map((i) => (
            <div key={i} className="academic-pub-item">
              {skeleton({ widthCls: 'w-3/4', heightCls: 'h-4', className: 'mb-2' })}
              {skeleton({ widthCls: 'w-1/2', heightCls: 'h-3', className: 'mb-1' })}
              {skeleton({ widthCls: 'w-2/3', heightCls: 'h-3' })}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="academic-section">
      <h2 className="academic-section-title">Publications</h2>
      <div className="academic-pub-list">
        {publications.map((pub, i) => (
          <div key={i} className="academic-pub-item">
            {pub.link ? (
              <a
                href={pub.link}
                target="_blank"
                rel="noreferrer"
                className="academic-pub-title-link"
              >
                {pub.title}
              </a>
            ) : (
              <span className="academic-pub-title-plain">{pub.title}</span>
            )}
            {pub.authors && (
              <p className="academic-pub-authors">{pub.authors}</p>
            )}
            {(pub.conferenceName || pub.journalName) && (
              <p className="academic-pub-venue">
                {pub.conferenceName || pub.journalName}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicationCard;
