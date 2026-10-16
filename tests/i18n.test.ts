import test from "node:test";
import assert from "node:assert/strict";
import { messages, translate, type Locale } from "../lib/i18n.ts";
import { validateCheckIn } from "../lib/logic.ts";

test("Thai and English catalogs contain a translation for every UI key", () => {
  const englishKeys = Object.keys(messages.en).sort();
  assert.deepEqual(Object.keys(messages.th).sort(), englishKeys);
  for (const locale of ["en", "th"] as Locale[]) {
    for (const key of englishKeys as (keyof typeof messages.en)[]) {
      assert.ok(messages[locale][key].trim(), `${locale}.${key} should not be empty`);
    }
  }
});

test("check-in validation and success text are available in both languages", () => {
  const errorKey = validateCheckIn({ goal: "", progress: "", confidence: 3 }).errors.goal;
  assert.equal(errorKey, "validationGoal");
  assert.equal(translate("en", errorKey!), "Please add a learning goal.");
  assert.equal(translate("th", errorKey!), "กรุณาระบุเป้าหมายการเรียนรู้");
  assert.notEqual(translate("en", "successCheckin"), translate("th", "successCheckin"));
  assert.notEqual(translate("en", "successFollowup"), translate("th", "successFollowup"));
});

test("localized labels format interpolation values with locale number rules", () => {
  assert.equal(translate("en", "weekOne", { week: 4 }), "Week 4");
  assert.equal(translate("th", "weekOne", { week: 4 }), "สัปดาห์ที่ 4");
  assert.notEqual(translate("en", "statusUrgent"), translate("th", "statusUrgent"));
});
