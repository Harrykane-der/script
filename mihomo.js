function main(newConfig = {}) {
  const iconBase = "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color";
  const dnsParams = "#disable-qtype-12&disable-qtype-64&disable-qtype-65&ecs=223.160.168.99/24&ecs-override=true";
  const testUrl = "https://www.apple.com/library/test/success.html";
  const ghfastBase = "https://ghfast.top/";

  // ==================== 1. 基础与扩展配置 (使用 Object.assign 批量合并，极大减少 VM 指令数) ====================
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
    "external-ui": "ui",
    profile: {
      "store-selected": true,
      "store-fake-ip": true
    },
    tun: {
      "enable": true,
      "device": "Bettbox",
      "mtu": 65535,
      "auto-route": true,
      "auto-detect-interface": true,
      "strict-route": true,
      "stack": "mixed",
      "dns-hijack": ["any:53", "tcp://any:53"]
    },
    hosts: {
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
    },
    sniffer: {
      "enable": true,
      "force-dns-mapping": true,
      "parse-pure-ip": true,
      "override-destination": false,
      "sniff": {
        "HTTP": { "override-destination": true },
        "TLS": { "override-destination": false },
        "QUIC": { "override-destination": false }
      },
      "skip-domain": ["rule-set:telegram_domain"],
      "skip-dst-address": ["rule-set:telegram_ip"],
      "skip-src-address": ["rule-set:telegram_ip"]
    }
  });

  // ==================== 2. DNS 配置 (精简单次使用变量，降低内存分配开销) ====================
  const dns_direct = [`https://pz.fyi/dns-query${dnsParams}`, `https://dns.alidns.com/dns-query${dnsParams}&h3=true`, `https://doh.pub/dns-query${dnsParams}`, "system"];
  const dns_proxy = [`https://unfiltered.adguard-dns.com/dns-query${dnsParams}&h3=true&proxy_dns`, `https://pz.fyi/dns-query${dnsParams}`, `https://dns.google/dns-query${dnsParams}&h3=true&proxy_dns`];
  const dns_creamdata = ["https://prolonged3729.com:443/dns-query/f77b88da-2cd8-4f69-92b1-d171a41f294d"];
  const dns_nexitally = ["https://prolonged3729.com:443/dns-query/8203f7dc-afa4-40cf-9b4b-190497da7b85"];
  const dns_fakeip = ["rcode://name_error"];

  newConfig.dns = {
    "enable": true,
    "ipv6": false,
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
    "default-nameserver": ["quic://106.54.11.55:853", "tls://120.53.53.53:853", "quic://223.5.5.5:853", "quic://94.140.14.140:853", "tls://8.8.8.8:853"],
    "nameserver": dns_proxy,
    "nameserver-policy": {
      "rule-set:game_domain": dns_fakeip,
      "rule-set:adblock_domain": ["rcode://success"],
      "rule-set:proxy_emby_domain": dns_proxy,
      "rule-set:direct_emby_domain": dns_direct,
      "rule-set:fakeip-filter_domain": dns_direct,
      "rule-set:bytedance_domain": dns_fakeip,
      "rule-set:bilibili_domain": dns_fakeip,
      "rule-set:cn_domain": dns_direct,
      "+.*": dns_fakeip
    },
    "direct-nameserver-follow-policy": true,
    "direct-nameserver": dns_direct,
    "proxy-server-nameserver": [`https://dns.alidns.com/dns-query${dnsParams}&h3=true`, `https://pz.fyi/dns-query${dnsParams}`, `https://doh.pub/dns-query${dnsParams}`, "system"],
    "proxy-server-nameserver-policy": {
      "+.623ccd.rjsqsn.xyz": dns_creamdata,
      "+.6aad4e.fomlrq.xyz": dns_creamdata,
      "+.a6f7e5e493.8c5ecp7fb.sbs": dns_nexitally,
      "+.af81085c6d.h5dhwpd92.sbs": dns_nexitally
    }
  };

  // ==================== 3. 注入基础节点 ====================
  newConfig.proxies = [
    { name: "直连 | 双栈", type: "direct", udp: true, icon: `${iconBase}/CN.png` },
    { name: "直连 | IPv4优先", type: "direct", udp: true, "ip-version": "ipv4-prefer", icon: `${iconBase}/CN.png` },
    { name: "直连 | IPv6优先", type: "direct", udp: true, "ip-version": "ipv6-prefer", icon: `${iconBase}/CN.png` },
    { name: "dns_hijack", type: "dns" }
  ];

  // ==================== 4. 策略组矩阵数据驱动 (ES6+ 数组解构 + for-of 循环，高性能与可读性完美契合) ====================
  const regionProxies = ["HK", "JP", "SG", "US", "DE", "OT", "Gamer", "Direct"];
  const proxyGroups = [];

  const mainGroupsRaw = [
    ["Final", "HK", "Final.png"], ["Game", "Gamer", "Game.png"], ["Telegram", "SG", "Telegram.png"],
    ["Google", "HK", "Google_Search.png"], ["BiliBili", "HK", "bilibili_3.png"], ["AI", "JP", "ChatGPT.png"],
    ["Pixiv", "JP", "Pornhub_2.png"], ["TikTok", "DE", "TikTok.png"], ["Twitter", "DE", "Twitter.png"],
    ["FCM", "Direct", "iCloud.png"], ["Github", "HK", "GitHub.png"], ["Media", "HK", "ForeignMedia.png"]
  ];

  for (const [name, defaultSelected, icon] of mainGroupsRaw) {
    proxyGroups.push({
      name,
      type: "select",
      "default-selected": defaultSelected,
      proxies: regionProxies,
      icon: `${iconBase}/${icon}`
    });
  }

  proxyGroups.push({
    name: "BANAD",
    type: "select",
    "default-selected": "REJECT", 
    proxies: ["REJECT", "REJECT-DROP", "PASS"],
    icon: `${iconBase}/Reject.png` 
  });

  const regionalGroupsRaw = [
    ["Gamer", "Game.png", "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b|🇯🇵|日本|\\bJP\\b|\\bjapan\\b"],
    ["HK", "HK.png", "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b"],
    ["JP", "JP.png", "(?i)🇯🇵|日本|\\bJP\\b|\\bjapan\\b"],
    ["SG", "SG.png", "(?i)🇸🇬|新加坡|狮城|\\bSG\\b|\\bsingapore\\b"],
    ["US", "US.png", "(?i)🇺🇸|美国|\\bUS\\b|\\bunitedstates\\b|\\bunited\\s?states\\b"],
    ["DE", "DE.png", "(?i)🇩🇪|德国|\\bDE\\b|\\bgermany\\b"],
    ["OT", "UN.png", "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇸🇬|🇺🇸|🇩🇪|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b|日本|\\bJP\\b|\\bjapan\\b|新加坡|狮城|\\bSG\\b|\\bsingapore\\b|美国|\\bUS\\b|\\bunitedstates\\b|\\bunited\\s?states\\b|德国|\\bDE\\b|\\bgermany\\b|ADGUARD|dns|直连)).*"]
  ];

  for (const [name, icon, filter] of regionalGroupsRaw) {
    proxyGroups.push({
      name,
      type: "url-test",
      url: testUrl,
      interval: 360,
      lazy: true,
      "include-all": true,
      filter,
      icon: `${iconBase}/${icon}`
    });
  }

  proxyGroups.push(
    {      
      type: "url-test",
      url: testUrl,
      interval: 360,
      lazy: false,
      hidden: true,
      "include-all": true,
      name: "proxy_dns",
      filter: "(?i)🇭🇰|香港|\\bHK\\b|\\bhongkong\\b|\\bhong\\s?kong\\b",
      icon: `${iconBase}/SSID.png`
    },
    {
      name: "Direct",
      type: "select",
      "default-selected": "直连 | 双栈",
      proxies: ["直连 | 双栈", "直连 | IPv4优先", "直连 | IPv6优先"],
      icon: `${iconBase}/CN.png`
    }
  );

  newConfig["proxy-groups"] = proxyGroups;

  // ==================== 5. 规则集订阅 (统一工厂函数 + 前缀复用) ====================
  const buildRule = (url, behavior, format = "mrs") => ({
    type: "http",
    interval: 10800,
    behavior,
    format,
    proxy: "Direct",
    url: `${ghfastBase}${url}`
  });

  newConfig["rule-providers"] = {
    "game_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/game.mrs", "domain"),
    "telegram_ip": buildRule("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geoip/telegram.mrs", "ipcidr"),
    "telegram_domain": buildRule("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/telegram.mrs", "domain"),
    "adblock_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/adblock.mrs", "domain"),
    "media_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/media.mrs", "domain"),
    "ai_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/ai.mrs", "domain"),
    "google_domain": buildRule("https://github.com/QuixoticHeart/rule-set/raw/refs/heads/ruleset/meta/domain/google.mrs", "domain"),
    "google_fcm_domain": buildRule("https://github.com/QuixoticHeart/rule-set/raw/refs/heads/ruleset/meta/domain/googlefcm.mrs", "domain"),
    "google_cn_domain": buildRule("https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/google-cn.mrs", "domain"),
    "twitter_domain": buildRule("https://github.com/MetaCubeX//meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/twitter.mrs", "domain"),
    "github_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/github.mrs", "domain"),
    "pixiv_domain": buildRule("https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo-lite/geosite/pixiv.mrs", "domain"),
    "bytedance_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/bytedance.mrs", "domain"),
    "proxy_emby_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/proxy_emby.mrs", "domain"),
    "direct_emby_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/direct_emby.mrs", "domain"),
    "bilibili_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/bilibili.mrs", "domain"),
    "cn_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/cn.mrs", "domain"),
    "cn_ip": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/cn_ip.mrs", "ipcidr"),
    "fakeip-filter_domain": buildRule("https://github.com/Harrykane-der/rule-conversion/raw/refs/heads/release/fakeip-filter.mrs", "domain")
  };

  // ==================== 6. 路由规则分流 ====================
  newConfig.rules = [
    "DST-PORT,53,dns_hijack",
    "PROCESS-NAME,jp.konami.pesam,Game",
    "RULE-SET,game_domain,Game",
    "AND,((NETWORK,UDP),(DST-PORT,443)),BANAD",
    "DST-PORT,3478-3481/5349/10000/19302-19309,BANAD",
    "RULE-SET,google_fcm_domain,FCM",
    "RULE-SET,telegram_domain,Telegram",
    "RULE-SET,telegram_ip,Telegram,no-resolve",
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
