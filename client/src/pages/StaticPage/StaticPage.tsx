import { Link, useParams } from "react-router";
import { staticPages } from "../../content/staticPages";
import type { StaticPageCategory } from "../../content/staticPages";
import NotFound from "../NotFound/NotFound";
import "./StaticPage.css";

const categoryOrder: StaticPageCategory[] = [
  "Aide",
  "La marque",
  "Informations légales",
];

const entries = Object.entries(staticPages);

function StaticPage() {
  const { slug } = useParams();
  const content = slug ? staticPages[slug] : undefined;

  if (!content) return <NotFound />;

  return (
    <main className="static-page">
      <div className="static-page-layout">
        <nav
          className="static-page-nav"
          aria-label="Pages d'aide et d'information"
        >
          {categoryOrder.map((category) => (
            <div className="static-page-nav-group" key={category}>
              <h2>{category}</h2>
              <ul>
                {entries
                  .filter(([, page]) => page.category === category)
                  .map(([pageSlug, page]) => (
                    <li key={pageSlug}>
                      <Link
                        to={`/pages/${pageSlug}`}
                        aria-current={pageSlug === slug ? "page" : undefined}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="static-page-content">
          <span className="static-page-eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          {content.intro && (
            <p className="static-page-intro">{content.intro}</p>
          )}
          {content.notice && (
            <p className="static-page-notice">{content.notice}</p>
          )}

          {content.sections.map((section) => {
            const body = (
              <>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </>
            );

            if (!section.heading) {
              return (
                <div
                  className="static-page-text-block"
                  key={section.paragraphs?.[0] ?? section.list?.[0]}
                >
                  {body}
                </div>
              );
            }

            return (
              <details
                className="static-page-accordion-item"
                key={section.heading}
              >
                <summary>{section.heading}</summary>
                <div className="static-page-accordion-content">{body}</div>
              </details>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default StaticPage;
