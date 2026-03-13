import { useParams } from "react-router-dom";
import Index from "./Index";
import NotFound from "./NotFound";

/**
 * Pseudo-static domain query page
 * Supports /nic.rw to directly query nic.rw
 */
const DomainQuery = () => {
  const { domain } = useParams<{ domain: string }>();

  if (!domain) return <NotFound />;

  // Strip URL cruft just in case (browser back/forward with encoded URLs)
  const cleaned = domain
    .replace(/^https?:\/\//i, "")
    .replace(/^\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .replace(/\s+/g, "");

  // Must look like a valid domain:
  // - Contains at least one dot
  // - Starts with a letter, digit, or IDN character
  // - TLD is 2+ alphabetic characters
  // - No consecutive dots, no leading/trailing dots
  const isDomainLike =
    cleaned &&
    /^[a-zA-Z0-9\u4e00-\u9fff\u00c0-\u024f]/.test(cleaned) && // valid start
    /\.[a-zA-Z\u4e00-\u9fff]{2,}$/.test(cleaned) &&            // valid TLD (2+ chars)
    !/\.\./.test(cleaned) &&                                    // no consecutive dots
    !/^\./.test(cleaned) &&                                     // no leading dot
    cleaned.length <= 253;                                      // max length

  if (!isDomainLike) {
    return <NotFound />;
  }

  return <Index initialDomain={cleaned} />;
};

export default DomainQuery;
