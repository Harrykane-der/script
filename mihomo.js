function main(newConfig = {}) {
  const iconBase = "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color";
  const dnsParams = "#disable-qtype-12&disable-qtype-64&disable-qtype-65&ecs=223.160.168.99/24&ecs-override=true";
  const testUrl = "https://www.apple.com/library/test/success.html";

  // ==================== 1. 基础与扩展配置 (直接覆盖) ====================
  Object.assign(newConfig, {
    "allow-lan": true,
    "ipv6": true,
    "bind-address": "*",
    "unified-delay": true,
    "tcp-concurrent": true,
    "keep-alive-idle": 600,
    "keep-alive-interval": 60,
    "disable-keep-alive": false,
    "find-process-mode": "always",
    "external-controller": "127.0.0.1:9090",
    "external-ui-url": "https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip",
    "external-ui": "ui"
  });

  // 确保二级对象存在并直接原地修改
  Object.assign((newConfig.profile = {}), {
    "store-selected": true,
    "store-fake-ip": true
  });

  Object.assign((newConfig.tun = {}), {
    "enable": true,
    "device": "Bettbox",
    "mtu": 65535,
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "stack": "gvisor",
    "disable-icmp-forwarding": true,
    "dns-hijack": ["any:53", "tcp://any:53"],
    "udp-timeout": 600
  });

  Object.assign((newConfig.hosts = {}), {
    "pz.fyi": ["106.54.11.55"],
    "doh.pub": ["120.53.53.53", "1.12.12.12", "2402:4e00::"],
    "dns.alidns.com": ["223.5.5.5", "223.6.6.6", "2400:3200::1", "2400:3200:baba::1"],
    "dns.google": ["8.8.8.8", "8.8.4.4", "2001:4860:4860::8888", "2001:4860:4860::8844"],
    "unfiltered.adguard-dns.com": ["94.140.14.140", "94.140.14.141", "2a10:50c0::1:ff", "2a10:50c0::2:ff"],
    "service.googleapis.cn": ["service.googleapis.com"],
    "services.googleapis.cn": ["services.googleapis.com"],
    "google.cn": ["google.com"],
    "cn.bing.com": ["global.bing.com"],
    "mtalk.google.com": ["34.92.115.250", "173.194.206.188", "2607:f8b0:4023:1004::bc", "2404:6800:4008:c07::bc"],
    "alt1-mtalk.google.com": ["2607:f8b0:4023:1c05::bc", "74.125.200.188"],
    "alt2-mtalk.google.com": ["192.178.220.188"],
    "alt3-mtalk.google.com": ["2607:f8b0:4023:2009::bc", "74.125.131.188"],
    "alt4-mtalk.google.com": ["209.85.144.188"],
    "alt5-mtalk.google.com": ["2607:f8b0:4003:c0a::bc", "74.125.126.188"],
    "alt6-mtalk.google.com": ["142.250.115.188"],
    "alt7-mtalk.google.com": ["2607:f8b0:4024:c0d::bc", "192.178.131.188"],
    "alt8-mtalk.google.com": ["172.253.132.188"],
    "dl.google.com": ["180.163.151.161"],
    "dl.l.google.com": ["180.163.150.33"]
  });

  Object.assign((newConfig.sniffer = {}), {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": false,
    "sniff": {
      "HTTP": { "ports": ["80", "443", "8080-8888"], "override-destination": true },
      "TLS": { "ports": ["443", "853", "8443"] },
      "QUIC": { "ports": ["443", "8443"] }
    },
    "skip-domain": ["rule-set:telegram_domain"],
    "skip-dst-address": ["rule-set:telegram_ip"],
    "skip-src-address": ["rule-set:telegram_ip"]
  });

  // ==================== 2. DNS 配置 (直接覆盖) ====================
  const dns_default = ["quic://106.54.11.55:853", "tls://120.53.53.53:853", "quic://223.5.5.5:853", "quic://94.140.14.140:853", "tls://8.8.8.8:853"];
  const dns_domain_server = [`https://dns.alidns.com/dns-query${dnsParams}&h3=true`, `https://pz.fyi/dns-query${dnsParams}`, `https://doh.pub/dns-query${dnsParams}`];
  const dns_direct = [`https://pz.fyi/dns-query${dnsParams}`, `https://dns.alidns.com/dns-query${dnsParams}&h3=true`, `https://doh.pub/dns-query${dnsParams}`, "system"];
  const dns_proxy = [`https://unfiltered.adguard-dns.com/dns-query${dnsParams}&h3=true&proxy_dns`, `https://pz.fyi/dns-query${dnsParams}`, `https://dns.google/dns-query${dnsParams}&h3=true&proxy_dns`];
  const dns_nexitally = ["https://prolonged3729.com:443/dns-query/8203f7dc-afa4-40cf-9b4b-190497da7b85"];
  const dns_creamdata = ["https://prolonged3729.com:443/dns-query/f77b88da-2cd8-4f69-92b1-d171a41f294d"];
  const dns_flower = ["system"];
  const dns_fakeip = ["rcode://name_error"];
  const dns_adguard = ["rcode://success"];

  Object.assign((newConfig.dns = {}), {
    "enable": true,
    "ipv6": true,
    "ipv6-timeout": 300,
    "cache-algorithm": "arc",
    "use-hosts": true,
    "use-system-hosts": false,
    "prefer-h3": true,
    "respect-rules": false,
    "listen": "127.0.0.1:1053",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-range6": "fc00::/64",
    "fake-ip-ttl": 1,
    "fake-ip-filter-mode": "rule",
    "fake-ip-filter": [
      "RULE-SET,game_domain,fake-ip",
      "RULE-SET,direct_emby_domain,real-ip",
      "RULE-SET,proxy_emby_domain,real-ip",
      "RULE-SET,fakeip-filter_domain,real-ip",
      "MATCH,fake-ip"
    ],
    "default-nameserver": dns_default,
    "nameserver": dns_proxy,
    "fallback-lazy-query": true,
    "fallback": dns_proxy,
    "nameserver-policy": {
      "rule-set:game_domain": dns_fakeip,
      "rule-set:proxy_emby_domain": dns_proxy,
      "rule-set:direct_emby_domain": dns_direct,
      "rule-set:fakeip-filter_domain": dns_direct,
      "rule-set:ablock_domain": dns_adguard,
      "rule-set:adblock_domain": dns_adguard,
      "rule-set:bytedance_domain": dns_fakeip,
      "rule-set:bilibili_domain": dns_fakeip,
      "rule-set:cn_domain": dns_direct,
      "+.*": dns_fakeip
    },
    "proxy-server-nameserver": dns_domain_server,
    "direct-nameserver-follow-policy": true,
    "direct-nameserver": dns_direct,
    "proxy-server-nameserver-policy": {
      "+.623ccd.rjsqsn.xyz": dns_creamdata,
      "+.6aad4e.fomlrq.xyz": dns_creamdata,
      "+.a6f7e5e493.8c5ecp7fb.sbs": dns_nexitally,
      "+.af81085c6d.h5dhwpd92.sbs": dns_nexitally,
      "+.aws-agent.com": dns_flower,
      "+.api-huacloud.dev": dns_flower
    },
    "fallback-filter": {
      "geoip": true,
      "geoip-code": "CN",
      "geosite": "gfw",
      "ipcidr": [
        "240.0.0.0/4",
        "0.0.0.0/32",
        "127.0.0.1/32",
        "100.64.0.0/10"
      ],
      "domain": [
        "+.google.com",
        "+.facebook.com",
        "+.youtube.com"
      ]
    }
  });

  // ==================== 3. 注入基础直连/DNS代理节点 ====================
  newConfig.proxies = [
    { name: "直连 | 双栈", type: "direct", udp: true, icon: `${iconBase}/CN.png` },
    { name: "直连 | IPv4优先", type: "direct", udp: true, "ip-version": "ipv4-prefer", icon: `${iconBase}/CN.png` },
    { name: "直连 | IPv6优先", type: "direct", udp: true, "ip-version": "ipv6-prefer", icon: `${iconBase}/CN.png` },
    { name: "dns_hijack", type: "dns" }
  ];

  // ==================== 4. 策略组矩阵数据驱动生成 ====================
  const regionProxies = ["HK", "JP", "SG", "US", "DE", "OT", "Gamer", "Direct"];

  const mainGroups = [
    { name: "Final", selected: "HK", icon: "Final.png" },
    { name: "Game", selected: "Gamer", icon: "Game.png" },
    { name: "Telegram", selected: "SG", icon: "Telegram.png" },
    { name: "Google", selected: "HK", icon: "Google_Search.png" },
    { name: "BiliBili", selected: "HK", icon: "bilibili_3.png" },
    { name: "AI", selected: "JP", icon: "ChatGPT.png" },
    { name: "Pixiv", selected: "JP", icon: "Pornhub_2.png" },
    { name: "TikTok", selected: "DE", icon: "TikTok.png" },
    { name: "Twitter", selected: "DE", icon: "Twitter.png" },
    { name: "FCM", selected: "Direct", icon: "iCloud.png" },
    { name: "Github", selected: "HK", icon: "GitHub.png" },
    { name: "Media", selected: "HK", icon: "ForeignMedia.png" }
  ].map(item => ({
    name: item.name,
    type: "select",
    "default-selected": item.selected,
    proxies: regionProxies,
    icon: `${iconBase}/${item.icon}`
  }));

  const regionalGroups = [
    { name: "Gamer", icon: "Game.png", filter: "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b|🇯🇵|日本|\\bJP\\b|\\bjapan\\b" },
    { name: "HK", icon: "HK.png", filter: "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b" },
    { name: "JP", icon: "JP.png", filter: "(?i)🇯🇵|日本|\\bJP\\b|\\bjapan\\b" },
    { name: "SG", icon: "SG.png", filter: "(?i)🇸🇬|新加坡|狮城|\\bSG\\b|\\bsingapore\\b" },
    { name: "US", icon: "US.png", filter: "(?i)🇺🇸|美国|\\bUS\\b|\\bunitedstates\\b|\\bunited\\s?states\\b" },
    { name: "DE", icon: "DE.png", filter: "(?i)🇩🇪|德国|\\bDE\\b|\\bgermany\\b" },
    { name: "OT", icon: "UN.png", filter: "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇸🇬|🇺🇸|🇩🇪|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b|日本|\\bJP\\b|\\bjapan\\b|新加坡|狮城|\\bSG\\b|\\bsingapore\\b|美国|\\bUS\\b|\\bunitedstates\\b|\\bunited\\s?states\\b|德国|\\bDE\\b|\\bgermany\\b|ADGUARD|dns|直连)).*" }
  ].flatMap(region => {
    const currentIcon = `${iconBase}/${region.icon}`;
    const namePick = `${region.name}_Pick`;
    const nameAuto = `${region.name}_Auto`;
    return [
      { type: "url-test", url: testUrl, interval: 180, lazy: true, name: region.name, proxies: [namePick, nameAuto], icon: currentIcon },
      { type: "select", "include-all": true, url: testUrl, name: namePick, filter: region.filter, icon: currentIcon },
      { type: "url-test", url: testUrl, interval: 360, lazy: false, hidden: true, "include-all": true, name: nameAuto, filter: region.filter, icon: currentIcon }
    ];
  });

  newConfig["proxy-groups"] = [
    ...mainGroups,
    { name: "BANAD", type: "select", "default-selected": "REJECT", proxies: ["REJECT", "REJECT-DROP", "PASS"], icon: `${iconBase}/Reject.png` },
    ...regionalGroups,
    { type: "url-test", url: testUrl, interval: 360, lazy: false, hidden: true, "include-all": true, name: "proxy_dns", filter: "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b", icon: `${iconBase}/SSID.png` },
    { name: "Direct", type: "select", "default-selected": "直连 | 双栈", proxies: ["直连 | 双栈", "直连 | IPv4优先", "直连 | IPv6优先"], icon: `${iconBase}/CN.png` }
  ];

  // ==================== 5. 规则集订阅 (Rule Providers, 直接覆盖) ====================
  const gitProxy = "https://ghfast.top/";
  const createMRSDomain = url => ({ type: "http", interval: 10800, behavior: "domain", format: "mrs", proxy: "Direct", url: `${gitProxy}${url}` });
  const createMRSIP = url => ({ type: "http", interval: 10800, behavior: "ipcidr", format: "mrs", proxy: "Direct", url: `${gitProxy}${url}` });
  const createClassical = url => ({ type: "http", interval: 10800, behavior: "classical", format: "yaml", proxy: "Direct", url: `${gitProxy}${url}` });

  newConfig["rule-providers"] = {
    "game_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/game.mrs"),
    "telegram_ip": createMRSIP("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geoip/telegram.mrs"),
    "telegram_domain": createMRSDomain("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/telegram.mrs"),
    "ablock_domain": createClassical("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/ablock.yaml"),
    "adblock_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/adblock.mrs"),
    "media_domain": createMRSDomain("https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/media.mrs"),
    "ai_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/ai.mrs"),
    "google_domain": createMRSDomain("https://github.com/QuixoticHeart/rule-set/raw/refs/heads/ruleset/meta/domain/google.mrs"),
    "google_fcm_domain": createMRSDomain("https://github.com/QuixoticHeart/rule-set/raw/refs/heads/ruleset/meta/domain/googlefcm.mrs"),
    "google_cn_domain": createMRSDomain("https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/google-cn.mrs"),
    "twitter_domain": createMRSDomain("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/twitter.mrs"),
    "github_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/github.mrs"),
    "pixiv_domain": createMRSDomain("https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/pixiv.mrs"),
    "bytedance_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/bytedance.mrs"),
    "proxy_emby_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/proxy_emby.mrs"),
    "direct_emby_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/direct_emby.mrs"),
    "bilibili_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/bilibili.mrs"),
    "cn_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/cn.mrs"),
    "cn_ip": createMRSIP("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/cn_ip.mrs"),
    "fakeip-filter_domain": createMRSDomain("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/fakeip-filter.mrs")
  };

  // ==================== 6. 路由规则分流 (Rules, 直接覆盖) ====================
  newConfig.rules = [
    "DST-PORT,53,dns_hijack",
    "PROCESS-NAME,jp.konami.pesam,Game",
    "RULE-SET,game_domain,Game",
    "AND,((NETWORK,UDP),(DST-PORT,443)),BANAD",
    "RULE-SET,google_fcm_domain,FCM",
    "RULE-SET,telegram_ip,Telegram,no-resolve",
    "RULE-SET,ablock_domain,BANAD",
    "RULE-SET,adblock_domain,BANAD",
    "RULE-SET,bilibili_domain,BiliBili",
    "RULE-SET,bytedance_domain,TikTok",
    "RULE-SET,ai_domain,AI",
    "RULE-SET,pixiv_domain,Pixiv",
    "RULE-SET,media_domain,Media",
    "RULE-SET,proxy_emby_domain,Media",
    "RULE-SET,github_domain,Github",
    "RULE-SET,direct_emby_domain,Direct",
    "RULE-SET,google_domain,Google",
    "RULE-SET,google_cn_domain,Google",
    "RULE-SET,twitter_domain,Twitter",
    "RULE-SET,cn_ip,Direct",
    "RULE-SET,cn_domain,Direct",
    "MATCH,Final"
  ];

  return newConfig;
}
