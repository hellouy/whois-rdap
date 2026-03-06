import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./Index";

/**
 * 伪静态域名查询页面
 * 支持 /nic.rw 直接查询 nic.rw
 */
const DomainQuery = () => {
  const { domain } = useParams<{ domain: string }>();
  
  // 简单验证是否像域名（包含至少一个点）
  const isDomainLike = domain && /^[a-zA-Z0-9\u4e00-\u9fff][\w\u4e00-\u9fff.-]*\.[a-zA-Z\u4e00-\u9fff]{2,}$/.test(domain);
  
  if (!isDomainLike) {
    // 不像域名，走 404
    return null;
  }

  return <Index initialDomain={domain} />;
};

export default DomainQuery;
