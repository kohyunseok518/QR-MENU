import { describe, expect, it } from "vitest";
import { formatPrice, matchLocale, resolveLocale } from "./locale";

describe("language selection", () => {
  it("gives an explicit URL language priority over storage and the browser", () => {
    expect(resolveLocale("?lang=en", "ko", ["zh-TW"])).toBe("en");
  });
  it("uses storage before browser preferences", () =>
    expect(resolveLocale("", "zh-Hant", ["en"])).toBe("zh-Hant"));
  it.each(["zh-TW", "zh-HK", "zh-MO", "zh-Hant"])(
    "maps %s to traditional Chinese",
    (value) => expect(matchLocale(value)).toBe("zh-Hant"),
  );
  it.each(["zh-CN", "zh-SG", "zh-Hans", "zh"])(
    "maps %s to simplified Chinese",
    (value) => expect(matchLocale(value)).toBe("zh-Hans"),
  );
  it("gives an explicit script priority over the region", () =>
    expect(matchLocale("zh-Hans-TW")).toBe("zh-Hans"));
  it("skips unsupported and invalid preferences", () =>
    expect(resolveLocale("?lang=ja", "not_a_locale", ["fr", "en-GB"])).toBe(
      "en",
    ));
  it("defaults to Korean", () =>
    expect(resolveLocale("", null, [])).toBe("ko"));
  it("does not convert the underlying KRW amount for other languages", () => {
    for (const locale of ["ko", "en", "zh-Hans", "zh-Hant"] as const)
      expect(formatPrice(12000, locale)).toContain("12,000");
  });
});
