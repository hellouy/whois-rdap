import { useEffect, useRef, useState } from "react";

export interface CertData {
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  subject?: string;
  algorithm?: string;
  fingerprint?: string;
  isValid?: boolean;
}

type PartialCert = Partial<CertData>;

const safeParseJson = (text: string): any | null => {
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let start = -1;
  let end = -1;
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    start = firstBracket;
    end = text.lastIndexOf("]");
  } else {
    start = firstBrace;
    end = text.lastIndexOf("}");
  }
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  try {
    return JSON.parse(text);
  } catch {}
  return null;
};

const fetchText = async (url: string, timeoutMs = 5000): Promise<string> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(id);
  }
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function fetchCertSpotter(normDomain: string): Promise<PartialCert | null> {
  try {
    const txt = await fetchText(
      `https://r.jina.ai/https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(
        normDomain
      )}&include_subdomains=false&expand=dns_names,issuer&match_wildcards=true`,
      5000
    );
    const data = safeParseJson(txt);
    if (!Array.isArray(data) || data.length === 0) return null;
    const latest = data.reduce((a: any, b: any) => {
      const aDate = new Date(a.not_after || a.expires || 0).getTime();
      const bDate = new Date(b.not_after || b.expires || 0).getTime();
      return bDate > aDate ? b : a;
    });
    const validFrom = latest.not_before
      ? new Date(latest.not_before).toLocaleDateString("zh-CN")
      : "未知";
    const validTo = latest.not_after
      ? new Date(latest.not_after).toLocaleDateString("zh-CN")
      : "未知";
    const isValid = latest.not_after ? new Date(latest.not_after) > new Date() : undefined;
    const fingerprint =
      latest.cert_sha256 || latest.fingerprint_sha256 || latest.sha256 || "未知";
    return {
      issuer: latest.issuer?.name || latest.issuer_name || "未知",
      validFrom,
      validTo,
      subject:
        (latest.dns_names && latest.dns_names[0]) || latest.common_name || normDomain,
      algorithm: latest.signature_algorithm || "未知",
      fingerprint,
      isValid,
    } as PartialCert;
  } catch {
    return null;
  }
}

async function fetchCrtSh(normDomain: string): Promise<PartialCert | null> {
  try {
    const txt = await fetchText(
      `https://r.jina.ai/https://crt.sh/?q=${encodeURIComponent(normDomain)}&output=json`,
      5000
    );
    let arr: any[] = [];
    const arrStart = txt.indexOf("[");
    const arrEnd = txt.lastIndexOf("]");
    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      try {
        arr = JSON.parse(txt.slice(arrStart, arrEnd + 1));
      } catch {}
    }
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const latest = arr.reduce((a: any, b: any) => {
      const aDate = new Date(a.not_after || 0).getTime();
      const bDate = new Date(b.not_after || 0).getTime();
      return bDate > aDate ? b : a;
    });
    const validFrom = latest.not_before
      ? new Date(latest.not_before).toLocaleDateString("zh-CN")
      : "未知";
    const validTo = latest.not_after
      ? new Date(latest.not_after).toLocaleDateString("zh-CN")
      : "未知";
    const isValid = latest.not_after ? new Date(latest.not_after) > new Date() : undefined;
    return {
      issuer: latest.issuer_name || "未知",
      validFrom,
      validTo,
      subject: latest.common_name || normDomain,
      // crt.sh 不直接提供算法/指纹
      algorithm: undefined,
      fingerprint: latest.min_cert_id ? `crt.sh id: ${latest.min_cert_id}` : undefined,
      isValid,
    } as PartialCert;
  } catch {
    return null;
  }
}

async function fetchSslLabs(normDomain: string): Promise<PartialCert | null> {
  try {
    // 轻量：最多轮询 2 次，每次 1s，避免长等待
    let analyze: any = null;
    for (let i = 0; i < 2; i++) {
      const analyzeTxt = await fetchText(
        `https://r.jina.ai/https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(
          normDomain
        )}&fromCache=on&all=done`,
        4000
      );
      analyze = safeParseJson(analyzeTxt);
      if (analyze?.status === "READY" || analyze?.status === "ERROR") break;
      await sleep(1000);
    }
    const ep = Array.isArray(analyze?.endpoints) ? analyze.endpoints[0] : null;
    if (!ep?.ipAddress) return null;
    const detTxt = await fetchText(
      `https://r.jina.ai/https://api.ssllabs.com/api/v3/getEndpointData?host=${encodeURIComponent(
        normDomain
      )}&s=${encodeURIComponent(ep.ipAddress)}&all=done`,
      4000
    );
    const det = safeParseJson(detTxt);
    const cert = det?.details?.cert || det?.cert || null;
    if (!cert) return null;
    const validFrom = cert.notBefore
      ? new Date(cert.notBefore).toLocaleDateString("zh-CN")
      : "未知";
    const validTo = cert.notAfter
      ? new Date(cert.notAfter).toLocaleDateString("zh-CN")
      : "未知";
    const isValid = cert.notAfter ? new Date(cert.notAfter) > new Date() : undefined;
    return {
      issuer: cert.issuerLabel || cert.issuerSubject || "未知",
      validFrom,
      validTo,
      subject: cert.subject || normDomain,
      algorithm: cert.sigAlg || cert.signatureAlgorithm || "未知",
      fingerprint: cert.sha256 || cert.sha1Hash || undefined,
      isValid,
    } as PartialCert;
  } catch {
    return null;
  }
}

const mergeCerts = (base: PartialCert, next: PartialCert): PartialCert => ({
  issuer: next.issuer ?? base.issuer,
  validFrom: next.validFrom ?? base.validFrom,
  validTo: next.validTo ?? base.validTo,
  subject: next.subject ?? base.subject,
  algorithm: next.algorithm ?? base.algorithm,
  fingerprint: next.fingerprint ?? base.fingerprint,
  isValid: typeof next.isValid !== "undefined" ? next.isValid : base.isValid,
});

export function useSslCertificate(domain: string) {
  const [certData, setCertData] = useState<CertData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = async () => {
    const normDomain = domain.trim().toLowerCase();
    if (!normDomain) {
      setCertData(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setCertData(null);

    // 并行启动，增强准确性和安全性
    const p1 = fetchCertSpotter(normDomain);
    const p2 = fetchCrtSh(normDomain);
    const p3 = fetchSslLabs(normDomain).catch(() => null); // SSL Labs可能较慢或失败

    let anySuccess = false;
    let current: PartialCert = {};

    const handle = async (p: Promise<PartialCert | null>) => {
      try {
        const res = await p;
        if (res && mounted.current) {
          anySuccess = true;
          current = mergeCerts(current, res);
          const merged: CertData = {
            issuer: current.issuer ?? "未知",
            validFrom: current.validFrom ?? "未知",
            validTo: current.validTo ?? "未知",
            subject: current.subject ?? normDomain,
            algorithm: current.algorithm ?? "未知",
            fingerprint: current.fingerprint ?? "未知",
            isValid: typeof current.isValid !== "undefined" ? current.isValid : undefined,
          };
          setCertData(merged);
          // 首个成功结果就结束 loading，提升速度体验
          setIsLoading(false);
        }
      } catch {}
    };

    await Promise.allSettled([handle(p1), handle(p2), handle(p3)]);

    if (!anySuccess) {
      if (!mounted.current) return;
      setIsLoading(false);
      setError("未找到SSL证书信息");
      console.log("SSL证书查询失败: 未找到证书信息");
      return;
    }

    // 最终合并校正 isValid（基于 validTo）
    if (mounted.current) {
      setCertData((prev) => {
        if (!prev) return prev;
        const parsed = prev.validTo && prev.validTo !== "未知" ? new Date(prev.validTo) : null;
        const isValid = parsed ? parsed > new Date() : prev.isValid;
        return { ...prev, isValid };
      });
    }
  };

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  return { certData, isLoading, error, refetch: run };
}
