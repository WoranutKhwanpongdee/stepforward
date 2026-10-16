"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { demoLearners } from "../lib/demo-data";
import { priorityLabel, priorityScore, recordCheckIn, type Learner, type Status } from "../lib/logic";
import { translate, type Locale, type TranslationKey } from "../lib/i18n";

const STORE = "stepforward-learners-v3";
const LANGUAGE_STORE = "stepforward-language-v1";
const statuses: Status[] = ["On track", "Needs support", "Urgent", "Completed"];
const localeCode = (locale: Locale) => locale === "th" ? "th-TH-u-ca-buddhist" : "en-GB";
const dateLabel = (date: string, locale: Locale) => new Date(`${date}T00:00:00`).toLocaleDateString(localeCode(locale), { day: "numeric", month: "short" });
const statusKey: Record<Status, TranslationKey> = { "On track": "onTrack", "Needs support": "needsSupport", Urgent: "statusUrgent", Completed: "completed" };
const priorityKey: Record<string, TranslationKey> = { Today: "todayPriority", "This week": "followupWindowWeek", "When available": "followupWindowAvailable", "All clear": "followupWindowClear" };

function CustomSelect({ value, onChange, options, placeholder }: { value: string; onChange: (val: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);
  const selected = options.find(o => o.value === value);
  return <div className={`custom-select ${open ? "open" : ""}`} ref={ref}>
    <button type="button" className="custom-select-trigger" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
      <span className={selected ? "custom-select-label" : "custom-select-placeholder"}>{selected ? selected.label : placeholder}</span>
      <span className="custom-select-arrow">▾</span>
    </button>
    {open && <ul className="custom-select-menu" role="listbox">
      {options.map(o => <li key={o.value} role="option" aria-selected={o.value === value} className={`custom-select-item ${o.value === value ? "selected" : ""}`} onClick={() => { onChange(o.value); setOpen(false); }}>
        <span>{o.label}</span>{o.value === value && <span className="custom-select-check">✓</span>}
      </li>)}
    </ul>}
  </div>;
}

export default function Home() {
  const [learners, setLearners] = useState<Learner[]>(demoLearners);
  const [locale, setLocale] = useState<Locale>("th");
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");
  const [filter, setFilter] = useState("All learners");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState<"checkin" | "followup" | null>(null);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [checkInSubmissionId, setCheckInSubmissionId] = useState("");
  const submittingCheckIn = useRef(false);
  const submittedCheckIns = useRef(new Set<string>());
  const [form, setForm] = useState({ learnerId: "", goal: "", progress: "", confidence: 3, obstacles: "", request: "" });
  const [followForm, setFollowForm] = useState({ action: "", owner: "", note: "" });
  const t = (key: TranslationKey, values?: Record<string, string | number>) => translate(locale, key, values);
  const statusText = (status: Status) => t(statusKey[status]);
  const priorityText = (score: number) => { const key = priorityKey[priorityLabel(score)]; return t("priorityScore", { label: t(key), score }); };

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LANGUAGE_STORE);
      if (savedLocale === "en" || savedLocale === "th") setLocale(savedLocale);
      const stored = localStorage.getItem(STORE) || localStorage.getItem("stepforward-learners-v2");
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(x => x && typeof x.id === "string" && Array.isArray(x.checkIns) && Array.isArray(x.followUps))) {
          const hydrated = (parsed as Learner[]).map(l => ({
            ...l,
            checkIns: l.checkIns.map((c, idx) => ({
              ...c,
              createdAt: c.createdAt ?? demoLearners.find(d => d.id === l.id)?.checkIns[idx]?.createdAt ?? `${c.date}T10:00:00.000Z`,
            })),
          }));
          setLearners(hydrated);
        } else {
          setStorageWarning("storageUnreadable");
        }
      }
    } catch { setStorageWarning("storageCorrupt"); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORE, JSON.stringify(learners)); }
    catch { setStorageWarning("storageUnavailable"); }
  }, [learners, ready]);
  useEffect(() => { if (ready) { try { localStorage.setItem(LANGUAGE_STORE, locale); } catch { /* language remains active for this session */ } } }, [locale, ready]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  const current = learners.find(l => l.id === selected) ?? null;
  const filterKey = (value: string) => value === "All learners" ? "allLearners" : statuses.find(s => s === value) ? statusKey[value as Status] : "allLearners";
  const displayed = useMemo(() => learners.filter(l => (filter === "All learners" || l.status === filter) && l.name.toLowerCase().includes(search.toLowerCase())).sort((a,b) => priorityScore(b) - priorityScore(a)), [learners, filter, search]);
  const urgentCount = learners.filter(l => l.status === "Urgent").length;
  const supportCount = learners.filter(l => l.status === "Needs support").length;
  const openCheckin = (id = "") => { setForm({ learnerId: id, goal: "", progress: "", confidence: 3, obstacles: "", request: "" }); setCheckInSubmissionId(crypto.randomUUID()); setFormError(""); setModal("checkin"); };
  const saveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingCheckIn.current) return;
    if (!form.learnerId) { setFormError("requiredLearner"); return; }
    if (submittedCheckIns.current.has(checkInSubmissionId)) { setFormError("duplicateCheckin"); return; }
    const result = recordCheckIn(learners, form.learnerId, form, checkInSubmissionId);
    if ("errors" in result) { setFormError(Object.values(result.errors ?? {})[0] ?? "validationGeneric"); return; }
    if (result.duplicate) { setFormError("duplicateCheckin"); return; }
    submittingCheckIn.current = true;
    submittedCheckIns.current.add(checkInSubmissionId);
    setLearners(result.learners);
    setModal(null); setNotice("successCheckin");
    submittingCheckIn.current = false;
  };
  const saveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !followForm.action.trim() || !followForm.owner.trim()) { setFormError("requiredAction"); return; }
    const follow = { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), action: followForm.action.trim(), owner: followForm.owner.trim(), note: followForm.note.trim() };
    setLearners(prev => prev.map(l => l.id === current.id ? { ...l, followUps: [follow, ...l.followUps] } : l));
    setModal(null); setFollowForm({ action: "", owner: "", note: "" }); setNotice("successFollowup");
  };
  const resetDemo = () => { setLearners(demoLearners); setStorageWarning(""); setNotice("successRestore"); };

  return <main className="shell">
    <aside className="sidebar"><a className="brand" href="#home"><span className="brand-mark">↗</span><span>stepforward<small>LEARNER SUPPORT</small></span></a><div className="nav-label">{t("workspace")}</div><a className="nav-item active" href="#home"><span>▦</span> {t("overview")}</a><a className="nav-item" href="#learners"><span>◎</span> {t("learners")} <b>{new Intl.NumberFormat(localeCode(locale)).format(learners.length)}</b></a><div className="side-bottom"><div className="program-card"><div className="program-top"><span>{t("yourProgram")}</span><span>↗</span></div><strong>{t("journey")}</strong><div className="program-progress"><i /></div><small>{t("weekOf", { week: 4, month: t("programMonth") })}</small></div><div className="team"><div className="team-avatars"><i>MK</i><i>BM</i><i>DO</i></div><div><strong>{t("supportTeam")}</strong><small>{t("membersOnline")}</small></div><span className="online-dot" /></div></div></aside>
    <section className="main" id="home"><header className="topbar"><div className="breadcrumb">{t("program")} <span>/</span> <b>{t("overview")}</b></div><div className="top-actions"><button className="language-switch" aria-label="TH / EN" onClick={() => setLocale(locale === "en" ? "th" : "en")}><span className={locale === "th" ? "selected" : ""}>TH</span><i>/</i><span className={locale === "en" ? "selected" : ""}>EN</span></button><span className="today-tag">● &nbsp;{t("active")}</span><div className="profile">SP<span>{t("supportTeam")}</span></div></div></header>
      <div className="content"><div className="welcome-row"><div><p className="eyebrow">{new Intl.DateTimeFormat(localeCode(locale), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</p><h1>{t("greeting")} <span>☀</span></h1><p className="subheading">{t("dashboardSubtitle")}</p></div><button className="button primary" onClick={() => openCheckin()}>＋ &nbsp;{t("recordCheckin")}</button></div>
      {storageWarning && <div className="alert warning" role="status">{t(storageWarning as TranslationKey)} <button onClick={resetDemo}>{t("restoreDemo")}</button></div>}{notice && <div className="alert success" role="status">✓ &nbsp;{t(notice as TranslationKey)}<button aria-label={t("dismiss")} onClick={() => setNotice("")}>×</button></div>}
      <div className="stats"><article className="stat-card"><div className="stat-label">{t("activeLearners")} <span className="stat-icon lilac">◎</span></div><strong>{new Intl.NumberFormat(localeCode(locale)).format(learners.filter(l => l.status !== "Completed").length)}<small> / {new Intl.NumberFormat(localeCode(locale)).format(learners.length)}</small></strong><div className="stat-foot"><span className="tiny-bars">▂ ▄ ▆ ▅ ▇ ▆ ▇</span> {t("acrossCohort")}</div></article><article className="stat-card"><div className="stat-label">{t("needsFollowUp")} <span className="stat-icon orange">↗</span></div><strong>{new Intl.NumberFormat(localeCode(locale)).format(urgentCount + supportCount)}<small> {t("learnersWord")}</small></strong><div className="stat-foot"><span className="text-orange">{urgentCount} {t("urgent")}</span> · {supportCount} {t("needSupport")}</div></article><article className="stat-card"><div className="stat-label">{t("checkinRate")} <span className="stat-icon green">✓</span></div><strong>{new Intl.NumberFormat(localeCode(locale)).format(80)}<small>%</small></strong><div className="stat-foot"><span className="text-green">↑ {new Intl.NumberFormat(localeCode(locale)).format(8)}%</span> {t("fromLastWeek")}</div></article><article className="stat-card"><div className="stat-label">{t("programProgress")} <span className="stat-icon blue">◷</span></div><strong>{t("weekN", { week: 4 })}<small> {t("ofN", { count: 6 })}</small></strong><div className="stat-foot"><span className="progress-line"><i /></span> {t("completePercent", { percent: 67 })}</div></article></div>
      <section className="priority-panel"><div className="section-head"><div><h2>{t("priorityFollowups")} <span className="count-pill">{new Intl.NumberFormat(localeCode(locale)).format(urgentCount + supportCount)}</span></h2><p>{t("prioritySubtitle")}</p></div><button className="text-button" onClick={() => setFilter("All learners")}>{t("viewAll")} <span>→</span></button></div><div className="priority-grid">{learners.filter(l => l.status === "Urgent" || l.status === "Needs support").sort((a,b) => priorityScore(b) - priorityScore(a)).slice(0,3).map(l => <button className="priority-card" key={l.id} onClick={() => setSelected(l.id)}><div className="priority-top"><span className={`avatar ${l.status === "Urgent" ? "avatar-red" : "avatar-gold"}`}>{l.initials}</span><span className={`status ${l.status === "Urgent" ? "urgent" : "needs"}`}><i />{statusText(l.status)}</span><span className="more">···</span></div><strong>{l.name}</strong><span className="priority-goal">{l.checkIns[0]?.goal}</span><div className="priority-reason">{l.checkIns[0]?.request || l.checkIns[0]?.obstacles || t("checkinReminder")}</div><div className="priority-foot"><span>◷ &nbsp;{t(priorityKey[priorityLabel(priorityScore(l))])}</span><span>{t("openProfile")} →</span></div></button>)}</div></section>
      <section className="learners-section" id="learners"><div className="section-head"><div><h2>{t("allLearners")} <span className="count-pill pale">{new Intl.NumberFormat(localeCode(locale)).format(learners.length)}</span></h2><p>{t("keepMoving")}</p></div></div><div className="table-tools"><div className="filters" role="group" aria-label={t("allStatuses")}>{["All learners", "Needs support", "Urgent", "On track", "Completed"].map(x => <button className={filter === x ? "filter active-filter" : "filter"} key={x} onClick={() => setFilter(x)}>{t(filterKey(x))}{x === "All learners" && <span>{learners.length}</span>}</button>)}</div><label className="search"><span>⌕</span><input aria-label={t("search")} placeholder={t("search")} value={search} onChange={e => setSearch(e.target.value)} /></label></div>
      <div className="table-wrap"><table><thead><tr><th>{t("learner")}</th><th>{t("learningGoal")}</th><th>{t("week")}</th><th>{t("confidence")}</th><th>{t("status")}</th><th>{t("priority")}</th><th>{t("lastCheckin")}</th><th /></tr></thead><tbody>{displayed.map(l => { const c = l.checkIns[0]; return <tr key={l.id} onClick={() => setSelected(l.id)} tabIndex={0} onKeyDown={e => e.key === "Enter" && setSelected(l.id)}><td><div className="learner-cell"><span className={`avatar ${l.status === "Urgent" ? "avatar-red" : l.status === "Needs support" ? "avatar-gold" : "avatar-green"}`}>{l.initials}</span><strong>{l.name}</strong></div></td><td className="goal-cell">{c?.goal}</td><td>{t("weekOne", { week: l.week })}</td><td><div className="confidence"><span>{new Intl.NumberFormat(localeCode(locale)).format(c?.confidence ?? 0)}</span><span className="stars">{[1,2,3,4,5].map(i => <i key={i} className={(c?.confidence ?? 0) >= i ? "filled" : ""}>★</i>)}</span></div></td><td><span className={`status ${l.status === "Urgent" ? "urgent" : l.status === "Needs support" ? "needs" : l.status === "Completed" ? "complete" : "track"}`}><i />{statusText(l.status)}</span></td><td><span className={`priority-text ${priorityScore(l) >= 7 ? "p-high" : priorityScore(l) >= 4 ? "p-med" : "p-low"}`}><i />{t(priorityKey[priorityLabel(priorityScore(l))])}</span></td><td>{c ? dateLabel(c.date, locale) : t("noCheckin")}</td><td className="row-arrow">›</td></tr>})}{!displayed.length && <tr><td colSpan={8} className="empty">{t("noMatches")}</td></tr>}</tbody></table></div>
      <div className="table-footer">{t("showing")} <strong>{new Intl.NumberFormat(localeCode(locale)).format(displayed.length)}</strong> {t("ofLearners", { count: learners.length })} <button onClick={resetDemo}>{t("restoreDemo")}</button><span>{t("updatedNow")}</span></div></section>
      <footer>{t("footer")} <span>✳</span> &nbsp; · &nbsp; {t("programLength")}</footer></div></section>
      {current && <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setSelected(null)}><aside className="drawer" aria-label={`${current.name} ${t("profile")}`}><div className="drawer-head"><span className="eyebrow">{t("profile")}</span><button className="close" onClick={() => setSelected(null)} aria-label={t("close")}>×</button></div><div className="profile-intro"><span className="avatar avatar-lilac large">{current.initials}</span><div><h2>{current.name}</h2><p>{t("cohortWeek", { week: current.week })}</p></div></div><div className="drawer-status"><span className={`status ${current.status === "Urgent" ? "urgent" : current.status === "Needs support" ? "needs" : current.status === "Completed" ? "complete" : "track"}`}><i />{statusText(current.status)}</span><span className="priority-text"><i />{priorityText(priorityScore(current))}</span></div><div className="drawer-actions"><button className="button primary" onClick={() => openCheckin(current.id)}>＋ {t("newCheckin")}</button><button className="button outline" onClick={() => { setFormError(""); setModal("followup"); }}>{t("logFollowup")}</button></div><div className="detail-block"><span className="detail-label">{t("currentGoal")}</span><p>{current.checkIns[0]?.goal || t("noGoal")}</p><span className="detail-label">{t("latestProgress")}</span><p>{current.checkIns[0]?.progress || t("noProgress")}</p><div className="detail-confidence"><span>{t("confidence")}</span><b>{t("outOfFive", { score: current.checkIns[0]?.confidence ?? "—" })}</b><div className="confidence-meter"><i style={{ width: `${(current.checkIns[0]?.confidence ?? 0) * 20}%` }} /></div></div>{current.checkIns[0]?.obstacles && <><span className="detail-label">{t("obstacles")}</span><p>{current.checkIns[0].obstacles}</p></>}{current.checkIns[0]?.request && <div className="request-box"><span>{t("supportRequest")}</span><p>“{current.checkIns[0].request}”</p></div>}</div><div className="history"><h3>{t("history")} <span>{new Intl.NumberFormat(localeCode(locale)).format(current.checkIns.length + current.followUps.length)}</span></h3>{[...current.checkIns.map(c => ({ ...c, kind: "checkin" as const })), ...current.followUps.map(f => ({ ...f, kind: "followup" as const }))].sort((a,b) => (b.kind === "checkin" ? (b.createdAt ?? b.date) : b.date).localeCompare(a.kind === "checkin" ? (a.createdAt ?? a.date) : a.date)).map(item => <div className="history-item" key={item.id}><i className={item.kind} /><div><strong>{t(item.kind === "checkin" ? "checkinHistory" : "followupHistory")}</strong><small>{item.kind === "checkin" && item.createdAt ? new Date(item.createdAt).toLocaleString(localeCode(locale), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : dateLabel(item.date, locale)} · {item.kind === "checkin" ? t("confidenceHistory", { score: item.confidence }) : t("by", { owner: item.owner })}</small><p>{item.kind === "checkin" ? item.progress : item.action}</p></div></div>)}</div><div className="status-select"><span>{t("updateStatus")}</span><CustomSelect value={current.status} onChange={val => setLearners(prev => prev.map(l => l.id === current.id ? { ...l, status: val as Status } : l))} options={statuses.map(s => ({ value: s, label: statusText(s) }))} /></div></aside></div>}
      {modal && <div className="overlay modal-overlay" onMouseDown={e => e.target === e.currentTarget && setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span className="eyebrow">{t(modal === "checkin" ? "learnerUpdate" : "supportTeamLabel")}</span><h2 id="modal-title">{t(modal === "checkin" ? "recordCheckinTitle" : "followupTitle")}</h2><p>{t(modal === "checkin" ? "checkinIntro" : "followupIntro")}</p></div><button className="close" onClick={() => setModal(null)} aria-label={t("close")}>×</button></div>{modal === "checkin" ? <form onSubmit={saveCheckin} noValidate><label>{t("learner")} <CustomSelect value={form.learnerId} onChange={val => setForm({ ...form, learnerId: val })} placeholder={t("selectLearner")} options={learners.map(l => ({ value: l.id, label: l.name }))} /></label><label>{t("learningGoal")} <span className="required">*</span><input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder={t("goalPlaceholder")} /></label><label>{t("latestProgress")} <span className="required">*</span><textarea value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} placeholder={t("progressPlaceholder")} rows={3} /></label><fieldset><legend>{t("confidenceLevel")} <span className="required">*</span></legend><div className="rating" role="radiogroup" aria-label={t("confidenceAria")}>{[1,2,3,4,5].map(n => <button type="button" key={n} className={form.confidence === n ? "rating-on" : ""} aria-pressed={form.confidence === n} onClick={() => setForm({ ...form, confidence: n })}>{new Intl.NumberFormat(localeCode(locale)).format(n)}</button>)}</div><small>{t("confidenceScale")}</small></fieldset><label>{t("obstacles")} <span className="optional">{t("optional")}</span><textarea value={form.obstacles} onChange={e => setForm({ ...form, obstacles: e.target.value })} placeholder={t("obstaclePlaceholder")} rows={2} /></label><label>{t("supportRequest")} <span className="optional">{t("optional")}</span><textarea value={form.request} onChange={e => setForm({ ...form, request: e.target.value })} placeholder={t("requestPlaceholder")} rows={2} /></label>{formError && <p className="form-error" role="alert">{t(formError as TranslationKey)}</p>}<div className="modal-buttons"><button type="button" className="button outline" onClick={() => setModal(null)}>{t("cancel")}</button><button className="button primary">{t("saveCheckin")} <span>→</span></button></div></form> : <form onSubmit={saveFollowUp} noValidate><label>{t("learner")}<input readOnly value={current?.name ?? ""} /></label><label>{t("actionLabel")} <span className="required">*</span><textarea autoFocus value={followForm.action} onChange={e => setFollowForm({ ...followForm, action: e.target.value })} placeholder={t("actionPlaceholder")} rows={3} /></label><label>{t("supportTeam")} <span className="required">*</span><CustomSelect value={followForm.owner} onChange={val => setFollowForm({ ...followForm, owner: val })} placeholder={t("selectMember")} options={[{ value: "Mook", label: "Mook" }, { value: "Beam", label: "Beam" }, { value: "Dao", label: "Dao" }]} /></label><label>{t("nextStep")} <span className="optional">{t("optional")}</span><textarea value={followForm.note} onChange={e => setFollowForm({ ...followForm, note: e.target.value })} placeholder={t("nextStepPlaceholder")} rows={2} /></label>{formError && <p className="form-error" role="alert">{t(formError as TranslationKey)}</p>}<div className="modal-buttons"><button type="button" className="button outline" onClick={() => setModal(null)}>{t("cancel")}</button><button className="button primary">{t("saveFollowup")} <span>→</span></button></div></form>}</section></div>}
  </main>;
}
