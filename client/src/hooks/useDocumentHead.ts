import { useEffect } from "react";

type DocumentHeadOptions = {
  title: string;
  description: string;
};

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function useDocumentHead({ title, description }: DocumentHeadOptions) {
  useEffect(() => {
    document.title = `${title} · Korn`;
    setMetaDescription(description);
  }, [title, description]);
}
