Some Ideas to think about:

1. 
I want to be able to give context to some transactions.
So for example if I Pay for a gift or a dinner and then i get some back because we decided to split it. Then I want to connect these two transactions -> to say "hey these are actually together."

2.
I was think about making a scanner that can scan receipts, as to say this transaction is actually many different items. Low prio tho

3. Do we need to connect userid to transactions?

4. Should we mark unprocessed transactions as processed or delete them when processed? 


Next step:
- Create category pages
- Create bank account pages
- Decide on transaction table 
- Process transactions
- Transaction pages

## Tasks / TODO

### Transaction identity redesign (survive Tink re-auth) — see plan
- [ ] App-owned `cuid()` PK; demote Tink `id` to debug-only `tinkId`
- [ ] Anchor identity on `providerTransactionId` + deterministic `contentKey` fallback
- [ ] Persist PENDING and promote in place when it books (no duplicates)
- [ ] Single `Transaction` table + `processedAt` flag (settles "processed vs delete")
- [ ] App-driven matching (find-then-write, batch-claim dedup); match amounts as Decimal, not float

### Bugs
- [ ] EditableCell hardcodes the `"accounts"` FormList path — breaks swap in the transactions table
- [ ] Map Tink type/status strings → Prisma enums explicitly (no direct assignment)
- [ ] `SyncTransactions` `useEffect([transactions])` re-runs every render (new array ref)
- [ ] Upgrade antd v5 → v6 to fix the `[antd: compatible]` React 19 warning at the source — v6 supports React 19 natively, so remove `@ant-design/v5-patch-for-react-19` (package + the `app/layout.tsx` import; no warning-suppression needed). Note: React 19 / Next 15 are fine — antd is the ceiling, not them. Migration guide: https://ant.design/docs/react/migration-v6/
  - **Audit verdict: low–moderate effort (~1–2h), low risk** — none of the changed Table/Steps/Menu/Button/Input props are actually used here.
  - Main work: rewrite the 16 deep `antd/es/...` imports (across ~13 files) to public ones — `Form.Item`, `Form.List`, `Typography.Text/Title/Paragraph/Link`, `Layout.Content/Footer/Header`, `Layout.Sider`, `Statistic.Countdown`; delete the unused `antd/es/menu/MenuItem` in `layout.tsx` (shadowed by the local `MenuItem` type).
  - Bump `@ant-design/icons` `^5` → `^6` (required by v6; icon names unchanged). Verify `@ant-design/nextjs-registry` has a v6-compatible release.
  - Verify during upgrade: Typography `Text type=` values in `EditableCell`, and any antd internal class names targeted in `globals.css` (v6 tweaked internal DOM).
- [ ] Fix `useForm` "not connected to any Form element" (code bug, not a version issue) — `SyncTransactions` early-returns the empty state before the `<Form form={form}>` mounts; render the Form unconditionally (empty state inside) or guard the `setFieldsValue` effect

### Token lifecycle (the "connection can't stay live" gripe)
- [ ] Implement Tink refresh-token flow; stop deleting the account on expiry (`FindAccount`)
- [ ] Store absolute expiry (callback stores `expires_in` duration as `expires_at`); fix `id_token`/`id_hint` mapping

### Architecture
- [ ] Decide source of truth for display: DB-backed vs live Tink fetch on every query

### Hygiene
- [ ] Remove debug `console.log`s leaking transaction/account data (Tink.ts, SyncTransactions, BankAccount.ts)
- [ ] Remove hardcoded `"SEK"` currency fallbacks

### Ideas
- [ ] Link related transactions (e.g. split a bill / refund)
- [ ] Receipt scanner: one transaction → many line items (low prio)